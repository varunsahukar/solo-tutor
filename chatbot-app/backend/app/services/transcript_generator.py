from typing import Optional
from youtube_transcript_api import YouTubeTranscriptApi
from pytube import YouTube
import tempfile
import os


def extract_video_id(url: str) -> str:
    """Extracts the YouTube video ID from a URL."""
    if 'v=' in url:
        return url.split('v=')[1].split('&')[0]
    if 'youtu.be/' in url:
        return url.split('youtu.be/')[1].split('?')[0]
    return url


def fetch_transcript(video_id: str) -> Optional[str]:
    """Fetches the transcript for a given video ID using YouTubeTranscriptApi."""
    try:
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        return ' '.join([item['text'] for item in transcript_list])
    except Exception:
        return None


def transcribe_audio(url: str) -> str:
    """Downloads audio from a YouTube video and transcribes it using Whisper."""
    try:
        yt = YouTube(url)
        stream = yt.streams.filter(only_audio=True).first()
        if stream is None:
            return "No audio stream available."
            
        with tempfile.TemporaryDirectory() as tmpdir:
            audio_path = stream.download(output_path=tmpdir, filename='audio')
            
            # Lazy import to avoid startup errors if dependencies are missing
            try:
                from faster_whisper import WhisperModel
            except ImportError:
                return "Transcription unavailable: faster_whisper not installed."
                
            model = WhisperModel('base', device='cpu', compute_type='int8')
            segments, _ = model.transcribe(audio_path)
            transcript = ' '.join([segment.text for segment in segments])
            return transcript
    except Exception as e:
        return f"Transcription failed: {str(e)}"
