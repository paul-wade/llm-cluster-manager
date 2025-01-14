import requests
import logging
import time
from typing import Optional, Dict, Any
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

def create_http_session():
    """Create a session with retry logic"""
    session = requests.Session()
    retries = Retry(
        total=3,
        backoff_factor=1,
        status_forcelist=[408, 429, 500, 502, 503, 504]
    )
    session.mount('http://', HTTPAdapter(max_retries=retries))
    session.mount('https://', HTTPAdapter(max_retries=retries))
    return session

def check_generation_status(base_url: str, api_key: str, request_id: Optional[str] = None) -> Dict[str, Any]:
    """
    Check the status of a generation request from LMStudio.
    Returns a dictionary with status information.
    """
    session = create_http_session()
    try:
        # If we have a specific request ID, check its status
        if request_id:
            status_url = f"{base_url}/status/{request_id}"
            response = session.get(
                status_url,
                headers={"Authorization": f"Bearer {api_key}"},
                timeout=5  # Short timeout for status checks
            )
            if response.status_code == 200:
                return {
                    "status": "ready",
                    "data": response.json()
                }
            elif response.status_code == 202:
                return {
                    "status": "generating",
                    "request_id": request_id
                }
            else:
                return {
                    "status": "error",
                    "error": f"Status check failed with code {response.status_code}"
                }
        
        # Otherwise just check if the server is responsive
        response = session.get(
            f"{base_url}/health",
            headers={"Authorization": f"Bearer {api_key}"},
            timeout=5
        )
        return {
            "status": "ready" if response.status_code == 200 else "error",
            "error": None if response.status_code == 200 else f"Health check failed with code {response.status_code}"
        }
    except requests.exceptions.RequestException as e:
        return {
            "status": "error",
            "error": str(e)
        }

def wait_for_generation(base_url: str, api_key: str, request_id: str, 
                       max_retries: int = 10, retry_delay: int = 5) -> Dict[str, Any]:
    """
    Poll LMStudio until generation is complete or max retries reached.
    Returns the generation result or error information.
    """
    retries = 0
    while retries < max_retries:
        status = check_generation_status(base_url, api_key, request_id)
        
        if status["status"] == "ready":
            return status
        elif status["status"] == "error":
            logging.error(f"Error checking generation status: {status.get('error')}")
            return status
        
        logging.info(f"Generation in progress... (attempt {retries + 1}/{max_retries})")
        time.sleep(retry_delay)
        retries += 1
    
    return {
        "status": "timeout",
        "error": f"Generation not completed after {max_retries} attempts"
    }
