from datetime import date, datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.database.db import get_db
from app.models.user import User
from app.models.token_queue import Token, TokenStatus
from app.models.staff import Department
from app.models.notification import Notification, NotificationType
from app.schemas.misc import TokenCreate, TokenOut
from app.core.security import get_current_user, require_roles

router = APIRouter(prefix="/api/tokens", tags=["Tokens"])

COUNTER_PREFIX = {1: "A", 2: "B", 3: "C", 4: "D"}


def _next_token_number(department_id: int, token_date: date, db: Session) -> str:
    count = (
        db.query(Token)
        .filter(Token.department_id == department_id, Token.token_date == token_date)
        .count()
    ) + 1
    prefix = COUNTER_PREFIX.get(department_id, "T")
    return f"{prefix}-{count:03d}"


def _enrich_token(t: Token) -> dict:
    d = t.__dict__.copy()
    d["token_date"] = str(t.token_date)
    d["department_name"] = t.department.name if t.department else None
    return d


@router.post("/", response_model=TokenOut, status_code=201)
def generate_token(
    payload: TokenCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    today = date.today()
    token_number = _next_token_number(payload.department_id, today, db)

    # Calculate wait time (5 min per waiting token)
    waiting = (
        db.query(Token)
        .filter(
            Token.department_id == payload.department_id,
            Token.token_date == today,
            Token.status == TokenStatus.waiting,
        )
        .count()
    )

    token = Token(
        token_number=token_number,
        token_date=today,
        department_id=payload.department_id,
        service_id=payload.service_id,
        user_id=current_user.id,
        citizen_name=payload.citizen_name or current_user.full_name,
        citizen_phone=payload.citizen_phone or current_user.phone,
        purpose=payload.purpose,
        status=TokenStatus.waiting,
        estimated_wait_minutes=waiting * 5,
    )
    db.add(token)

    notif = Notification(
        user_id=current_user.id,
        type=NotificationType.token_generated,
        title="Token Generated",
        message=f"Your token is {token_number}. Estimated wait: {waiting * 5} minutes.",
        link="/citizen/tokens",
    )
    db.add(notif)
    db.commit()
    db.refresh(token)
    return TokenOut.model_validate(_enrich_token(token))


@router.get("/queue/{department_id}", response_model=List[TokenOut])
def get_queue(department_id: int, db: Session = Depends(get_db)):
    today = date.today()
    tokens = (
        db.query(Token)
        .options(joinedload(Token.department))
        .filter(
            Token.department_id == department_id,
            Token.token_date == today,
            Token.status.in_([TokenStatus.waiting, TokenStatus.called, TokenStatus.serving]),
        )
        .order_by(Token.created_at)
        .all()
    )
    return [TokenOut.model_validate(_enrich_token(t)) for t in tokens]


@router.get("/my", response_model=List[TokenOut])
def my_tokens(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    tokens = (
        db.query(Token)
        .options(joinedload(Token.department))
        .filter(Token.user_id == current_user.id)
        .order_by(Token.created_at.desc())
        .limit(20)
        .all()
    )
    return [TokenOut.model_validate(_enrich_token(t)) for t in tokens]


@router.patch("/{token_id}/call")
def call_token(
    token_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "staff")),
):
    token = db.query(Token).filter(Token.id == token_id).first()
    if not token:
        raise HTTPException(status_code=404, detail="Token not found")
    token.status = TokenStatus.called
    token.called_at = datetime.now(timezone.utc)
    db.commit()
    return {"token_number": token.token_number, "status": "called"}


@router.patch("/{token_id}/complete")
def complete_token(
    token_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "staff")),
):
    token = db.query(Token).filter(Token.id == token_id).first()
    if not token:
        raise HTTPException(status_code=404, detail="Token not found")
    token.status = TokenStatus.completed
    token.completed_at = datetime.now(timezone.utc)
    db.commit()
    return {"message": "Token completed"}


@router.patch("/{token_id}/skip")
def skip_token(
    token_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "staff")),
):
    token = db.query(Token).filter(Token.id == token_id).first()
    if not token:
        raise HTTPException(status_code=404, detail="Token not found")
    token.status = TokenStatus.skipped
    db.commit()
    return {"message": "Token skipped"}
