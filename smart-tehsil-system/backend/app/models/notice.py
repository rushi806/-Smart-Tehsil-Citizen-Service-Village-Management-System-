import enum
from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, Enum as SAEnum,
    Text, ForeignKey
)
from sqlalchemy.orm import relationship
from app.database.db import Base


class NoticePriority(str, enum.Enum):
    low = "LOW"
    normal = "NORMAL"
    high = "HIGH"
    urgent = "URGENT"


class NoticeCategory(str, enum.Enum):
    notice = "NOTICE"
    circular = "CIRCULAR"
    holiday = "HOLIDAY"
    announcement = "ANNOUNCEMENT"
    deadline = "DEADLINE"
    camp = "CAMP"
    government_update = "GOVERNMENT_UPDATE"


class Notice(Base):
    __tablename__ = "notices"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    title_hi = Column(String(500), nullable=True)
    title_mr = Column(String(500), nullable=True)
    description = Column(Text, nullable=False)
    category = Column(SAEnum(NoticeCategory), default=NoticeCategory.notice)
    priority = Column(SAEnum(NoticePriority), default=NoticePriority.normal)
    attachment_url = Column(String(500), nullable=True)
    published_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    is_published = Column(Boolean, default=False)
    publish_date = Column(DateTime, nullable=True)
    expiry_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    publisher = relationship("User")
