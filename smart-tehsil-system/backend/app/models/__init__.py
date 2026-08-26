# Import all models so SQLAlchemy registers them before create_all()
from app.models.user import User, UserRole
from app.models.staff import Staff, Department, StaffStatus
from app.models.service import Service, FAQ
from app.models.document import RequiredDocument
from app.models.application import Application, ApplicationDocument, ApplicationStatus, DocumentVerificationStatus
from app.models.appointment import Appointment, TimeSlot, AppointmentStatus, SlotStatus
from app.models.token_queue import Token, TokenStatus
from app.models.village import Village, GramPanchayat
from app.models.scheme import GovernmentScheme
from app.models.notice import Notice, NoticePriority, NoticeCategory
from app.models.complaint import Complaint, ComplaintStatus
from app.models.feedback import Feedback
from app.models.ai_kb import AIKnowledgeBase
from app.models.notification import Notification, NotificationType
from app.models.audit import AuditLog

__all__ = [
    "User", "UserRole",
    "Staff", "Department", "StaffStatus",
    "Service", "FAQ",
    "RequiredDocument",
    "Application", "ApplicationDocument", "ApplicationStatus", "DocumentVerificationStatus",
    "Appointment", "TimeSlot", "AppointmentStatus", "SlotStatus",
    "Token", "TokenStatus",
    "Village", "GramPanchayat",
    "GovernmentScheme",
    "Notice", "NoticePriority", "NoticeCategory",
    "Complaint", "ComplaintStatus",
    "Feedback",
    "AIKnowledgeBase",
    "Notification", "NotificationType",
    "AuditLog",
]
