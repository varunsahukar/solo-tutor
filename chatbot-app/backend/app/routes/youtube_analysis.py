from fastapi import APIRouter, HTTPException
from supabase import create_client
from ..core.config import settings
from ..models.schemas import YouTubeAnalysisRequest, YouTubeFollowUpRequest
from ..services.transcript_generator import extract_video_id, fetch_transcript, transcribe_audio
from ..services.llm import llm_service

router = APIRouter(prefix='/youtube', tags=['youtube'])

supabase = create_client(settings.supabase_url, settings.supabase_service_role_key)

@router.post('/analyze')
async def analyze_video(payload: YouTubeAnalysisRequest):
    video_id = extract_video_id(payload.url)
    transcript = fetch_transcript(video_id)
    if transcript is None:
        transcript = transcribe_audio(payload.url)

    if not transcript:
        raise HTTPException(status_code=400, detail='Unable to generate transcript.')

    prompt = (
        "Summarize the following YouTube transcript in a structured academic style. "
        "Provide key topics, main arguments, and 3 bullet insights.\n\n"
        f"Transcript:\n{transcript[:6000]}\n\nSummary:"
    )
    summary = llm_service.generate(prompt, max_tokens=400)

    record = supabase.table('youtube_analysis').insert({
        'video_url': payload.url,
        'transcript': transcript,
        'summary': summary
    }).execute()

    analysis_id = record.data[0]['id']
    return {'analysis_id': analysis_id, 'summary': summary, 'title': payload.url}


@router.post('/follow-up')
async def youtube_follow_up(payload: YouTubeFollowUpRequest):
    record = supabase.table('youtube_analysis').select('*').eq('id', payload.analysis_id).single().execute()
    if not record.data:
        raise HTTPException(status_code=404, detail='Analysis not found.')

    transcript = record.data['transcript']
    prompt = (
        "Answer the question using the transcript context. If the transcript does not contain the answer, say so.\n\n"
        f"Transcript:\n{transcript[:6000]}\n\nQuestion: {payload.question}\nAnswer:"
    )
    answer = llm_service.generate(prompt, max_tokens=200)
    return {'answer': answer}
