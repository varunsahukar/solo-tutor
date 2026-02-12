from fastapi import APIRouter, HTTPException
from ..models.schemas import CodeAnalysisRequest
from ..services.llm import llm_service

router = APIRouter(prefix='/code', tags=['code'])

@router.post('/analyze')
async def analyze_code(payload: CodeAnalysisRequest):
    if not payload.content.strip():
        raise HTTPException(status_code=400, detail="Content cannot be empty.")

    prompt = (
        "You are a senior software engineer. Explain the following code or text with: "
        "1) Purpose, 2) Logic flow, 3) Key concepts. Use clear bullet points.\n\n"
        f"Content:\n{payload.content[:5000]}\n\nExplanation:"
    )
    
    explanation = await llm_service.generate(prompt, max_tokens=350)
    return {'explanation': explanation}

