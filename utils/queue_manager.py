from redis import Redis
from rq import Queue, Worker, Connection
from typing import Any, Dict, Optional, List
import json
import logging
import time
from datetime import datetime
import os
from pathlib import Path

class QueueManager:
    def __init__(self, redis_url: str = "redis://localhost:6379"):
        self.redis = Redis.from_url(redis_url)
        self.queue = Queue('lmstudio_tasks', connection=self.redis)
        self.results_dir = Path("task_results")
        self.results_dir.mkdir(exist_ok=True)

    def enqueue_task(self, task_type: str, payload: Dict[str, Any]) -> str:
        """
        Enqueue a task and return its ID
        """
        task_id = f"{task_type}_{int(time.time())}"
        task_data = {
            "id": task_id,
            "type": task_type,
            "payload": payload,
            "status": "queued",
            "created_at": datetime.now().isoformat()
        }
        
        # Save task data
        self._save_task_data(task_id, task_data)
        
        # Enqueue the task
        job = self.queue.enqueue(
            f"tasks.{task_type}",
            task_data,
            job_id=task_id,
            result_ttl=3600  # Keep result for 1 hour
        )
        
        return task_id

    def get_task_status(self, task_id: str) -> Dict[str, Any]:
        """
        Get the current status of a task
        """
        job = self.queue.fetch_job(task_id)
        if not job:
            # Check if we have saved results
            saved_data = self._load_task_data(task_id)
            if saved_data:
                return saved_data
            return {"status": "not_found"}

        status = {
            "id": task_id,
            "status": job.get_status(),
            "created_at": job.created_at.isoformat() if job.created_at else None,
            "ended_at": job.ended_at.isoformat() if job.ended_at else None,
            "result": job.result,
            "error": str(job.exc_info) if job.exc_info else None
        }

        # Save updated status
        self._save_task_data(task_id, status)
        
        return status

    def list_tasks(self, status: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        List all tasks, optionally filtered by status
        """
        tasks = []
        for job_id in self.queue.job_ids:
            job_status = self.get_task_status(job_id)
            if not status or job_status.get("status") == status:
                tasks.append(job_status)
        return tasks

    def _save_task_data(self, task_id: str, data: Dict[str, Any]):
        """Save task data to file"""
        task_file = self.results_dir / f"{task_id}.json"
        with open(task_file, 'w') as f:
            json.dump(data, f, indent=2)

    def _load_task_data(self, task_id: str) -> Optional[Dict[str, Any]]:
        """Load task data from file"""
        task_file = self.results_dir / f"{task_id}.json"
        try:
            with open(task_file, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return None

    def cleanup_old_tasks(self, max_age_hours: int = 24):
        """
        Clean up old task results
        """
        current_time = time.time()
        for task_file in self.results_dir.glob("*.json"):
            if (current_time - task_file.stat().st_mtime) > (max_age_hours * 3600):
                task_file.unlink()

    @staticmethod
    def start_worker(redis_url: str = "redis://localhost:6379"):
        """
        Start a worker process
        """
        redis_conn = Redis.from_url(redis_url)
        with Connection(redis_conn):
            worker = Worker(['lmstudio_tasks'])
            worker.work()
