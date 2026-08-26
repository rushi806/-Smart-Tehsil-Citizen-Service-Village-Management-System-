from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, DateTime, Text, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from app.database.db import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String(100), nullable=False)      # CREATE, UPDATE, DELETE
    module = Column(String(100), nullable=False)      # services, villages, etc.
    record_id = Column(Integer, nullable=True)        # affected record
    description = Column(Text, nullable=True)         # human-readable summary
    old_values = Column(JSON, nullable=True)
    new_values = Column(JSON, nullable=True)
    ip_address = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="audit_logs")
