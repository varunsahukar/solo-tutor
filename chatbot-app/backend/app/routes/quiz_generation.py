import json
from fastapi import APIRouter, HTTPException
from supabase import create_client
from ..core.config import settings
from ..models.schemas import QuizGenerateRequest, QuizResponse
from ..services.document_parser import extract_text_from_pdf, extract_text_from_docx, extract_text_from_txt
from ..services.llm import llm_service

router = APIRouter(prefix='/quiz', tags=['quiz'])

supabase = create_client(settings.supabase_url, settings.supabase_service_role_key)

@router.post('/generate', response_model=QuizResponse)
async def generate_quiz(payload: QuizGenerateRequest):
    file_extension = payload.file_name.split('.')[-1].lower()
    try:
        file_bytes = supabase.storage.from_(settings.supabase_storage_bucket).download(payload.file_path)
    except Exception as exc:
        raise HTTPException(status_code=400, detail='Unable to download document') from exc

    if file_extension == 'pdf':
        text = extract_text_from_pdf(file_bytes)
    elif file_extension == 'docx':
        text = extract_text_from_docx(file_bytes)
    elif file_extension == 'txt':
        text = extract_text_from_txt(file_bytes)
    else:
        raise HTTPException(status_code=400, detail='Unsupported file format')

    if not text.strip():
        raise HTTPException(status_code=400, detail='No text extracted from document')

    prompt = (
        "Generate 5 multiple-choice questions from the content. Return JSON array with keys: "
        "question, options (array), answer. Keep answers concise.\n\n"
        f"Content:\n{text[:6000]}\n\nJSON:"
    )
    response = llm_service.generate(prompt, max_tokens=500)
    try:
        questions = json.loads(response)
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=500, detail='Failed to parse quiz output') from exc

    return {'questions': questions}
