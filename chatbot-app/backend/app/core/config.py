from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    supabase_url: str = ""
    supabase_service_role_key: str = ""
    supabase_anon_key: str = ""
    supabase_storage_bucket: str = "documents"
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "llama3"
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    cors_origins: str = "*"

    class Config:
        env_file = ".env"
        extra = "ignore"

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()

