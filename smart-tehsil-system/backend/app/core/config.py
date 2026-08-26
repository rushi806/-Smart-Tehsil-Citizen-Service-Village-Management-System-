from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "sqlite:///./tehsil.db"

    # JWT
    SECRET_KEY: str = "change-this-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # Admin seed credentials
    ADMIN_EMAIL: str = "admin@tehsil.gov.in"
    ADMIN_PASSWORD: str = "Admin@123"

    # File upload
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE_MB: int = 10

    # AI
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: str = ""

    # CORS
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"

    # App info
    APP_NAME: str = "Smart Tehsil Citizen Service Portal"
    TEHSIL_NAME: str = "Demo Tehsil"
    DISTRICT_NAME: str = "Demo District"

    @property
    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",")]

    @property
    def upload_dir_path(self) -> str:
        os.makedirs(self.UPLOAD_DIR, exist_ok=True)
        return self.UPLOAD_DIR

    @property
    def max_upload_bytes(self) -> int:
        return self.MAX_UPLOAD_SIZE_MB * 1024 * 1024

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
