import hashlib
import numpy as np
from ..core.config import settings

class EmbeddingService:
    def __init__(self):
        # Simple hash-based embedding for demonstration
        # In production, you would want to use a proper embedding model
        pass

    def embed(self, text: str) -> list[float]:
        # Simple hash-based approach - not ideal for real use
        # This is just to get the system working
        hash_object = hashlib.md5(text.encode())
        hash_hex = hash_object.hexdigest()
        # Convert hex to float vector (384 dimensions to match typical embedding size)
        vector = []
        for i in range(0, min(len(hash_hex), 384*2), 2):
            byte_val = int(hash_hex[i:i+2], 16)
            # Normalize to [-1, 1]
            normalized = (byte_val / 127.5) - 1.0
            vector.append(normalized)
        
        # Pad to 384 dimensions if needed
        while len(vector) < 384:
            vector.append(0.0)
        
        return vector[:384]

embedding_service = EmbeddingService()
