from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.application import ApplicationStatus, DocumentVerificationStatus


class ApplicationDocumentOut(BaseModel):
    id: int
    document_name: str
    file_name: str
    file_size: Optional[int] = None
    mime_type: Optional[str] = None
    verification_status: DocumentVerificationStatus
    verification_note: Optional[str] = None
    uploaded_at: datetime
    model_config = {"from_attributes": True}


class ApplicationCreate(BaseModel):
    service_id: int
    purpose: Optional[str] = None
    applicant_address: Optional[str] = None


class ApplicationStatusUpdate(BaseModel):
    status: ApplicationStatus
    remarks: Optional[str] = None
    rejection_reason: Optional[str] = None


class ApplicationOut(BaseModel):
    id: int
    application_number: str
    user_id: int
    service_id: int
    status: ApplicationStatus
    applicant_name: str
    applicant_phone: Optional[str] = None
    applicant_email: Optional[str] = None
    applicant_address: Optional[str] = None
    purpose: Optional[str] = None
    remarks: Optional[str] = None
    rejection_reason: Optional[str] = None
    timeline: List[dict] = []
    submitted_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None
    documents: List[ApplicationDocumentOut] = []
    service_name: Optional[str] = None
    model_config = {"from_attributes": True}
