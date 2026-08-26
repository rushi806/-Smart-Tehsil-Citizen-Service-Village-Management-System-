import enum
from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, Enum as SAEnum,
    Text, ForeignKey
)
from sqlalchemy.orm import relationship
from app.database.db import Base


class ComplaintStatus(str, enum.Enum):
    submitted = "SUBMITTED"
    in_review = "IN_REVIEW"
    assigned = "ASSIGNED"
    resolved = "RESOLVED"
    closed = "CLOSED"


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    complaint_number = Column(String(30), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)

    subject = Column(String(500), nullable=False)
    description = Column(Text, nullable=False)
    attachment_url = Column(String(500), nullable=True)

    status = Column(SAEnum(ComplaintStatus), default=ComplaintStatus.submitted)
    resolution_note = Column(Text, nullable=True)

    submitted_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    resolved_at = Column(DateTime, nullable=True)

    citizen = relationship("User", back_populates="complaints", foreign_keys=[user_id])
    assignee = relationship("User", foreign_keys=[assigned_to])
    department = relationship("Department")
