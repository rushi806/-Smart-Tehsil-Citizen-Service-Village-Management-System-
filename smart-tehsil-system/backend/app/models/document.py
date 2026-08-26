from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database.db import Base


class RequiredDocument(Base):
    __tablename__ = "required_documents"

    id = Column(Integer, primary_key=True, index=True)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=False)
    document_name = Column(String(300), nullable=False)
    document_name_hi = Column(String(300), nullable=True)
    document_name_mr = Column(String(300), nullable=True)
    description = Column(Text, nullable=True)
    is_mandatory = Column(Boolean, default=True)
    accepted_formats = Column(String(200), default="PDF, JPG, PNG")
    max_size_mb = Column(Integer, default=2)
    notes = Column(Text, nullable=True)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    service = relationship("Service", back_populates="required_documents")
