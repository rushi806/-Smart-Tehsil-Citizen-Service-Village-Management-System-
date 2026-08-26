from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.database.db import get_db
from app.models.user import User
from app.models.village import Village, GramPanchayat
from app.schemas.village import (
    VillageOut, VillageCreate, VillageUpdate, VillageMapOut,
    GramPanchayatOut, GramPanchayatCreate,
)
from app.core.security import get_current_user, require_roles
from app.services.audit_service import log_action

router = APIRouter(prefix="/api/villages", tags=["Villages"])
gp_router = APIRouter(prefix="/api/gram-panchayats", tags=["Gram Panchayats"])


# ---- Gram Panchayat ----
@gp_router.get("/", response_model=List[GramPanchayatOut])
def list_gram_panchayats(db: Session = Depends(get_db)):
    return db.query(GramPanchayat).all()


@gp_router.post("/", response_model=GramPanchayatOut, status_code=201)
def create_gram_panchayat(
    payload: GramPanchayatCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    gp = GramPanchayat(**payload.model_dump())
    db.add(gp)
    db.commit()
    db.refresh(gp)
    return gp


# ---- Villages ----
def _enrich_village(v: Village) -> dict:
    d = v.__dict__.copy()
    d["gram_panchayat_name"] = v.gram_panchayat.name if v.gram_panchayat else None
    return d


@router.get("/", response_model=List[VillageOut])
def list_villages(
    skip: int = 0,
    limit: int = 50,
    search: Optional[str] = None,
    gram_panchayat_id: Optional[int] = None,
    db: Session = Depends(get_db),
):
    q = db.query(Village).options(joinedload(Village.gram_panchayat)).filter(Village.is_active == True)
    if search:
        q = q.filter(Village.name.ilike(f"%{search}%"))
    if gram_panchayat_id:
        q = q.filter(Village.gram_panchayat_id == gram_panchayat_id)
    villages = q.offset(skip).limit(limit).all()
    return [VillageOut.model_validate(_enrich_village(v)) for v in villages]


@router.get("/map", response_model=List[VillageMapOut])
def get_villages_for_map(db: Session = Depends(get_db)):
    """Returns lightweight data for Leaflet map markers."""
    villages = (
        db.query(Village)
        .options(joinedload(Village.gram_panchayat))
        .filter(Village.is_active == True, Village.latitude.isnot(None), Village.longitude.isnot(None))
        .all()
    )
    result = []
    for v in villages:
        result.append(VillageMapOut.model_validate({
            "id": v.id,
            "name": v.name,
            "latitude": v.latitude,
            "longitude": v.longitude,
            "population": v.population,
            "gram_panchayat_name": v.gram_panchayat.name if v.gram_panchayat else None,
            "pin_code": v.pin_code,
        }))
    return result


@router.get("/{village_id}", response_model=VillageOut)
def get_village(village_id: int, db: Session = Depends(get_db)):
    v = db.query(Village).options(joinedload(Village.gram_panchayat)).filter(Village.id == village_id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Village not found")
    return VillageOut.model_validate(_enrich_village(v))


@router.post("/", response_model=VillageOut, status_code=201)
def create_village(
    payload: VillageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    v = Village(**payload.model_dump())
    db.add(v)
    log_action(db, current_user, "CREATE", "villages", description=f"Created village {payload.name}")
    db.commit()
    db.refresh(v)
    return VillageOut.model_validate(_enrich_village(v))


@router.put("/{village_id}", response_model=VillageOut)
def update_village(
    village_id: int,
    payload: VillageUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    v = db.query(Village).filter(Village.id == village_id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Village not found")
    for k, val in payload.model_dump(exclude_none=True).items():
        setattr(v, k, val)
    log_action(db, current_user, "UPDATE", "villages", record_id=village_id)
    db.commit()
    db.refresh(v)
    return VillageOut.model_validate(_enrich_village(v))


@router.delete("/{village_id}")
def delete_village(
    village_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    v = db.query(Village).filter(Village.id == village_id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Village not found")
    v.is_active = False
    db.commit()
    return {"message": "Village deactivated"}
