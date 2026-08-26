import enum
from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, Enum as SAEnum,
    Text, ForeignKey
)
from sqlalchemy.orm import relationship
from app.database.db import Base


class NotificationType(str, enum.Enum):
    application_submitted = "APPLICATION_SUBMITTED"
    application_status_changed = "APPLICATION_STATUS_CHANGED"
    appointment_booked = "APPOINTMENT_BOOKED"
    appointment_reminder = "APPOINTMENT_REMINDER"
    token_generated = "TOKEN_GENERATED"
    complaint_status_changed = "COMPLAINT_STATUS_CHANGED"
    new_notice = "NEW_NOTICE"
    general = "GENERAL"


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(SAEnum(NotificationType), default=NotificationType.general)
    title = Column(String(300), nullable=False)
    message = Column(Text, nullable=False)
    link = Column(String(500), nullable=True)   # in-app deep link
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="notifications")
