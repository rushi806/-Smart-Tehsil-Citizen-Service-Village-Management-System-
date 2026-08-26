import enum
from datetime import datetime, timezone, date
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, Enum as SAEnum,
    Text, ForeignKey, Date, Time
)
from sqlalchemy.orm import relationship
from app.database.db import Base


class AppointmentStatus(str, enum.Enum):
    booked = "BOOKED"
    confirmed = "CONFIRMED"
    completed = "COMPLETED"
    cancelled = "CANCELLED"
    no_show = "NO_SHOW"


class SlotStatus(str, enum.Enum):
    available = "AVAILABLE"
    booked = "BOOKED"
    unavailable = "UNAVAILABLE"


class TimeSlot(Base):
    __tablename__ = "time_slots"

    id = Column(Integer, primary_key=True, index=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    slot_date = Column(Date, nullable=False)
    start_time = Column(String(10), nullable=False)  # "10:00"
    end_time = Column(String(10), nullable=False)    # "10:30"
    capacity = Column(Integer, default=1)
    booked_count = Column(Integer, default=0)
    status = Column(SAEnum(SlotStatus), default=SlotStatus.available)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    department = relationship("Department", back_populates="time_slots")
    appointments = relationship("Appointment", back_populates="time_slot")

    @property
    def is_available(self):
        return self.status == SlotStatus.available and self.booked_count < self.capacity


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    appointment_id = Column(String(30), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=True)
    staff_id = Column(Integer, ForeignKey("staff.id"), nullable=True)
    time_slot_id = Column(Integer, ForeignKey("time_slots.id"), nullable=False)

    citizen_name = Column(String(200), nullable=False)
    citizen_phone = Column(String(15), nullable=True)
    purpose = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)

    status = Column(SAEnum(AppointmentStatus), default=AppointmentStatus.booked)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    citizen = relationship("User", back_populates="appointments")
    department = relationship("Department")
    service = relationship("Service")
    staff_member = relationship("Staff", back_populates="appointments")
    time_slot = relationship("TimeSlot", back_populates="appointments")
