import re
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional

from app.database.db import get_db
from app.models.user import User
from app.models.service import Service, FAQ
from app.models.document import RequiredDocument
from app.models.staff import Department
from app.schemas.service import (
    ServiceOut, ServiceCreate, ServiceUpdate, ServiceListOut,
    FAQCreate, FAQOut,
    RequiredDocumentCreate, RequiredDocumentOut,
)
from app.core.security import get_current_user, require_roles
from app.services.audit_service import log_action

router = APIRouter(prefix="/api/services", tags=["Services"])


def make_slug(name: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return slug


def _enrich_service(svc: Service) -> dict:
    d = svc.__dict__.copy()
    d["department_name"] = svc.department.name if svc.department else None
    return d


@router.get("/", response_model=List[ServiceListOut])
def list_services(
    skip: int = 0,
    limit: int = 50,
    category: Optional[str] = None,
    department_id: Optional[int] = None,
    featured: bool = False,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    q = db.query(Service).options(joinedload(Service.department)).filter(Service.is_active == True)
    if category:
        q = q.filter(Service.category == category)
    if department_id:
        q = q.filter(Service.department_id == department_id)
    if featured:
        q = q.filter(Service.is_featured == True)
    if search:
        q = q.filter(Service.name.ilike(f"%{search}%"))
    q = q.order_by(Service.sort_order, Service.name)
    svcs = q.offset(skip).limit(limit).all()
    return [ServiceListOut.model_validate(_enrich_service(s)) for s in svcs]


@router.get("/{service_id}", response_model=ServiceOut)
def get_service(service_id: int, db: Session = Depends(get_db)):
    svc = (
        db.query(Service)
        .options(
            joinedload(Service.department),
            joinedload(Service.required_documents),
            joinedload(Service.faqs),
        )
        .filter(Service.id == service_id, Service.is_active == True)
        .first()
    )
    if not svc:
        raise HTTPException(status_code=404, detail="Service not found")
    return ServiceOut.model_validate(_enrich_service(svc))


@router.get("/slug/{slug}", response_model=ServiceOut)
def get_service_by_slug(slug: str, db: Session = Depends(get_db)):
    svc = (
        db.query(Service)
        .options(joinedload(Service.department), joinedload(Service.required_documents), joinedload(Service.faqs))
        .filter(Service.slug == slug, Service.is_active == True)
        .first()
    )
    if not svc:
        raise HTTPException(status_code=404, detail="Service not found")
    return ServiceOut.model_validate(_enrich_service(svc))


@router.post("/", response_model=ServiceOut, status_code=201)
def create_service(
    payload: ServiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    slug = payload.slug or make_slug(payload.name)
    if db.query(Service).filter(Service.slug == slug).first():
        slug = f"{slug}-{db.query(Service).count()}"
    svc = Service(**payload.model_dump(exclude={"slug"}), slug=slug)
    db.add(svc)
    log_action(db, current_user, "CREATE", "services", description=f"Created service {payload.name}")
    db.commit()
    db.refresh(svc)
    return ServiceOut.model_validate(_enrich_service(svc))


@router.put("/{service_id}", response_model=ServiceOut)
def update_service(
    service_id: int,
    payload: ServiceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    svc = db.query(Service).filter(Service.id == service_id).first()
    if not svc:
        raise HTTPException(status_code=404, detail="Service not found")
    for k, v in payload.model_dump(exclude_none=True).items():
        setattr(svc, k, v)
    log_action(db, current_user, "UPDATE", "services", record_id=service_id, description=f"Updated service {svc.name}")
    db.commit()
    db.refresh(svc)
    return ServiceOut.model_validate(_enrich_service(svc))


@router.delete("/{service_id}")
def delete_service(
    service_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    svc = db.query(Service).filter(Service.id == service_id).first()
    if not svc:
        raise HTTPException(status_code=404, detail="Service not found")
    svc.is_active = False
    log_action(db, current_user, "DELETE", "services", record_id=service_id)
    db.commit()
    return {"message": "Service deactivated"}


# ---- Required Documents ----
@router.post("/{service_id}/documents", response_model=RequiredDocumentOut, status_code=201)
def add_required_document(
    service_id: int,
    payload: RequiredDocumentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    svc = db.query(Service).filter(Service.id == service_id).first()
    if not svc:
        raise HTTPException(status_code=404, detail="Service not found")
    doc = RequiredDocument(**payload.model_dump(), service_id=service_id)
    db.add(doc)
    log_action(db, current_user, "CREATE", "required_documents", description=f"Added doc to service {service_id}")
    db.commit()
    db.refresh(doc)
    return doc


@router.delete("/documents/{doc_id}")
def delete_required_document(
    doc_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    doc = db.query(RequiredDocument).filter(RequiredDocument.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    db.delete(doc)
    db.commit()
    return {"message": "Document deleted"}


# ---- FAQs ----
@router.post("/{service_id}/faqs", response_model=FAQOut, status_code=201)
def add_faq(
    service_id: int,
    payload: FAQCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    faq = FAQ(**payload.model_dump(), service_id=service_id)
    db.add(faq)
    db.commit()
    db.refresh(faq)
    return faq
