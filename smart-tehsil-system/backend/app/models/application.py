import enum
from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, Enum as SAEnum,
    Text, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from app.database.db import Base


class ApplicationStatus(str, enum.Enum):
    submitted = "SUBMITTED"
    document_verification = "DOCUMENT_VERIFICATION"
    under_review = "UNDER_REVIEW"
    approved = "APPROVED"
    rejected = "REJECTED"
    completed = "COMPLETED"


class DocumentVerificationStatus(str, enum.Enum):
    pending = "PENDING"
    verified = "VERIFIED"
    rejected = "REJECTED"


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    application_number = Column(String(30), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=False)
    assigned_staff_id = Column(Integer, ForeignKey("staff.id"), nullable=True)
    status = Column(SAEnum(ApplicationStatus), default=ApplicationStatus.submitted)

    # Applicant details snapshot at submission time
    applicant_name = Column(String(200), nullable=False)
    applicant_phone = Column(String(15), nullable=True)
    applicant_email = Column(String(255), nullable=True)
    applicant_address = Column(Text, nullable=True)

    # Application details
    purpose = Column(Text, nullable=True)
    remarks = Column(Text, nullable=True)  # officer remarks
    rejection_reason = Column(Text, nullable=True)

    # Timeline events stored as JSON list
    timeline = Column(JSON, default=list)

    submitted_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    completed_at = Column(DateTime, nullable=True)

    applicant = relationship("User", back_populates="applications", foreign_keys=[user_id])
    service = relationship("Service", back_populates="applications")
    assigned_staff = relationship("Staff", back_populates="assigned_applications", foreign_keys=[assigned_staff_id])
    documents = relationship("ApplicationDocument", back_populates="application", cascade="all, delete-orphan")
    feedback = relationship("Feedback", back_populates="application", uselist=False)


class ApplicationDocument(Base):
    __tablename__ = "application_documents"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"), nullable=False)
    required_document_id = Column(Integer, ForeignKey("required_documents.id"), nullable=True)
    document_name = Column(String(300), nullable=False)
    file_path = Column(String(500), nullable=False)   # server-side path (never exposed raw)
    file_name = Column(String(300), nullable=False)   # original filename
    file_size = Column(Integer, nullable=True)        # bytes
    mime_type = Column(String(100), nullable=True)
    verification_status = Column(SAEnum(DocumentVerificationStatus), default=DocumentVerificationStatus.pending)
    verification_note = Column(Text, nullable=True)
    uploaded_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    application = relationship("Application", back_populates="documents")
