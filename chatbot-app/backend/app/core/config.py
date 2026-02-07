from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv()

class Settings(BaseModel):
    supabase_url: str = os.getenv('SUPABASE_URL', '')
    supabase_service_role_key: str = os.getenv('SUPABASE_SERVICE_ROLE_KEY', '')
    supabase_anon_key: str = os.getenv('SUPABASE_ANON_KEY', '')
    supabase_storage_bucket: str = os.getenv('SUPABASE_STORAGE_BUCKET', 'documents')
    ollama_base_url: str = os.getenv('OLLAMA_BASE_URL', 'http://localhost:11434')
    ollama_model: str = os.getenv('OLLAMA_MODEL', 'llama3')
    embedding_model: str = os.getenv('EMBEDDING_MODEL', 'sentence-transformers/all-MiniLM-L6-v2')
    cors_origins: str = os.getenv('CORS_ORIGINS', '*')

settings = Settings()
