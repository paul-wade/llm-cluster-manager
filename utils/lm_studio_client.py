import requests
import json
from typing import Dict, List, Optional, Union

class LMStudioClient:
    def __init__(self, base_url: str, api_key: str = "sk-xxx"):
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }

    def create(self, messages: List[Dict[str, str]], model: str, temperature: float = 0.7, max_tokens: int = 2000) -> Dict:
        """
        Create a completion using the LM Studio API.
        """
        data = {
            "messages": messages,
            "model": model,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "stream": False
        }

        try:
            response = requests.post(
                f"{self.base_url}/v1/completions",
                headers=self.headers,
                json=data,
                timeout=60
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error making request to LM Studio: {e}")
            raise
