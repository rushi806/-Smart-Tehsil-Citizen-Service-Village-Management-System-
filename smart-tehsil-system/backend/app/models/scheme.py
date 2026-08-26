from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, Text, ForeignKey
)
from sqlalchemy.orm import relationship
from app.database.db import Base
from app.models.village import village_scheme_association


class GovernmentScheme(Base):
    __tablename__ = "government_schemes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(300), nullable=False, index=True)
    name_hi = Column(String(300), nullable=True)
    name_mr = Column(String(300), nullable=True)
    description = Column(Text, nullable=True)
    eligibility = Column(Text, nullable=True)
    benefits = Column(Text, nullable=True)
    required_documents = Column(Text, nullable=True)
    application_process = Column(Text, nullable=True)
    department = Column(String(200), nullable=True)
    official_website = Column(String(500), nullable=True)
    category = Column(String(100), nullable=True)  # student, farmer, women, etc.
    is_active = Column(Boolean, default=True)
    last_updated = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    villages = relationship("Village", secondary=village_scheme_association, back_populates="schemes")
