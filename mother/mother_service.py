import os
import sys
import time
import json
import logging
import schedule
import requests
from datetime import datetime, timedelta
import win32serviceutil
import win32service
import win32event
import servicemanager
from pathlib import Path
from typing import Dict, List
from dataclasses import dataclass
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('mother_service.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger('MotherService')

@dataclass
class Agent:
    name: str
    last_active: datetime
    status: str
    warning_threshold: timedelta = timedelta(minutes=30)
    error_threshold: timedelta = timedelta(hours=2)

class MotherService(win32serviceutil.ServiceFramework):
    _svc_name_ = "TheMother"
    _svc_display_name_ = "The Mother - Agent Supervisor"
    _svc_description_ = "Monitors and supervises The Circle's agents, ensuring they stay active and on task."

    def __init__(self, args):
        win32serviceutil.ServiceFramework.__init__(self, args)
        self.stop_event = win32event.CreateEvent(None, 0, 0, None)
        self.agents: Dict[str, Agent] = {
            "overseer": Agent("The Overseer", datetime.now(), "active"),
            "seer": Agent("The Seer", datetime.now(), "active"),
            "scribe": Agent("The Scribe", datetime.now(), "active"),
            "watcher": Agent("The Watcher", datetime.now(), "active"),
            "keeper": Agent("The Keeper", datetime.now(), "active"),
            "tester": Agent("The Tester", datetime.now(), "active")
        }
        
        # Set up file monitoring
        self.observer = Observer()
        self.watch_paths = {
            "logs": Path("logs"),
            "output": Path("output"),
            "status": Path("status")
        }
        
        # Create directories if they don't exist
        for path in self.watch_paths.values():
            path.mkdir(exist_ok=True)

    def SvcStop(self):
        """Stop the service"""
        self.ReportServiceStatus(win32service.SERVICE_STOP_PENDING)
        win32event.SetEvent(self.stop_event)
        self.observer.stop()

    def SvcDoRun(self):
        """Run the service"""
        try:
            servicemanager.LogMsg(
                servicemanager.EVENTLOG_INFORMATION_TYPE,
                servicemanager.PYS_SERVICE_STARTED,
                (self._svc_name_, '')
            )
            
            # Set up file monitoring
            for path in self.watch_paths.values():
                self.observer.schedule(
                    AgentActivityHandler(self),
                    str(path),
                    recursive=False
                )
            self.observer.start()
            
            # Schedule regular checks
            schedule.every(5).minutes.do(self.check_agents)
            schedule.every(1).hours.do(self.generate_report)
            
            # Main service loop
            while True:
                schedule.run_pending()
                # Check if service is being stopped
                if win32event.WaitForSingleObject(self.stop_event, 1000) == win32event.WAIT_OBJECT_0:
                    break
                time.sleep(1)
                
        except Exception as e:
            logger.error(f"Service error: {e}")
            self.SvcStop()

    def check_agents(self):
        """Check all agents' status and nag if needed"""
        current_time = datetime.now()
        
        for agent_id, agent in self.agents.items():
            time_inactive = current_time - agent.last_active
            
            if time_inactive > agent.error_threshold:
                self.nag_agent(agent, "ERROR", f"has been inactive for {time_inactive}!")
            elif time_inactive > agent.warning_threshold:
                self.nag_agent(agent, "WARNING", f"seems to be slacking off! Last active {time_inactive} ago.")

    def nag_agent(self, agent: Agent, level: str, message: str):
        """Send a nagging message about an agent"""
        nag_message = f"{level}: {agent.name} {message}"
        logger.warning(nag_message)
        
        # Write to status file
        status_file = self.watch_paths["status"] / f"{agent.name.lower()}_status.json"
        status = {
            "timestamp": datetime.now().isoformat(),
            "level": level,
            "message": nag_message,
            "last_active": agent.last_active.isoformat()
        }
        
        with open(status_file, 'w') as f:
            json.dump(status, f, indent=2)
        
        # TODO: Implement actual agent communication
        # This could be through a message queue, API calls, etc.

    def generate_report(self):
        """Generate a periodic report on agent activity"""
        report = {
            "timestamp": datetime.now().isoformat(),
            "agents": {
                agent_id: {
                    "name": agent.name,
                    "status": agent.status,
                    "last_active": agent.last_active.isoformat(),
                    "inactive_duration": str(datetime.now() - agent.last_active)
                }
                for agent_id, agent in self.agents.items()
            }
        }
        
        report_file = self.watch_paths["logs"] / f"mother_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2)

class AgentActivityHandler(FileSystemEventHandler):
    def __init__(self, service: MotherService):
        self.service = service

    def on_modified(self, event):
        if event.is_directory:
            return
            
        # Update agent's last active time based on file activity
        file_path = Path(event.src_path)
        for agent_id, agent in self.service.agents.items():
            if agent_id in file_path.stem:
                agent.last_active = datetime.now()
                agent.status = "active"
                logger.info(f"Updated {agent.name}'s last active time")

if __name__ == '__main__':
    if len(sys.argv) == 1:
        servicemanager.Initialize()
        servicemanager.PrepareToHostSingle(MotherService)
        servicemanager.StartServiceCtrlDispatcher()
    else:
        win32serviceutil.HandleCommandLine(MotherService)
