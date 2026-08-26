from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from typing import List, Optional

from app.database.db import get_db
from app.models.service import Service
from app.models.village import Village
from app.models.scheme import GovernmentScheme
from app.models.notice import Notice
from app.models.staff import Staff, Department
from app.models.user import User

router = APIRouter(prefix="/api/search", tags=["Search"])


@router.get("/")
def global_search(q: str = Query(..., min_length=2), db: Session = Depends(get_db)):
    results = {
        "services": [],
        "villages": [],
        "schemes": [],
        "notices": [],
        "staff": [],
    }
    term = f"%{q}%"

    services = (
        db.query(Service)
        .filter(Service.is_active == True, Service.name.ilike(term))
        .limit(5).all()
    )
    results["services"] = [{"id": s.id, "name": s.name, "category": s.category, "slug": s.slug} for s in services]

    villages = (
        db.query(Village)
        .filter(Village.is_active == True, Village.name.ilike(term))
        .limit(5).all()
    )
    results["villages"] = [{"id": v.id, "name": v.name, "district": v.district} for v in villages]

    schemes = (
        db.query(GovernmentScheme)
        .filter(GovernmentScheme.is_active == True, GovernmentScheme.name.ilike(term))
        .limit(5).all()
    )
    results["schemes"] = [{"id": s.id, "name": s.name, "category": s.category} for s in schemes]

    notices = (
        db.query(Notice)
        .filter(Notice.is_published == True, Notice.title.ilike(term))
        .limit(5).all()
    )
    results["notices"] = [{"id": n.id, "title": n.title, "category": n.category} for n in notices]

    staff = (
        db.query(Staff)
        .join(User)
        .filter(Staff.is_public == True, User.full_name.ilike(term))
        .limit(5).all()
    )
    results["staff"] = [
        {"id": s.id, "name": s.user.full_name, "designation": s.designation}
        for s in staff
    ]

    total = sum(len(v) for v in results.values())
    return {"query": q, "total": total, "results": results}
