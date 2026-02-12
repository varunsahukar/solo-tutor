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
    # 1. Download Document
    try:
        file_bytes = supabase.storage.from_(settings.supabase_storage_bucket).download(payload.file_path)
    except Exception as exc:
        raise HTTPException(status_code=400, detail='Unable to download document. Please check if the file exists.') from exc

    # 2. Extract Text
    file_ext = payload.file_name.split('.')[-1].lower()
    try:
        if file_ext == 'pdf':
            text = extract_text_from_pdf(file_bytes)
        elif file_ext == 'docx':
            text = extract_text_from_docx(file_bytes)
        elif file_ext == 'txt':
            text = extract_text_from_txt(file_bytes)
        else:
            raise HTTPException(status_code=400, detail=f'Unsupported file format: {file_ext}')
    except Exception as e:
         raise HTTPException(status_code=400, detail=f'Error parsing document: {str(e)}')

    if not text.strip():
        raise HTTPException(status_code=400, detail='Document content is empty.')

    # 3. Generate Quiz via LLM
    prompt = (
        "Generate 5 multiple-choice questions from the provided content. "
        "Return ONLY a raw JSON array. Do not include markdown formatting like ```json ... ```. "
        "Each object must have keys: 'question', 'options' (array of 4 strings), 'answer' (string matching one option). "
        "Keep it concise.\n\n"
        f"Content:\n{text[:6000]}\n\nJSON:"
    )
    
    response = await llm_service.generate(prompt, max_tokens=800)
    
    # 4. Parse JSON
    # Clean potential markdown code blocks if the LLM adds them
    cleaned_response = response.replace("```json", "").replace("```", "").strip()
    
    try:
        questions = json.loads(cleaned_response)
        # Basic validation
        if not isinstance(questions, list):
            raise ValueError("Response is not a list")
    except (json.JSONDecodeError, ValueError) as exc:
        print(f"Quiz generation failed. Response: {response}")
        # Fallback for user experience
        raise HTTPException(status_code=500, detail='Failed to generate valid quiz questions. Please try again.')

    return {'questions': questions}

