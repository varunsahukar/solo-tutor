from typing import Optional
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound
from pytube import YouTube
from faster_whisper import WhisperModel
import tempfile
import os


def extract_video_id(url: str) -> str:
    if 'v=' in url:
        return url.split('v=')[1].split('&')[0]
    if 'youtu.be/' in url:
        return url.split('youtu.be/')[1].split('?')[0]
    return url


def fetch_transcript(video_id: str) -> Optional[str]:
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        return ' '.join([segment['text'] for segment in transcript])
    except (TranscriptsDisabled, NoTranscriptFound):
        return None


def transcribe_audio(url: str) -> str:
    yt = YouTube(url)
    stream = yt.streams.filter(only_audio=True).first()
    if stream is None:
        raise ValueError('No audio stream available')
    with tempfile.TemporaryDirectory() as tmpdir:
        audio_path = stream.download(output_path=tmpdir, filename='audio')
        model = WhisperModel('base', device='cpu', compute_type='int8')
        segments, _ = model.transcribe(audio_path)
        transcript = ' '.join([segment.text for segment in segments])
    return transcript
