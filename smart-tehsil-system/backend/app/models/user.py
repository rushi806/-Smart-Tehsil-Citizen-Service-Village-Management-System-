import enum
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum as SAEnum, Text
from sqlalchemy.orm import relationship
from app.database.db import Base


class UserRole(str, enum.Enum):
    citizen = "citizen"
    staff = "staff"
    officer = "officer"
    admin = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(200), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(15), unique=True, index=True, nullable=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(SAEnum(UserRole), default=UserRole.citizen, nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    profile_photo = Column(String(500), nullable=True)
    aadhaar_number = Column(String(12), nullable=True)  # stored masked
    address = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships with explicit foreign_keys where ambiguous
    applications = relationship("Application", back_populates="applicant", foreign_keys="Application.user_id")
    appointments = relationship("Appointment", back_populates="citizen")
    tokens = relationship("Token", back_populates="citizen")
    complaints = relationship("Complaint", back_populates="citizen", foreign_keys="Complaint.user_id")
    feedback = relationship("Feedback", back_populates="citizen")
    notifications = relationship("Notification", back_populates="user")
    staff_profile = relationship("Staff", back_populates="user", uselist=False)
    audit_logs = relationship("AuditLog", back_populates="user")

    def __repr__(self):
        return f"<User {self.email} ({self.role.value})>"
