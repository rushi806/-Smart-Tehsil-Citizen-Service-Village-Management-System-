import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.database.db import create_tables

# Import all models to register them with SQLAlchemy metadata
import app.models  # noqa: F401

from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
from app.routers.staff import router as staff_router, dept_router
from app.routers.services import router as services_router
from app.routers.applications import router as applications_router
from app.routers.appointments import router as appointments_router
from app.routers.tokens import router as tokens_router
from app.routers.villages import router as villages_router, gp_router
from app.routers.misc import (
    schemes_router,
    notices_router,
    complaints_router,
    feedback_router,
    ai_kb_router,
    notifications_router,
)
from app.routers.ai_chat import router as ai_router
from app.routers.search import router as search_router
from app.routers.dashboard import router as dashboard_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables and run seed if first time
    create_tables()
    _run_seed_if_needed()
    yield


def _run_seed_if_needed():
    """Run seed data only if admin user doesn't exist yet."""
    from app.database.db import SessionLocal
    from app.models.user import User
    db = SessionLocal()
    try:
        if not db.query(User).first():
            from app.database.seed import run_seed
            run_seed(db)
    finally:
        db.close()


app = FastAPI(
    title=settings.APP_NAME,
    description="Smart Tehsil Citizen Service & Village Management System API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads directory (accessible only with auth — served via dedicated endpoint in production)
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

# Register all routers
routers = [
    auth_router,
    users_router,
    staff_router,
    dept_router,
    services_router,
    applications_router,
    appointments_router,
    tokens_router,
    villages_router,
    gp_router,
    schemes_router,
    notices_router,
    complaints_router,
    feedback_router,
    ai_kb_router,
    notifications_router,
    ai_router,
    search_router,
    dashboard_router,
]

for r in routers:
    app.include_router(r)


@app.get("/api/health")
def health_check():
    return {"status": "ok", "app": settings.APP_NAME, "tehsil": settings.TEHSIL_NAME}
