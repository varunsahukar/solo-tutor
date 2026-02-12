import httpx
from ..core.config import settings

class LLMService:
    def __init__(self):
        self.api_url = f"{settings.ollama_base_url}/api/generate"
        self.headers = {
            "Content-Type": "application/json"
        }
        print(f"LLM Service initialized: {self.api_url}")

    async def generate(self, prompt: str, max_tokens: int = 512) -> str:
        payload = {
            "model": settings.ollama_model,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.2,
                "num_predict": max_tokens
            }
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    self.api_url, 
                    headers=self.headers, 
                    json=payload, 
                    timeout=120.0
                )
                response.raise_for_status()
                
                data = response.json()
                text = data.get("response", "")
                return text.strip() if text else "No response generated."
                
            except httpx.HTTPStatusError as e:
                return f"LLM Error: {e.response.text[:200]}"
            except httpx.RequestError as e:
                return f"Connection Error: Is Ollama running at {settings.ollama_base_url}?"
            except Exception as e:
                return f"Unexpected Error: {str(e)}"

llm_service = LLMService()

