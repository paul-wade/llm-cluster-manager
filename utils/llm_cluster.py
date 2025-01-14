from typing import Dict, List, Optional
import requests
import time
import socket
import psutil
import logging
from dataclasses import dataclass
from datetime import datetime, timedelta
import threading
import json

@dataclass
class LMStudioInstance:
    host: str
    port: int
    last_health_check: datetime
    is_healthy: bool
    current_load: float  # 0-1 scale
    queue_length: int
    total_requests: int
    failed_requests: int
    avg_response_time: float

class LLMClusterManager:
    def __init__(self, network_range: str = "192.168.1.0/24", base_port: int = 1234):
        self.instances: Dict[str, LMStudioInstance] = {}
        self.network_range = network_range
        self.base_port = base_port
        self.lock = threading.Lock()
        self.logger = logging.getLogger("LLMCluster")
        
        # Start background tasks
        self.discovery_thread = threading.Thread(target=self._discover_instances, daemon=True)
        self.health_check_thread = threading.Thread(target=self._health_check_loop, daemon=True)
        self.discovery_thread.start()
        self.health_check_thread.start()

    def _discover_instances(self):
        """Continuously discover LMStudio instances on the network"""
        while True:
            try:
                # Scan network for LMStudio instances
                for host in self._scan_network():
                    if host not in self.instances:
                        if self._check_lmstudio_available(host):
                            with self.lock:
                                self.instances[host] = LMStudioInstance(
                                    host=host,
                                    port=self.base_port,
                                    last_health_check=datetime.now(),
                                    is_healthy=True,
                                    current_load=0.0,
                                    queue_length=0,
                                    total_requests=0,
                                    failed_requests=0,
                                    avg_response_time=0.0
                                )
                            self.logger.info(f"Discovered new LMStudio instance at {host}")
            except Exception as e:
                self.logger.error(f"Error in instance discovery: {str(e)}")
            time.sleep(60)  # Check every minute

    def _scan_network(self) -> List[str]:
        """Scan the network for potential LMStudio hosts"""
        active_hosts = []
        try:
            # Basic network scan - can be enhanced with nmap or similar
            for i in range(1, 255):
                host = f"192.168.1.{i}"
                try:
                    socket.create_connection((host, self.base_port), timeout=1)
                    active_hosts.append(host)
                except (socket.timeout, ConnectionRefusedError):
                    continue
        except Exception as e:
            self.logger.error(f"Network scan error: {str(e)}")
        return active_hosts

    def _check_lmstudio_available(self, host: str) -> bool:
        """Check if LMStudio is running on the host"""
        try:
            response = requests.get(
                f"http://{host}:{self.base_port}/v1/models",
                timeout=2
            )
            return response.status_code == 200
        except:
            return False

    def _health_check_loop(self):
        """Continuously monitor health of instances"""
        while True:
            with self.lock:
                for host, instance in list(self.instances.items()):
                    try:
                        # Check basic connectivity
                        is_healthy = self._check_lmstudio_available(host)
                        
                        # Get system metrics if available
                        try:
                            metrics_response = requests.get(
                                f"http://{host}:{self.base_port}/metrics",
                                timeout=2
                            )
                            metrics = metrics_response.json()
                            instance.current_load = metrics.get('cpu_usage', 0)
                            instance.queue_length = metrics.get('queue_length', 0)
                        except:
                            # Metrics endpoint might not exist, ignore
                            pass

                        instance.is_healthy = is_healthy
                        instance.last_health_check = datetime.now()

                        if not is_healthy:
                            self.logger.warning(f"Instance {host} is unhealthy")
                    except Exception as e:
                        self.logger.error(f"Health check failed for {host}: {str(e)}")
                        instance.is_healthy = False

            time.sleep(10)  # Check every 10 seconds

    def get_best_instance(self) -> Optional[LMStudioInstance]:
        """Get the best instance to handle the next request"""
        with self.lock:
            available_instances = [
                i for i in self.instances.values()
                if i.is_healthy and i.current_load < 0.9  # Allow some headroom
            ]
            
            if not available_instances:
                return None

            # Sort by load and queue length
            return min(
                available_instances,
                key=lambda x: (x.current_load * 0.7 + (x.queue_length / 10) * 0.3)
            )

    def execute_request(self, request_data: Dict) -> Dict:
        """Execute a request on the best available instance"""
        instance = self.get_best_instance()
        if not instance:
            raise Exception("No healthy instances available")

        start_time = time.time()
        try:
            response = requests.post(
                f"http://{instance.host}:{instance.port}/v1/chat/completions",
                json=request_data,
                timeout=3600  # Long timeout for generation
            )
            
            # Update metrics
            with self.lock:
                instance.total_requests += 1
                instance.avg_response_time = (
                    (instance.avg_response_time * (instance.total_requests - 1) +
                    (time.time() - start_time)) / instance.total_requests
                )
            
            return response.json()
        except Exception as e:
            with self.lock:
                instance.failed_requests += 1
            raise e

    def get_cluster_status(self) -> Dict:
        """Get status of all instances in the cluster"""
        with self.lock:
            return {
                host: {
                    "healthy": instance.is_healthy,
                    "load": instance.current_load,
                    "queue_length": instance.queue_length,
                    "total_requests": instance.total_requests,
                    "failed_requests": instance.failed_requests,
                    "avg_response_time": instance.avg_response_time,
                    "last_check": instance.last_health_check.isoformat()
                }
                for host, instance in self.instances.items()
            }
