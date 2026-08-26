from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.complaint import ComplaintStatus


class ComplaintCreate(BaseModel):
    subject: str
    description: str
    department_id: Optional[int] = None


class ComplaintStatusUpdate(BaseModel):
    status: ComplaintStatus
    resolution_note: Optional[str] = None
    assigned_to: Optional[int] = None


class ComplaintOut(BaseModel):
    id: int
    complaint_number: str
    user_id: int
    department_id: Optional[int] = None
    subject: str
    description: str
    attachment_url: Optional[str] = None
    status: ComplaintStatus
    resolution_note: Optional[str] = None
    submitted_at: datetime
    updated_at: datetime
    resolved_at: Optional[datetime] = None
    citizen_name: Optional[str] = None
    department_name: Optional[str] = None
    model_config = {"from_attributes": True}


class FeedbackCreate(BaseModel):
    application_id: Optional[int] = None
    service_id: Optional[int] = None
    department_id: Optional[int] = None
    rating: int
    feedback_text: Optional[str] = None
    is_public: bool = False


class FeedbackOut(BaseModel):
    id: int
    user_id: int
    application_id: Optional[int] = None
    service_id: Optional[int] = None
    department_id: Optional[int] = None
    rating: int
    feedback_text: Optional[str] = None
    is_public: bool
    created_at: datetime
    citizen_name: Optional[str] = None
    model_config = {"from_attributes": True}


class NoticeBase(BaseModel):
    title: str
    title_hi: Optional[str] = None
    title_mr: Optional[str] = None
    description: str
    category: Optional[str] = None
    priority: Optional[str] = None
    is_published: bool = False
    publish_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None


class NoticeCreate(NoticeBase):
    pass


class NoticeOut(NoticeBase):
    id: int
    attachment_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}


class SchemeBase(BaseModel):
    name: str
    name_hi: Optional[str] = None
    name_mr: Optional[str] = None
    description: Optional[str] = None
    eligibility: Optional[str] = None
    benefits: Optional[str] = None
    required_documents: Optional[str] = None
    application_process: Optional[str] = None
    department: Optional[str] = None
    official_website: Optional[str] = None
    category: Optional[str] = None
    is_active: bool = True


class SchemeCreate(SchemeBase):
    pass


class SchemeOut(SchemeBase):
    id: int
    last_updated: datetime
    created_at: datetime
    model_config = {"from_attributes": True}


class TokenCreate(BaseModel):
    department_id: int
    service_id: Optional[int] = None
    citizen_name: Optional[str] = None
    citizen_phone: Optional[str] = None
    purpose: Optional[str] = None


class TokenOut(BaseModel):
    id: int
    token_number: str
    token_date: str
    department_id: int
    service_id: Optional[int] = None
    user_id: Optional[int] = None
    citizen_name: Optional[str] = None
    status: str
    queue_position: Optional[int] = None
    estimated_wait_minutes: int
    created_at: datetime
    department_name: Optional[str] = None
    model_config = {"from_attributes": True}


class AIKBBase(BaseModel):
    topic: str
    question_patterns: list = []
    answer_en: str
    answer_hi: Optional[str] = None
    answer_mr: Optional[str] = None
    category: Optional[str] = None
    tags: list = []
    is_active: bool = True


class AIKBCreate(AIKBBase):
    pass


class AIKBOut(AIKBBase):
    id: int
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}


class ChatMessage(BaseModel):
    message: str
    language: str = "en"  # en, hi, mr


class ChatResponse(BaseModel):
    reply: str
    source: str = "knowledge_base"  # knowledge_base or llm
    matched_topic: Optional[str] = None


class NotificationOut(BaseModel):
    id: int
    user_id: int
    type: str
    title: str
    message: str
    link: Optional[str] = None
    is_read: bool
    created_at: datetime
    model_config = {"from_attributes": True}
