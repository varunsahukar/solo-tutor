from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..services.llm import llm_service

router = APIRouter(prefix='/chat', tags=['chat'])

class GeneralChatRequest(BaseModel):
    message: str

@router.post('/general')
async def general_chat(payload: GeneralChatRequest):
    try:
        # Create a prompt for general conversation
        prompt = f"You are a helpful AI assistant. Respond to the following message: {payload.message}"
        
        response = llm_service.generate(prompt, max_tokens=300)
        
        return {'response': response}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))