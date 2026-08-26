import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.user import User
from app.models.scheme import GovernmentScheme
from app.models.notice import Notice, NoticeCategory, NoticePriority
from app.models.complaint import Complaint, ComplaintStatus
from app.models.feedback import Feedback
from app.models.ai_kb import AIKnowledgeBase
from app.models.notification import Notification
from app.schemas.misc import (
    SchemeCreate, SchemeOut,
    NoticeCreate, NoticeOut,
    ComplaintCreate, ComplaintOut, ComplaintStatusUpdate,
    FeedbackCreate, FeedbackOut,
    AIKBCreate, AIKBOut,
    NotificationOut,
)
from app.core.security import get_current_user, require_roles
from app.services.audit_service import log_action
from datetime import datetime, timezone

schemes_router = APIRouter(prefix="/api/schemes", tags=["Schemes"])
notices_router = APIRouter(prefix="/api/notices", tags=["Notices"])
complaints_router = APIRouter(prefix="/api/complaints", tags=["Complaints"])
feedback_router = APIRouter(prefix="/api/feedback", tags=["Feedback"])
ai_kb_router = APIRouter(prefix="/api/ai-knowledge", tags=["AI Knowledge Base"])
notifications_router = APIRouter(prefix="/api/notifications", tags=["Notifications"])


# ==================== SCHEMES ====================

