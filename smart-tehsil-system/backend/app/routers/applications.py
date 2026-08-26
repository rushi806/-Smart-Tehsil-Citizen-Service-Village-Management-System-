import os
import uuid
from datetime import datetime, timezone
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session, joinedload

from app.database.db import get_db
from app.models.user import User
from app.models.application import Application, ApplicationDocument, ApplicationStatus
from app.models.service import Service
from app.models.notification import Notification, NotificationType
from app.schemas.application import ApplicationCreate, ApplicationOut, ApplicationStatusUpdate
from app.core.security import get_current_user, require_roles
from app.core.config import settings
from app.services.audit_service import log_action

router = APIRouter(prefix="/api/applications", tags=["Applications"])

ALLOWED_TYPES = {"application/pdf", "image/jpeg", "image/jpg", "image/png"}
ALLOWED_EXTS = {".pdf", ".jpg", ".jpeg", ".png"}


def generate_app_number(service: Service, db: Session) -> str:
    prefix = "".join([c for c in service.name.upper() if c.isalpha()])[:3]
    year = datetime.now().year
    count = db.query(Application).count() + 1
    return f"{prefix}-{year}-{count:06d}"


def _enrich_app(app: Application) -> dict:
    d = app.__dict__.copy()
    d["service_name"] = app.service.name if app.service else None
    return d


@router.post("/", response_model=ApplicationOut, status_code=201)
def create_application(
    payload: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("citizen", "staff", "officer", "admin")),
):
    service = db.query(Service).filter(Service.id == payload.service_id, Service.is_active == True).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    app_number = generate_app_number(service, db)
    timeline_entry = {
        "status": ApplicationStatus.submitted.value,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "note": "Application submitted successfully",
    }

    application = Application(
        application_number=app_number,
        user_id=current_user.id,
        service_id=payload.service_id,
        applicant_name=current_user.full_name,
        applicant_phone=current_user.phone,
        applicant_email=current_user.email,
        applicant_address=payload.applicant_address or current_user.address,
        purpose=payload.purpose,
        status=ApplicationStatus.submitted,
        timeline=[timeline_entry],
    )
    db.add(application)

    # Notification
    notif = Notification(
        user_id=current_user.id,
        type=NotificationType.application_submitted,
        title="Application Submitted",
        message=f"Your application {app_number} for {service.name} has been submitted.",
        link=f"/citizen/applications",
    )
    db.add(notif)
    db.commit()
    db.refresh(application)
    return ApplicationOut.model_validate(_enrich_app(application))


@router.get("/", response_model=List[ApplicationOut])
def list_applications(
    skip: int = 0,
    limit: int = 20,
    status: Optional[str] = None,
    service_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = db.query(Application).options(joinedload(Application.service), joinedload(Application.documents))
    role = current_user.role.value
    if role == "citizen":
        q = q.filter(Application.user_id == current_user.id)
    elif role == "staff":
        q = q.filter(Application.assigned_staff_id == current_user.staff_profile.id if current_user.staff_profile else -1)
    # officer and admin see all
    if status:
        q = q.filter(Application.status == status)
    if service_id:
        q = q.filter(Application.service_id == service_id)
    q = q.order_by(Application.submitted_at.desc())
    apps = q.offset(skip).limit(limit).all()
    return [ApplicationOut.model_validate(_enrich_app(a)) for a in apps]


@router.get("/track/{app_number}", response_model=ApplicationOut)
def track_application(app_number: str, db: Session = Depends(get_db)):
    """Public endpoint — citizen can track without login using app number."""
    app = (
        db.query(Application)
        .options(joinedload(Application.service), joinedload(Application.documents))
        .filter(Application.application_number == app_number)
        .first()
    )
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return ApplicationOut.model_validate(_enrich_app(app))


@router.get("/{app_id}", response_model=ApplicationOut)
def get_application(
    app_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    app = (
        db.query(Application)
        .options(joinedload(Application.service), joinedload(Application.documents))
        .filter(Application.id == app_id)
        .first()
    )
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    # Citizens can only view their own
    if current_user.role.value == "citizen" and app.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    return ApplicationOut.model_validate(_enrich_app(app))


@router.patch("/{app_id}/status", response_model=ApplicationOut)
def update_application_status(
    app_id: int,
    payload: ApplicationStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "officer", "staff")),
):
    app = db.query(Application).options(joinedload(Application.service)).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    old_status = app.status
    app.status = payload.status
    if payload.remarks:
        app.remarks = payload.remarks
    if payload.rejection_reason:
        app.rejection_reason = payload.rejection_reason
    if payload.status == ApplicationStatus.completed:
        app.completed_at = datetime.now(timezone.utc)

    # Append to timeline
    timeline = list(app.timeline or [])
    timeline.append({
        "status": payload.status.value,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "note": payload.remarks or f"Status updated to {payload.status.value}",
        "updated_by": current_user.full_name,
    })
    app.timeline = timeline

    # Notification to citizen
    notif = Notification(
        user_id=app.user_id,
        type=NotificationType.application_status_changed,
        title="Application Status Updated",
        message=f"Your application {app.application_number} status changed to {payload.status.value}.",
        link="/citizen/applications",
    )
    db.add(notif)
    log_action(db, current_user, "UPDATE", "applications", record_id=app_id,
               description=f"Status {old_status} → {payload.status.value}")
    db.commit()
    db.refresh(app)
    return ApplicationOut.model_validate(_enrich_app(app))


@router.post("/{app_id}/upload-document")
async def upload_document(
    app_id: int,
    document_name: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    if current_user.role.value == "citizen" and app.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    # Validate file type
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTS:
        raise HTTPException(status_code=400, detail=f"File type not allowed. Use: {', '.join(ALLOWED_EXTS)}")
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Invalid content type")

    # Read and validate size
    content = await file.read()
    if len(content) > settings.max_upload_bytes:
        raise HTTPException(status_code=400, detail=f"File too large. Max {settings.MAX_UPLOAD_SIZE_MB}MB")

    # Save securely
    safe_name = f"{uuid.uuid4()}{ext}"
    app_dir = os.path.join(settings.UPLOAD_DIR, f"app_{app_id}")
    os.makedirs(app_dir, exist_ok=True)
    file_path = os.path.join(app_dir, safe_name)
    with open(file_path, "wb") as f:
        f.write(content)

    doc = ApplicationDocument(
        application_id=app_id,
        document_name=document_name,
        file_path=file_path,
        file_name=file.filename,
        file_size=len(content),
        mime_type=file.content_type,
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return {"message": "Document uploaded", "document_id": doc.id}
