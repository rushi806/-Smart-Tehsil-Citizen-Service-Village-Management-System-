from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, JSON
from app.database.db import Base


class AIKnowledgeBase(Base):
    """
    Admin-managed knowledge base entries for the AI assistant.
    The AI answers ONLY from these entries (unless a real LLM is configured).
    """
    __tablename__ = "ai_knowledge_base"

    id = Column(Integer, primary_key=True, index=True)
    topic = Column(String(300), nullable=False, index=True)
    question_patterns = Column(JSON, default=list)  # list of trigger phrases
    answer_en = Column(Text, nullable=False)
    answer_hi = Column(Text, nullable=True)
    answer_mr = Column(Text, nullable=True)
    category = Column(String(100), nullable=True)  # services, documents, villages, etc.
    tags = Column(JSON, default=list)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
