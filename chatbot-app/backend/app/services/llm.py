import requests
from ..core.config import settings

class LLMService:
    def __init__(self):
        self.api_url = f"https://api-inference.huggingface.co/models/{settings.hf_text_model}"
        self.headers = {
            "Authorization": f"Bearer {settings.hf_api_key}",
            "Content-Type": "application/json"
        }

    def generate(self, prompt: str, max_tokens: int = 512) -> str:
        payload = {
            "inputs": prompt,
            "parameters": {
                "max_new_tokens": max_tokens,
                "temperature": 0.2,
                "top_p": 0.9,
                "return_full_text": False
            }
        }
        response = requests.post(self.api_url, headers=self.headers, json=payload, timeout=90)
        response.raise_for_status()
        data = response.json()
        if isinstance(data, list) and data:
            return data[0].get('generated_text', '').strip()
        if isinstance(data, dict) and 'generated_text' in data:
            return data['generated_text'].strip()
        raise ValueError('Unexpected response from LLM provider')

llm_service = LLMService()
