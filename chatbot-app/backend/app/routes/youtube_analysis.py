from fastapi import APIRouter, HTTPException
from supabase import create_client
from ..core.config import settings
from ..models.schemas import YouTubeAnalysisRequest, YouTubeFollowUpRequest
from ..services.transcript_generator import extract_video_id
from ..services.llm import llm_service

router = APIRouter(prefix='/youtube', tags=['youtube'])

supabase = create_client(settings.supabase_url, settings.supabase_service_role_key)

@router.post('/analyze')
async def analyze_video(payload: YouTubeAnalysisRequest):
    if not payload.url:
        raise HTTPException(status_code=400, detail="URL is required")

    video_id = extract_video_id(payload.url)
    
    # Prompt for summary
    prompt = (
        "Provide a general analysis of a YouTube video based on the URL. "
        "Since I cannot access the actual transcript, provide a structured academic-style summary "
        "with key topics, main arguments, and 3 bullet insights about what this type of video typically covers.\n\n"
        f"Video URL: {payload.url}\n\nAnalysis:"
    )
    
    summary = await llm_service.generate(prompt, max_tokens=400)

    try:
        record = supabase.table('youtube_analysis').insert({
            'video_url': payload.url,
            'transcript': 'Transcript not available',
            'summary': summary
        }).execute()
        
        analysis_id = record.data[0]['id'] if record.data else 'temp-id'
    except Exception as exc:
        print(f'Warning: DB Error: {exc}')
        analysis_id = 'temp-id'
    
    return {'analysis_id': analysis_id, 'summary': summary, 'title': payload.url}

@router.post('/follow-up')
async def youtube_follow_up(payload: YouTubeFollowUpRequest):
    try:
        record = supabase.table('youtube_analysis').select('*').eq('id', payload.analysis_id).single().execute()
        if not record.data:
            raise HTTPException(status_code=404, detail='Analysis context not found.')
        
        transcript = record.data.get('transcript', '') or record.data.get('summary', '')
    except Exception:
        raise HTTPException(status_code=404, detail='Analysis context not found.')

    prompt = (
        "Answer the question using the context below. If the answer isn't there, say so.\n\n"
        f"Context:\n{transcript[:6000]}\n\nQuestion: {payload.question}\nAnswer:"
    )
    
    answer = await llm_service.generate(prompt, max_tokens=200)
    return {'answer': answer}

