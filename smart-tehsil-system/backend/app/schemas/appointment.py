from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date
from app.models.appointment import AppointmentStatus, SlotStatus


class TimeSlotBase(BaseModel):
    department_id: int
    slot_date: date
    start_time: str
    end_time: str
    capacity: int = 1


class TimeSlotCreate(TimeSlotBase):
    pass


class TimeSlotOut(TimeSlotBase):
    id: int
    booked_count: int
    status: SlotStatus
    model_config = {"from_attributes": True}


class AppointmentCreate(BaseModel):
    department_id: int
    service_id: Optional[int] = None
    staff_id: Optional[int] = None
    time_slot_id: int
    purpose: Optional[str] = None
    notes: Optional[str] = None


class AppointmentOut(BaseModel):
    id: int
    appointment_id: str
    user_id: int
    department_id: int
    service_id: Optional[int] = None
    staff_id: Optional[int] = None
    time_slot_id: int
    citizen_name: str
    citizen_phone: Optional[str] = None
    purpose: Optional[str] = None
    notes: Optional[str] = None
    status: AppointmentStatus
    created_at: datetime
    updated_at: datetime
    # Nested info
    department_name: Optional[str] = None
    service_name: Optional[str] = None
    slot_date: Optional[date] = None
    slot_start_time: Optional[str] = None
    slot_end_time: Optional[str] = None
    model_config = {"from_attributes": True}
