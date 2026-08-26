"""Audit service helper — call from routers to log admin/officer actions."""
from sqlalchemy.orm import Session
from app.models.audit import AuditLog
from app.models.user import User


def log_action(
    db: Session,
    user: User,
    action: str,
    module: str,
    record_id: int = None,
    description: str = None,
    old_values: dict = None,
    new_values: dict = None,
    ip_address: str = None,
):
    entry = AuditLog(
        user_id=user.id if user else None,
        action=action,
        module=module,
        record_id=record_id,
        description=description,
        old_values=old_values,
        new_values=new_values,
        ip_address=ip_address,
    )
    db.add(entry)
    # Don't commit here — caller commits as part of their transaction
