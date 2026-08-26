import uuid
from datetime import date
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload

from app.database.db import get_db
from app.models.user import User
from app.models.appointment import Appointment, TimeSlot, AppointmentStatus, SlotStatus
from app.models.notification import Notification, NotificationType
from app.schemas.appointment import AppointmentCreate, AppointmentOut, TimeSlotCreate, TimeSlotOut
from app.core.security import get_current_user, require_roles

router = APIRouter(prefix="/api/appointments", tags=["Appointments"])


@router.get("/slots", response_model=List[TimeSlotOut])
def get_slots(
    department_id: int,
    slot_date: date,
    db: Session = Depends(get_db),
):
    return (
        db.query(TimeSlot)
        .filter(TimeSlot.department_id == department_id, TimeSlot.slot_date == slot_date)
        .all()
    )


@router.post("/slots", response_model=TimeSlotOut, status_code=201)
def create_slot(
    payload: TimeSlotCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    slot = TimeSlot(**payload.model_dump())
    db.add(slot)
    db.commit()
    db.refresh(slot)
    return slot


@router.post("/", response_model=AppointmentOut, status_code=201)
def book_appointment(
    payload: AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("citizen", "staff", "officer", "admin")),
):
    slot = db.query(TimeSlot).filter(TimeSlot.id == payload.time_slot_id).first()
    if not slot:
        raise HTTPException(status_code=404, detail="Time slot not found")
    if not slot.is_available:
        raise HTTPException(status_code=400, detail="Time slot is not available")

    appt_id = f"APT-{uuid.uuid4().hex[:8].upper()}"
    appt = Appointment(
        appointment_id=appt_id,
        user_id=current_user.id,
        department_id=payload.department_id,
        service_id=payload.service_id,
        staff_id=payload.staff_id,
        time_slot_id=payload.time_slot_id,
        citizen_name=current_user.full_name,
        citizen_phone=current_user.phone,
        purpose=payload.purpose,
        notes=payload.notes,
        status=AppointmentStatus.booked,
    )
    slot.booked_count += 1
    if slot.booked_count >= slot.capacity:
        slot.status = SlotStatus.booked

    db.add(appt)

    notif = Notification(
        user_id=current_user.id,
        type=NotificationType.appointment_booked,
        title="Appointment Booked",
        message=f"Appointment {appt_id} booked for {slot.slot_date} at {slot.start_time}.",
        link="/citizen/appointments",
    )
    db.add(notif)
    db.commit()
    db.refresh(appt)

    # Enrich with slot info
    result = appt.__dict__.copy()
    result["department_name"] = appt.department.name if appt.department else None
    result["service_name"] = appt.service.name if appt.service else None
    result["slot_date"] = slot.slot_date
    result["slot_start_time"] = slot.start_time
    result["slot_end_time"] = slot.end_time
    return AppointmentOut.model_validate(result)


@router.get("/", response_model=List[AppointmentOut])
def list_appointments(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = db.query(Appointment).options(
        joinedload(Appointment.department),
        joinedload(Appointment.service),
        joinedload(Appointment.time_slot),
    )
    if current_user.role.value == "citizen":
        q = q.filter(Appointment.user_id == current_user.id)
    appts = q.order_by(Appointment.created_at.desc()).offset(skip).limit(limit).all()

    result = []
    for a in appts:
        d = a.__dict__.copy()
        d["department_name"] = a.department.name if a.department else None
        d["service_name"] = a.service.name if a.service else None
        d["slot_date"] = a.time_slot.slot_date if a.time_slot else None
        d["slot_start_time"] = a.time_slot.start_time if a.time_slot else None
        d["slot_end_time"] = a.time_slot.end_time if a.time_slot else None
        result.append(AppointmentOut.model_validate(d))
    return result


@router.patch("/{appt_id}/cancel")
def cancel_appointment(
    appt_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    appt = db.query(Appointment).filter(Appointment.id == appt_id).first()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    if current_user.role.value == "citizen" and appt.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    appt.status = AppointmentStatus.cancelled
    slot = db.query(TimeSlot).filter(TimeSlot.id == appt.time_slot_id).first()
    if slot and slot.booked_count > 0:
        slot.booked_count -= 1
        slot.status = SlotStatus.available
    db.commit()
    return {"message": "Appointment cancelled"}
