import requests
from ..core.config import settings

class LLMService:
    def __init__(self):
        # Use local Ollama server for inference (no API keys, no cloud dependency)
        self.api_url = f"{settings.ollama_base_url}/api/generate"
        self.headers = {
            "Content-Type": "application/json"
        }
        print(f"LLM Service initialized with Ollama at: {self.api_url}")

    def generate(self, prompt: str, max_tokens: int = 512) -> str:
        # Map max_tokens to Ollama's num_predict; disable streaming for simpler parsing
        payload = {
            "model": settings.ollama_model,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.2,
                "num_predict": max_tokens
            }
        }
        try:
            response = requests.post(self.api_url, headers=self.headers, json=payload, timeout=120)
            response.raise_for_status()
            content_type = response.headers.get('content-type') or ''
            data = response.json() if 'application/json' in content_type else {"response": response.text}
            text = data.get("response", "")
            return text.strip() if isinstance(text, str) and text else "No response generated."
        except requests.exceptions.HTTPError as e:
            err_text = e.response.text[:200] if e.response and e.response.text else "HTTP error"
            return f"Sorry, I cannot process this request right now. {err_text}"
        except Exception:
            return "Sorry, I cannot process this request right now due to a technical issue."

llm_service = LLMService()
