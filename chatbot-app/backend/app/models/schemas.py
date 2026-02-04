from pydantic import BaseModel
from typing import List, Optional

class DocumentProcessRequest(BaseModel):
    file_path: str
    file_name: str

class DocumentChatRequest(BaseModel):
    document_id: str
    question: str

class CodeAnalysisRequest(BaseModel):
    content: str

class YouTubeAnalysisRequest(BaseModel):
    url: str

class YouTubeFollowUpRequest(BaseModel):
    analysis_id: str
    question: str

class QuizGenerateRequest(BaseModel):
    file_path: str
    file_name: str

class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    answer: str

class QuizResponse(BaseModel):
    questions: List[QuizQuestion]
