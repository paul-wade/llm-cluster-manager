from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Optional
from .llm_cluster import LLMClusterManager
import logging

app = FastAPI()
cluster = LLMClusterManager()
logger = logging.getLogger("ClusterAPI")

class ChatRequest(BaseModel):
    model: str
    messages: List[Dict[str, str]]
    temperature: Optional[float] = 1.0
    max_tokens: Optional[int] = None

@app.post("/v1/chat/completions")
async def chat_completion(request: ChatRequest):
    try:
        response = cluster.execute_request(request.dict())
        return response
    except Exception as e:
        logger.error(f"Chat completion error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/cluster/status")
async def get_cluster_status():
    """Get the current status of all LMStudio instances"""
    return cluster.get_cluster_status()

@app.get("/cluster/best_instance")
async def get_best_instance():
    """Get information about the currently best available instance"""
    instance = cluster.get_best_instance()
    if not instance:
        raise HTTPException(status_code=503, detail="No healthy instances available")
    return {
        "host": instance.host,
        "load": instance.current_load,
        "queue_length": instance.queue_length,
        "avg_response_time": instance.avg_response_time
    }
