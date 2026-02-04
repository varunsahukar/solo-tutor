from fastapi import Header, HTTPException
from supabase import create_client
from .config import settings

supabase_admin = create_client(settings.supabase_url, settings.supabase_service_role_key)

async def get_current_user(authorization: str = Header(default='')):
    if not authorization.startswith('Bearer '):
        raise HTTPException(status_code=401, detail='Missing bearer token')
    token = authorization.replace('Bearer ', '')
    try:
        user = supabase_admin.auth.get_user(token)
    except Exception as exc:
        raise HTTPException(status_code=401, detail='Invalid token') from exc
    return user
