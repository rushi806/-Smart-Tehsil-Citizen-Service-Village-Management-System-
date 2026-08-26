"""
AI Chat router — uses admin-managed knowledge base.
Falls back to a polite "please verify" message when no match is found.
"""
from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.ai_kb import AIKnowledgeBase
from app.schemas.misc import ChatMessage, ChatResponse

router = APIRouter(prefix="/api/ai", tags=["AI Assistant"])

FALLBACK_RESPONSES = {
    "en": (
        "I'm sorry, I don't have specific information about that. "
        "Please verify this with the concerned Tehsil office or contact us directly."
    ),
    "hi": (
        "मुझे इस बारे में जानकारी नहीं है। "
        "कृपया संबंधित तहसील कार्यालय से सत्यापित करें।"
    ),
    "mr": (
        "मला या विषयी माहिती नाही. "
        "कृपया संबंधित तहसील कार्यालयाशी संपर्क साधा."
    ),
}


def _score_match(message: str, patterns: list) -> int:
    msg = message.lower()
    score = 0
    for pattern in patterns:
        p = pattern.lower()
        if p in msg:
            score += len(p.split())
    return score


@router.post("/chat", response_model=ChatResponse)
def chat(payload: ChatMessage, db: Session = Depends(get_db)):
    message = payload.message.strip()
    lang = payload.language if payload.language in ("en", "hi", "mr") else "en"

    if not message:
        return ChatResponse(
            reply=FALLBACK_RESPONSES[lang],
            source="knowledge_base",
        )

    # Search knowledge base for best match
    entries = db.query(AIKnowledgeBase).filter(AIKnowledgeBase.is_active == True).all()
    best_score = 0
    best_entry = None

    for entry in entries:
        patterns = entry.question_patterns or []
        # Also check topic keywords
        patterns = patterns + [entry.topic] + (entry.tags or [])
        score = _score_match(message, patterns)
        if score > best_score:
            best_score = score
            best_entry = entry

    if best_entry and best_score > 0:
        if lang == "hi" and best_entry.answer_hi:
            reply = best_entry.answer_hi
        elif lang == "mr" and best_entry.answer_mr:
            reply = best_entry.answer_mr
        else:
            reply = best_entry.answer_en
        return ChatResponse(
            reply=reply,
            source="knowledge_base",
            matched_topic=best_entry.topic,
        )

    return ChatResponse(
        reply=FALLBACK_RESPONSES[lang],
        source="knowledge_base",
    )
