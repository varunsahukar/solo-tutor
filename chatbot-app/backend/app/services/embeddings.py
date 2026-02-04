import requests
from ..core.config import settings

class EmbeddingService:
    def __init__(self):
        self.api_url = f"https://api-inference.huggingface.co/pipeline/feature-extraction/{settings.hf_embedding_model}"
        self.headers = {
            "Authorization": f"Bearer {settings.hf_api_key}",
            "Content-Type": "application/json"
        }

    def embed(self, text: str) -> list[float]:
        response = requests.post(self.api_url, headers=self.headers, json={"inputs": text}, timeout=90)
        response.raise_for_status()
        data = response.json()
        if isinstance(data, list) and data and isinstance(data[0], list):
            if isinstance(data[0][0], list):
                vector = [sum(row[i] for row in data[0]) / len(data[0]) for i in range(len(data[0][0]))]
                return vector
            vector = [sum(row[i] for row in data) / len(data) for i in range(len(data[0]))]
            return vector
        raise ValueError('Unexpected embedding response')

embedding_service = EmbeddingService()
