import enum
from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, Enum as SAEnum,
    Text, ForeignKey, Date
)
from sqlalchemy.orm import relationship
from app.database.db import Base


class TokenStatus(str, enum.Enum):
    waiting = "WAITING"
    called = "CALLED"
    serving = "SERVING"
    completed = "COMPLETED"
    skipped = "SKIPPED"
    cancelled = "CANCELLED"


class Token(Base):
    __tablename__ = "tokens"

    id = Column(Integer, primary_key=True, index=True)
    token_number = Column(String(20), nullable=False)   # e.g. "A-124"
    token_date = Column(Date, nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    citizen_name = Column(String(200), nullable=True)
    citizen_phone = Column(String(15), nullable=True)
    purpose = Column(Text, nullable=True)

    status = Column(SAEnum(TokenStatus), default=TokenStatus.waiting)
    queue_position = Column(Integer, nullable=True)
    called_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    estimated_wait_minutes = Column(Integer, default=0)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    citizen = relationship("User", back_populates="tokens")
    department = relationship("Department", back_populates="tokens")
    service = relationship("Service")