@schemes_router.get("/", response_model=List[SchemeOut])
def list_schemes(
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    q = db.query(GovernmentScheme).filter(GovernmentScheme.is_active == True)
    if category:
        q = q.filter(GovernmentScheme.category == category)
    if search:
        q = q.filter(GovernmentScheme.name.ilike(f"%{search}%"))
    return q.order_by(GovernmentScheme.name).all()


@schemes_router.get("/{scheme_id}", response_model=SchemeOut)
def get_scheme(scheme_id: int, db: Session = Depends(get_db)):
    s = db.query(GovernmentScheme).filter(GovernmentScheme.id == scheme_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return s


@schemes_router.post("/", response_model=SchemeOut, status_code=201)
def create_scheme(
    payload: SchemeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    s = GovernmentScheme(**payload.model_dump())
    db.add(s)
    log_action(db, current_user, "CREATE", "schemes")
    db.commit()
    db.refresh(s)
    return s


@schemes_router.put("/{scheme_id}", response_model=SchemeOut)
def update_scheme(
    scheme_id: int,
    payload: SchemeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    s = db.query(GovernmentScheme).filter(GovernmentScheme.id == scheme_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Scheme not found")
    for k, v in payload.model_dump(exclude_none=True).items():
        setattr(s, k, v)
    db.commit()
    db.refresh(s)
    return s


@schemes_router.delete("/{scheme_id}")
def delete_scheme(
    scheme_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    s = db.query(GovernmentScheme).filter(GovernmentScheme.id == scheme_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Scheme not found")
    s.is_active = False
    db.commit()
    return {"message": "Scheme deactivated"}


# ==================== NOTICES ====================

@notices_router.get("/", response_model=List[NoticeOut])
def list_notices(
    category: Optional[str] = None,
    db: Session = Depends(get_db),
):
    q = db.query(Notice).filter(Notice.is_published == True)
    if category:
        q = q.filter(Notice.category == category)
    return q.order_by(Notice.created_at.desc()).limit(50).all()


@notices_router.get("/{notice_id}", response_model=NoticeOut)
def get_notice(notice_id: int, db: Session = Depends(get_db)):
    n = db.query(Notice).filter(Notice.id == notice_id).first()
    if not n:
        raise HTTPException(status_code=404, detail="Notice not found")
    return n


@notices_router.post("/", response_model=NoticeOut, status_code=201)
def create_notice(
    payload: NoticeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "officer")),
):
    n = Notice(**payload.model_dump(), published_by=current_user.id)
    db.add(n)
    log_action(db, current_user, "CREATE", "notices")
    db.commit()
    db.refresh(n)
    return n


@notices_router.put("/{notice_id}", response_model=NoticeOut)
def update_notice(
    notice_id: int,
    payload: NoticeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "officer")),
):
    n = db.query(Notice).filter(Notice.id == notice_id).first()
    if not n:
        raise HTTPException(status_code=404, detail="Notice not found")
    for k, v in payload.model_dump(exclude_none=True).items():
        setattr(n, k, v)
    db.commit()
    db.refresh(n)
    return n


@notices_router.delete("/{notice_id}")
def delete_notice(
    notice_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    n = db.query(Notice).filter(Notice.id == notice_id).first()
    if not n:
        raise HTTPException(status_code=404, detail="Notice not found")
    db.delete(n)
    db.commit()
    return {"message": "Notice deleted"}


# ==================== COMPLAINTS ====================

def _complaint_number(db: Session) -> str:
    count = db.query(Complaint).count() + 1
    year = datetime.now().year
    return f"CMP-{year}-{count:05d}"


@complaints_router.post("/", response_model=ComplaintOut, status_code=201)
def submit_complaint(
    payload: ComplaintCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    c = Complaint(
        complaint_number=_complaint_number(db),
        user_id=current_user.id,
        department_id=payload.department_id,
        subject=payload.subject,
        description=payload.description,
        status=ComplaintStatus.submitted,
    )
    db.add(c)
    db.commit()
    db.refresh(c)
    d = c.__dict__.copy()
    d["citizen_name"] = current_user.full_name
    d["department_name"] = c.department.name if c.department else None
    return ComplaintOut.model_validate(d)


@complaints_router.get("/track/{complaint_number}", response_model=ComplaintOut)
def track_complaint(complaint_number: str, db: Session = Depends(get_db)):
    c = db.query(Complaint).filter(Complaint.complaint_number == complaint_number).first()
    if not c:
        raise HTTPException(status_code=404, detail="Complaint not found")
    d = c.__dict__.copy()
    d["citizen_name"] = c.citizen.full_name if c.citizen else None
    d["department_name"] = c.department.name if c.department else None
    return ComplaintOut.model_validate(d)


@complaints_router.get("/", response_model=List[ComplaintOut])
def list_complaints(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = db.query(Complaint)
    if current_user.role.value == "citizen":
        q = q.filter(Complaint.user_id == current_user.id)
    complaints = q.order_by(Complaint.submitted_at.desc()).offset(skip).limit(limit).all()
    result = []
    for c in complaints:
        d = c.__dict__.copy()
        d["citizen_name"] = c.citizen.full_name if c.citizen else None
        d["department_name"] = c.department.name if c.department else None
        result.append(ComplaintOut.model_validate(d))
    return result


@complaints_router.patch("/{complaint_id}/status", response_model=ComplaintOut)
def update_complaint_status(
    complaint_id: int,
    payload: ComplaintStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "officer")),
):
    c = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Complaint not found")
    c.status = payload.status
    if payload.resolution_note:
        c.resolution_note = payload.resolution_note
    if payload.assigned_to:
        c.assigned_to = payload.assigned_to
    if payload.status == ComplaintStatus.resolved:
        c.resolved_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(c)
    d = c.__dict__.copy()
    d["citizen_name"] = c.citizen.full_name if c.citizen else None
    d["department_name"] = c.department.name if c.department else None
    return ComplaintOut.model_validate(d)


# ==================== FEEDBACK ====================

@feedback_router.post("/", response_model=FeedbackOut, status_code=201)
def submit_feedback(
    payload: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not (1 <= payload.rating <= 5):
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    fb = Feedback(**payload.model_dump(), user_id=current_user.id)
    db.add(fb)
    db.commit()
    db.refresh(fb)
    d = fb.__dict__.copy()
    d["citizen_name"] = current_user.full_name
    return FeedbackOut.model_validate(d)


@feedback_router.get("/", response_model=List[FeedbackOut])
def list_feedback(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "officer")),
):
    fbs = db.query(Feedback).order_by(Feedback.created_at.desc()).offset(skip).limit(limit).all()
    result = []
    for fb in fbs:
        d = fb.__dict__.copy()
        d["citizen_name"] = fb.citizen.full_name if fb.citizen else None
        result.append(FeedbackOut.model_validate(d))
    return result


# ==================== AI KNOWLEDGE BASE ====================

@ai_kb_router.get("/", response_model=List[AIKBOut])
def list_kb(
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    q = db.query(AIKnowledgeBase)
    if category:
        q = q.filter(AIKnowledgeBase.category == category)
    return q.all()


@ai_kb_router.post("/", response_model=AIKBOut, status_code=201)
def create_kb_entry(
    payload: AIKBCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    kb = AIKnowledgeBase(**payload.model_dump())
    db.add(kb)
    db.commit()
    db.refresh(kb)
    return kb


@ai_kb_router.put("/{kb_id}", response_model=AIKBOut)
def update_kb_entry(
    kb_id: int,
    payload: AIKBCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    kb = db.query(AIKnowledgeBase).filter(AIKnowledgeBase.id == kb_id).first()
    if not kb:
        raise HTTPException(status_code=404, detail="KB entry not found")
    for k, v in payload.model_dump().items():
        setattr(kb, k, v)
    db.commit()
    db.refresh(kb)
    return kb


@ai_kb_router.delete("/{kb_id}")
def delete_kb_entry(
    kb_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    kb = db.query(AIKnowledgeBase).filter(AIKnowledgeBase.id == kb_id).first()
    if not kb:
        raise HTTPException(status_code=404, detail="KB entry not found")
    db.delete(kb)
    db.commit()
    return {"message": "KB entry deleted"}


# ==================== NOTIFICATIONS ====================

@notifications_router.get("/", response_model=List[NotificationOut])
def get_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Notification)
        .filter(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc())
        .limit(50)
        .all()
    )


@notifications_router.patch("/{notif_id}/read")
def mark_read(
    notif_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    n = db.query(Notification).filter(
        Notification.id == notif_id, Notification.user_id == current_user.id
    ).first()
    if not n:
        raise HTTPException(status_code=404, detail="Notification not found")
    n.is_read = True
    db.commit()
    return {"message": "Marked as read"}


@notifications_router.patch("/read-all")
def mark_all_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db.query(Notification).filter(
        Notification.user_id == current_user.id, Notification.is_read == False
    ).update({"is_read": True})
    db.commit()
    return {"message": "All notifications marked as read"}
