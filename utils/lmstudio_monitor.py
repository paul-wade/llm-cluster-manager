import psutil
import logging
import time
import requests
from typing import Optional, Dict, List
import json
import os
from pathlib import Path

class LMStudioMonitor:
    def __init__(self, base_url: str, process_name: str = "LMStudio.exe"):
        self.base_url = base_url
        self.process_name = process_name
        self.process: Optional[psutil.Process] = None
        self._find_process()

    def _find_process(self) -> bool:
        """Find the LMStudio process"""
        for proc in psutil.process_iter(['name']):
            try:
                if proc.info['name'] == self.process_name:
                    self.process = proc
                    return True
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue
        return False

    def is_running(self) -> bool:
        """Check if LMStudio process is running"""
        if not self.process:
            return self._find_process()
        try:
            return self.process.is_running()
        except psutil.NoSuchProcess:
            self.process = None
            return False

    def check_api_health(self) -> bool:
        """Check if the API is responding"""
        try:
            # Try a simple request to see if API is responsive
            response = requests.post(
                f"{self.base_url}/chat/completions",
                json={
                    "model": "local-model",
                    "messages": [{"role": "user", "content": "test"}],
                    "max_tokens": 1
                },
                timeout=5
            )
            return response.status_code == 200
        except requests.exceptions.RequestException:
            return False

    def get_process_info(self) -> Dict:
        """Get process information including memory usage and CPU"""
        if not self.is_running():
            return {"status": "not_running"}
        
        try:
            with self.process.oneshot():
                memory = self.process.memory_info()
                cpu_percent = self.process.cpu_percent()
                status = self.process.status()
                
            return {
                "status": status,
                "memory_used": memory.rss / 1024 / 1024,  # MB
                "cpu_percent": cpu_percent,
                "pid": self.process.pid,
                "api_healthy": self.check_api_health()
            }
        except psutil.NoSuchProcess:
            self.process = None
            return {"status": "not_running"}

    def wait_for_startup(self, timeout: int = 60, check_interval: int = 1) -> bool:
        """Wait for LMStudio to start and become responsive"""
        start_time = time.time()
        while time.time() - start_time < timeout:
            if self.is_running() and self.check_api_health():
                return True
            time.sleep(check_interval)
        return False

    def save_state(self, state_file: str):
        """Save current state to a file"""
        state = self.get_process_info()
        state['timestamp'] = time.time()
        
        state_path = Path(state_file)
        state_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(state_path, 'w') as f:
            json.dump(state, f)

    @staticmethod
    def load_state(state_file: str) -> Optional[Dict]:
        """Load previous state from file"""
        try:
            with open(state_file, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return None
