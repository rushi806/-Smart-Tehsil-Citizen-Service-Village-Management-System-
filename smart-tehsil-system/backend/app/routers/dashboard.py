from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.db import get_db
from app.models.user import User, UserRole
from app.models.staff import Staff
from app.models.staff import StaffStatus
from app.models.application import Application, ApplicationStatus
from app.models.appointment import Appointment, AppointmentStatus
from app.models.village import Village
from app.models.service import Service
from app.models.complaint import Complaint, ComplaintStatus
from app.models.notice import Notice
from app.models.feedback import Feedback
from app.core.security import require_roles
from datetime import date

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/admin")
def admin_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    total_citizens = db.query(User).filter(User.role == UserRole.citizen).count()
    total_staff = db.query(Staff).count()
    present_staff = db.query(Staff).filter(Staff.status == StaffStatus.present).count()
    absent_staff = db.query(Staff).filter(Staff.status.in_([StaffStatus.absent, StaffStatus.on_leave])).count()
    total_villages = db.query(Village).filter(Village.is_active == True).count()
    total_services = db.query(Service).filter(Service.is_active == True).count()
    total_applications = db.query(Application).count()
    pending_applications = db.query(Application).filter(
        Application.status.in_([ApplicationStatus.submitted, ApplicationStatus.document_verification, ApplicationStatus.under_review])
    ).count()
    completed_applications = db.query(Application).filter(
        Application.status == ApplicationStatus.completed
    ).count()
    today = date.today()
    appointments_today = db.query(Appointment).join(Appointment.time_slot).filter(
        Application.status != ApplicationStatus.completed
    ).count()
    total_complaints = db.query(Complaint).count()
    open_complaints = db.query(Complaint).filter(
        Complaint.status.in_([ComplaintStatus.submitted, ComplaintStatus.in_review, ComplaintStatus.assigned])
    ).count()
    total_notices = db.query(Notice).filter(Notice.is_published == True).count()

    avg_feedback = db.query(func.avg(Feedback.rating)).scalar() or 0

    # Applications by status
    app_status_counts = (
        db.query(Application.status, func.count(Application.id))
        .group_by(Application.status)
        .all()
    )
    app_status = {str(s): c for s, c in app_status_counts}

    return {
        "total_citizens": total_citizens,
        "total_staff": total_staff,
        "present_staff": present_staff,
        "absent_staff": absent_staff,
        "total_villages": total_villages,
        "total_services": total_services,
        "total_applications": total_applications,
        "pending_applications": pending_applications,
        "completed_applications": completed_applications,
        "appointments_today": appointments_today,
        "total_complaints": total_complaints,
        "open_complaints": open_complaints,
        "total_notices": total_notices,
        "average_feedback_rating": round(float(avg_feedback), 2),
        "application_status_breakdown": app_status,
    }


@router.get("/citizen")
def citizen_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("citizen", "staff", "officer", "admin")),
):
    my_apps = db.query(Application).filter(Application.user_id == current_user.id).count()
    my_pending = db.query(Application).filter(
        Application.user_id == current_user.id,
        Application.status.in_([ApplicationStatus.submitted, ApplicationStatus.document_verification, ApplicationStatus.under_review]),
    ).count()
    my_complaints = db.query(Complaint).filter(Complaint.user_id == current_user.id).count()
    from app.models.notification import Notification
    unread_notifs = db.query(Notification).filter(
        Notification.user_id == current_user.id, Notification.is_read == False
    ).count()
    return {
        "total_applications": my_apps,
        "pending_applications": my_pending,
        "total_complaints": my_complaints,
        "unread_notifications": unread_notifs,
    }


@router.get("/officer")
def officer_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "officer")),
):
    pending = db.query(Application).filter(
        Application.status.in_([ApplicationStatus.submitted, ApplicationStatus.document_verification])
    ).count()
    under_review = db.query(Application).filter(Application.status == ApplicationStatus.under_review).count()
    approved = db.query(Application).filter(Application.status == ApplicationStatus.approved).count()
    rejected = db.query(Application).filter(Application.status == ApplicationStatus.rejected).count()
    open_complaints = db.query(Complaint).filter(
        Complaint.status.in_([ComplaintStatus.submitted, ComplaintStatus.in_review])
    ).count()
    return {
        "pending_applications": pending,
        "under_review": under_review,
        "approved_applications": approved,
        "rejected_applications": rejected,
        "open_complaints": open_complaints,
    }
