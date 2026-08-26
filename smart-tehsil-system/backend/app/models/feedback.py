from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, Float,
    Text, ForeignKey
)
from sqlalchemy.orm import relationship
from app.database.db import Base


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    application_id = Column(Integer, ForeignKey("applications.id"), nullable=True)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)

    rating = Column(Integer, nullable=False)  # 1–5
    feedback_text = Column(Text, nullable=True)
    is_public = Column(Boolean, default=False)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    citizen = relationship("User", back_populates="feedback")
    application = relationship("Application", back_populates="feedback")
    service = relationship("Service")
    department = relationship("Department")
