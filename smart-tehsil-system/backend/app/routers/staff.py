from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional

from app.database.db import get_db
from app.models.user import User
from app.models.staff import Staff, Department, StaffStatus
from app.schemas.staff import (
    StaffOut, StaffCreate, StaffUpdate, StaffStatusUpdate,
    DepartmentOut, DepartmentCreate, DepartmentUpdate
)
from app.core.security import get_current_user, require_roles
from app.services.audit_service import log_action

router = APIRouter(prefix="/api/staff", tags=["Staff"])
dept_router = APIRouter(prefix="/api/departments", tags=["Departments"])


# ---- DEPARTMENTS ----

@dept_router.get("/", response_model=List[DepartmentOut])
def list_departments(db: Session = Depends(get_db)):
    return db.query(Department).filter(Department.is_active == True).all()


@dept_router.post("/", response_model=DepartmentOut, status_code=201)
def create_department(
    payload: DepartmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    dept = Department(**payload.model_dump())
    db.add(dept)
    log_action(db, current_user, "CREATE", "departments", description=f"Created dept {payload.name}")
    db.commit()
    db.refresh(dept)
    return dept


@dept_router.put("/{dept_id}", response_model=DepartmentOut)
def update_department(
    dept_id: int,
    payload: DepartmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    dept = db.query(Department).filter(Department.id == dept_id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
    for k, v in payload.model_dump(exclude_none=True).items():
        setattr(dept, k, v)
    db.commit()
    db.refresh(dept)
    return dept


@dept_router.delete("/{dept_id}")
def delete_department(
    dept_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    dept = db.query(Department).filter(Department.id == dept_id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
    dept.is_active = False
    db.commit()
    return {"message": "Department deactivated"}


# ---- STAFF ----

def _enrich_staff(staff: Staff) -> dict:
    d = {
        "id": staff.id,
        "user_id": staff.user_id,
        "designation": staff.designation,
        "department_id": staff.department_id,
        "employee_id": staff.employee_id,
        "office_room": staff.office_room,
        "official_phone": staff.official_phone,
        "official_email": staff.official_email,
        "responsibilities": staff.responsibilities,
        "working_days": staff.working_days,
        "working_hours": staff.working_hours,
        "is_public": staff.is_public,
        "status": staff.status,
        "photo": staff.photo,
        "join_date": staff.join_date,
        "created_at": staff.created_at,
        "user_full_name": staff.user.full_name if staff.user else None,
        "user_email": staff.user.email if staff.user else None,
        "department_name": staff.department.name if staff.department else None,
    }
    return d


@router.get("/", response_model=List[StaffOut])
def list_staff(
    public_only: bool = True,
    department_id: Optional[int] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    q = db.query(Staff).options(joinedload(Staff.user), joinedload(Staff.department))
    if public_only:
        q = q.filter(Staff.is_public == True)
    if department_id:
        q = q.filter(Staff.department_id == department_id)
    if search:
        q = q.join(User).filter(User.full_name.ilike(f"%{search}%"))
    staff_list = q.all()
    return [StaffOut.model_validate(_enrich_staff(s)) for s in staff_list]


@router.get("/{staff_id}", response_model=StaffOut)
def get_staff(staff_id: int, db: Session = Depends(get_db)):
    staff = db.query(Staff).options(joinedload(Staff.user), joinedload(Staff.department)).filter(Staff.id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    return StaffOut.model_validate(_enrich_staff(staff))


@router.post("/", response_model=StaffOut, status_code=201)
def create_staff(
    payload: StaffCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    if db.query(Staff).filter(Staff.user_id == payload.user_id).first():
        raise HTTPException(status_code=400, detail="Staff profile already exists for this user")
    staff = Staff(**payload.model_dump())
    db.add(staff)
    log_action(db, current_user, "CREATE", "staff")
    db.commit()
    db.refresh(staff)
    db.refresh(staff, ["user", "department"])
    return StaffOut.model_validate(_enrich_staff(staff))


@router.put("/{staff_id}", response_model=StaffOut)
def update_staff(
    staff_id: int,
    payload: StaffUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "officer")),
):
    staff = db.query(Staff).filter(Staff.id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    for k, v in payload.model_dump(exclude_none=True).items():
        setattr(staff, k, v)
    log_action(db, current_user, "UPDATE", "staff", record_id=staff_id)
    db.commit()
    db.refresh(staff)
    return StaffOut.model_validate(_enrich_staff(staff))


@router.patch("/{staff_id}/status", response_model=StaffOut)
def update_staff_status(
    staff_id: int,
    payload: StaffStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    staff = db.query(Staff).filter(Staff.id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    # Staff can update own status; admin/officer can update any
    is_own = staff.user_id == current_user.id
    is_privileged = current_user.role.value in ("admin", "officer")
    if not is_own and not is_privileged:
        raise HTTPException(status_code=403, detail="Not authorized to update this staff status")
    staff.status = payload.status
    db.commit()
    db.refresh(staff)
    return StaffOut.model_validate(_enrich_staff(staff))


@router.delete("/{staff_id}")
def delete_staff(
    staff_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    staff = db.query(Staff).filter(Staff.id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    db.delete(staff)
    db.commit()
    return {"message": "Staff deleted"}
