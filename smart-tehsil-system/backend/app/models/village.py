from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, Float,
    Text, ForeignKey, Table
)
from sqlalchemy.orm import relationship
from app.database.db import Base


# Many-to-many: village ↔ government scheme
village_scheme_association = Table(
    "village_scheme_association",
    Base.metadata,
    Column("village_id", Integer, ForeignKey("villages.id")),
    Column("scheme_id", Integer, ForeignKey("government_schemes.id")),
)


class GramPanchayat(Base):
    __tablename__ = "gram_panchayats"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    name_hi = Column(String(200), nullable=True)
    name_mr = Column(String(200), nullable=True)
    district = Column(String(200), nullable=True)
    tehsil = Column(String(200), nullable=True)
    description = Column(Text, nullable=True)
    contact_person = Column(String(200), nullable=True)
    contact_phone = Column(String(15), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    villages = relationship("Village", back_populates="gram_panchayat")


class Village(Base):
    __tablename__ = "villages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, index=True)
    name_hi = Column(String(200), nullable=True)
    name_mr = Column(String(200), nullable=True)
    gram_panchayat_id = Column(Integer, ForeignKey("gram_panchayats.id"), nullable=True)
    tehsil = Column(String(200), nullable=True)
    district = Column(String(200), nullable=True)
    pin_code = Column(String(10), nullable=True)

    # Demographics
    population = Column(Integer, nullable=True)
    households = Column(Integer, nullable=True)
    area_hectares = Column(Float, nullable=True)

    # Map coordinates
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    # Infrastructure
    has_school = Column(Boolean, default=False)
    has_health_centre = Column(Boolean, default=False)
    has_anganwadi = Column(Boolean, default=False)
    has_govt_office = Column(Boolean, default=False)
    has_water_facility = Column(Boolean, default=False)
    has_electricity = Column(Boolean, default=False)
    has_paved_road = Column(Boolean, default=False)

    # Detailed info
    schools_info = Column(Text, nullable=True)
    health_centres_info = Column(Text, nullable=True)
    government_offices_info = Column(Text, nullable=True)
    important_contacts = Column(Text, nullable=True)
    nearby_villages = Column(Text, nullable=True)
    description = Column(Text, nullable=True)

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    gram_panchayat = relationship("GramPanchayat", back_populates="villages")
    schemes = relationship("GovernmentScheme", secondary=village_scheme_association, back_populates="villages")
