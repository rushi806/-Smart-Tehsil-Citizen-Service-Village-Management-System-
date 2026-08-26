import enum
from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, Enum as SAEnum,
    Text, ForeignKey, Date
)
from sqlalchemy.orm import relationship
from app.database.db import Base


class StaffStatus(str, enum.Enum):
    present = "PRESENT"
    absent = "ABSENT"
    on_leave = "ON_LEAVE"
    busy = "BUSY"
    offline = "OFFLINE"


class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), unique=True, nullable=False)
    code = Column(String(20), unique=True, nullable=True)
    description = Column(Text, nullable=True)
    head_name = Column(String(200), nullable=True)
    location = Column(String(300), nullable=True)
    phone = Column(String(15), nullable=True)
    email = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    staff = relationship("Staff", back_populates="department")
    services = relationship("Service", back_populates="department")
    time_slots = relationship("TimeSlot", back_populates="department")
    tokens = relationship("Token", back_populates="department")


class Staff(Base):
    __tablename__ = "staff"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    employee_id = Column(String(50), unique=True, nullable=True)
    designation = Column(String(200), nullable=False)
    office_room = Column(String(100), nullable=True)
    official_phone = Column(String(15), nullable=True)
    official_email = Column(String(255), nullable=True)
    responsibilities = Column(Text, nullable=True)
    working_days = Column(String(200), default="Monday to Friday")
    working_hours = Column(String(100), default="10:00 AM - 5:00 PM")
    status = Column(SAEnum(StaffStatus), default=StaffStatus.offline)
    is_public = Column(Boolean, default=True)  # show in public directory
    photo = Column(String(500), nullable=True)
    join_date = Column(Date, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="staff_profile")
    department = relationship("Department", back_populates="staff")
    appointments = relationship("Appointment", back_populates="staff_member")
    assigned_applications = relationship("Application", back_populates="assigned_staff", foreign_keys="Application.assigned_staff_id")
