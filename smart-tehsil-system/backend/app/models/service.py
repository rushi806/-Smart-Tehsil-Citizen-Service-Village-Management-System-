from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime,
    Text, ForeignKey, Float, JSON
)
from sqlalchemy.orm import relationship
from app.database.db import Base


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(300), nullable=False, index=True)
    name_hi = Column(String(300), nullable=True)   # Hindi
    name_mr = Column(String(300), nullable=True)   # Marathi
    slug = Column(String(300), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    eligibility = Column(Text, nullable=True)
    fees = Column(Float, default=0.0)
    processing_time_days = Column(Integer, default=7)
    application_procedure = Column(Text, nullable=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    responsible_designation = Column(String(200), nullable=True)
    office_room = Column(String(100), nullable=True)
    application_link = Column(String(500), nullable=True)
    form_download_url = Column(String(500), nullable=True)
    icon = Column(String(100), default="file-text")
    category = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    department = relationship("Department", back_populates="services")
    required_documents = relationship("RequiredDocument", back_populates="service", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="service")
    faqs = relationship("FAQ", back_populates="service", cascade="all, delete-orphan")


class FAQ(Base):
    __tablename__ = "faqs"

    id = Column(Integer, primary_key=True, index=True)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=True)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    category = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    service = relationship("Service", back_populates="faqs")
