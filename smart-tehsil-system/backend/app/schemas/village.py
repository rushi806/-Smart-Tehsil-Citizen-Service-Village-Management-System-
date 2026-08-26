from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date
from app.models.village import Village


class GramPanchayatBase(BaseModel):
    name: str
    name_hi: Optional[str] = None
    name_mr: Optional[str] = None
    district: Optional[str] = None
    tehsil: Optional[str] = None
    description: Optional[str] = None
    contact_person: Optional[str] = None
    contact_phone: Optional[str] = None


class GramPanchayatCreate(GramPanchayatBase):
    pass


class GramPanchayatOut(GramPanchayatBase):
    id: int
    created_at: datetime
    model_config = {"from_attributes": True}


class VillageBase(BaseModel):
    name: str
    name_hi: Optional[str] = None
    name_mr: Optional[str] = None
    gram_panchayat_id: Optional[int] = None
    tehsil: Optional[str] = None
    district: Optional[str] = None
    pin_code: Optional[str] = None
    population: Optional[int] = None
    households: Optional[int] = None
    area_hectares: Optional[float] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    has_school: bool = False
    has_health_centre: bool = False
    has_anganwadi: bool = False
    has_govt_office: bool = False
    has_water_facility: bool = False
    has_electricity: bool = False
    has_paved_road: bool = False
    schools_info: Optional[str] = None
    health_centres_info: Optional[str] = None
    government_offices_info: Optional[str] = None
    important_contacts: Optional[str] = None
    nearby_villages: Optional[str] = None
    description: Optional[str] = None
    is_active: bool = True


class VillageCreate(VillageBase):
    pass


class VillageUpdate(VillageBase):
    name: Optional[str] = None


class VillageOut(VillageBase):
    id: int
    created_at: datetime
    gram_panchayat_name: Optional[str] = None
    model_config = {"from_attributes": True}


class VillageMapOut(BaseModel):
    id: int
    name: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    population: Optional[int] = None
    gram_panchayat_name: Optional[str] = None
    pin_code: Optional[str] = None
    model_config = {"from_attributes": True}
