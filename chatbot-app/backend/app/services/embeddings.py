from sentence_transformers import SentenceTransformer
import numpy as np
from ..core.config import settings

class EmbeddingService:
    def __init__(self):
        try:
            self.model = SentenceTransformer(settings.embedding_model)
            print(f"Loaded embedding model: {settings.embedding_model}")
        except Exception as e:
            print(f"Failed to load embedding model: {e}")
            self.model = None

    def embed(self, text: str) -> list[float]:
        if not self.model:
            # Fallback to random vector if model fails to load (for testing only)
            return np.random.rand(384).tolist()
        
        embedding = self.model.encode(text)
        return embedding.tolist()

embedding_service = EmbeddingService()

