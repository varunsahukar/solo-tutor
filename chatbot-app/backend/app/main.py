from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .routes.document_chat import router as document_router
from .routes.youtube_analysis import router as youtube_router
from .routes.code_analysis import router as code_router
from .routes.quiz_generation import router as quiz_router
from .routes.chat_general import router as chat_router

app = FastAPI(title='AI Learning Assistant API')

origins = [origin.strip() for origin in settings.cors_origins.split(',') if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

app.include_router(document_router)
app.include_router(youtube_router)
app.include_router(code_router)
app.include_router(quiz_router)
app.include_router(chat_router)

@app.get('/health')
async def health_check():
    return {'status': 'ok'}
