from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.staff import StaffStatus


class DepartmentBase(BaseModel):
    name: str
    code: Optional[str] = None
    description: Optional[str] = None
    head_name: Optional[str] = None
    location: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None


class DepartmentCreate(DepartmentBase):
    pass


class DepartmentUpdate(DepartmentBase):
    name: Optional[str] = None


class DepartmentOut(DepartmentBase):
    id: int
    is_active: bool
    created_at: datetime
    model_config = {"from_attributes": True}


class StaffBase(BaseModel):
    designation: str
    department_id: Optional[int] = None
    employee_id: Optional[str] = None
    office_room: Optional[str] = None
    official_phone: Optional[str] = None
    official_email: Optional[str] = None
    responsibilities: Optional[str] = None
    working_days: Optional[str] = "Monday to Friday"
    working_hours: Optional[str] = "10:00 AM - 5:00 PM"
    is_public: bool = True


class StaffCreate(StaffBase):
    user_id: int


class StaffUpdate(StaffBase):
    designation: Optional[str] = None
    status: Optional[StaffStatus] = None


class StaffOut(StaffBase):
    id: int
    user_id: int
    status: StaffStatus
    photo: Optional[str] = None
    join_date: Optional[datetime] = None
    created_at: datetime
    # nested
    user_full_name: Optional[str] = None
    user_email: Optional[str] = None
    department_name: Optional[str] = None
    model_config = {"from_attributes": True}


class StaffStatusUpdate(BaseModel):
    status: StaffStatus
