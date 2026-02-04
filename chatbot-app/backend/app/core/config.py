from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv()

class Settings(BaseModel):
    supabase_url: str = os.getenv('SUPABASE_URL', '')
    supabase_service_role_key: str = os.getenv('SUPABASE_SERVICE_ROLE_KEY', '')
    supabase_anon_key: str = os.getenv('SUPABASE_ANON_KEY', '')
    supabase_storage_bucket: str = os.getenv('SUPABASE_STORAGE_BUCKET', 'documents')
    hf_api_key: str = os.getenv('HF_API_KEY', '')
    hf_text_model: str = os.getenv('HF_TEXT_MODEL', 'mistralai/Mistral-7B-Instruct-v0.3')
    hf_embedding_model: str = os.getenv('HF_EMBEDDING_MODEL', 'sentence-transformers/all-MiniLM-L6-v2')
    cors_origins: str = os.getenv('CORS_ORIGINS', '*')

settings = Settings()
