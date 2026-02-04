from fastapi import APIRouter, HTTPException
from supabase import create_client
import numpy as np
from ..core.config import settings
from ..models.schemas import DocumentProcessRequest, DocumentChatRequest
from ..services.document_parser import extract_text_from_pdf, extract_text_from_docx, extract_text_from_txt, chunk_text
from ..services.embeddings import embedding_service
from ..services.llm import llm_service

router = APIRouter(prefix='/document', tags=['document'])

supabase = create_client(settings.supabase_url, settings.supabase_service_role_key)

@router.post('/process')
async def process_document(payload: DocumentProcessRequest):
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

    doc_response = supabase.table('documents').insert({
        'file_name': payload.file_name,
        'file_path': payload.file_path
    }).execute()

    document_id = doc_response.data[0]['id']

    chunks = chunk_text(text)
    chunk_records = []
    for index, chunk in enumerate(chunks):
        embedding = embedding_service.embed(chunk)
        chunk_records.append({
            'document_id': document_id,
            'chunk_index': index,
            'content': chunk,
            'embedding': embedding
        })

    if chunk_records:
        supabase.table('document_chunks').insert(chunk_records).execute()

    return {'document_id': document_id}


def cosine_similarity(vec_a: list[float], vec_b: list[float]) -> float:
    a = np.array(vec_a)
    b = np.array(vec_b)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-10))


@router.post('/chat')
async def document_chat(payload: DocumentChatRequest):
    chunk_response = supabase.table('document_chunks').select('*').eq('document_id', payload.document_id).execute()
    chunks = chunk_response.data or []
    if not chunks:
        raise HTTPException(status_code=404, detail='Document not found or not processed.')

    question_embedding = embedding_service.embed(payload.question)
    scored = []
    for chunk in chunks:
        score = cosine_similarity(question_embedding, chunk['embedding'])
        scored.append((score, chunk['content']))
    scored.sort(key=lambda item: item[0], reverse=True)
    context = '\n\n'.join([item[1] for item in scored[:3]])

    prompt = (
        "You are a study assistant. Answer the question using ONLY the context provided. "
        "If the context does not contain the answer, say you cannot find it.\n\n"
        f"Context:\n{context}\n\nQuestion: {payload.question}\nAnswer:"
    )

    answer = llm_service.generate(prompt, max_tokens=300)
    supabase.table('chat_history').insert({
        'document_id': payload.document_id,
        'question': payload.question,
        'answer': answer
    }).execute()

    return {'answer': answer}
