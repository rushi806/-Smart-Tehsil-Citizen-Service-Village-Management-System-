from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class RequiredDocumentBase(BaseModel):
    document_name: str
    document_name_hi: Optional[str] = None
    document_name_mr: Optional[str] = None
    description: Optional[str] = None
    is_mandatory: bool = True
    accepted_formats: Optional[str] = "PDF, JPG, PNG"
    max_size_mb: int = 2
    notes: Optional[str] = None
    sort_order: int = 0


class RequiredDocumentCreate(RequiredDocumentBase):
    service_id: int


class RequiredDocumentOut(RequiredDocumentBase):
    id: int
    service_id: int
    created_at: datetime
    model_config = {"from_attributes": True}


class FAQBase(BaseModel):
    question: str
    answer: str
    category: Optional[str] = None
    sort_order: int = 0
    is_active: bool = True


class FAQCreate(FAQBase):
    service_id: Optional[int] = None


class FAQOut(FAQBase):
    id: int
    service_id: Optional[int] = None
    created_at: datetime
    model_config = {"from_attributes": True}


class ServiceBase(BaseModel):
    name: str
    name_hi: Optional[str] = None
    name_mr: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    eligibility: Optional[str] = None
    fees: float = 0.0
    processing_time_days: int = 7
    application_procedure: Optional[str] = None
    department_id: Optional[int] = None
    responsible_designation: Optional[str] = None
    office_room: Optional[str] = None
    application_link: Optional[str] = None
    form_download_url: Optional[str] = None
    icon: str = "file-text"
    category: Optional[str] = None
    is_active: bool = True
    is_featured: bool = False
    sort_order: int = 0


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(ServiceBase):
    name: Optional[str] = None


class ServiceOut(ServiceBase):
    id: int
    created_at: datetime
    updated_at: datetime
    required_documents: List[RequiredDocumentOut] = []
    faqs: List[FAQOut] = []
    department_name: Optional[str] = None
    model_config = {"from_attributes": True}


class ServiceListOut(ServiceBase):
    id: int
    created_at: datetime
    department_name: Optional[str] = None
    model_config = {"from_attributes": True}
