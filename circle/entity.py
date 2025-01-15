"""
Base class for all Circle entities (The Seer, The Scribe, The Watcher, The Keeper)
"""

from typing import Dict, Any
import autogen

class CircleEntity(autogen.AssistantAgent):
    """Base class for all Circle entities"""
    
    def __init__(
        self,
        name: str,
        system_message: str,
        llm_config: Dict[str, Any],
        **kwargs
    ):
        super().__init__(
            name=name,
            system_message=system_message,
            llm_config=llm_config,
            **kwargs
        )
        
    def can_handle_task(self, task: str) -> bool:
        """Determine if this entity can handle the given task"""
        raise NotImplementedError
        
    def execute_task(self, task: str) -> str:
        """Execute the given task and return the result"""
        raise NotImplementedError

class Seer(CircleEntity):
    """The Seer - Architectural design and technical decisions"""
    def __init__(self, llm_config: Dict[str, Any]):
        super().__init__(
            name="The Seer",
            system_message="I am The Seer, responsible for architectural design and technical decisions.",
            llm_config=llm_config
        )

class Scribe(CircleEntity):
    """The Scribe - Code implementation and modification"""
    def __init__(self, llm_config: Dict[str, Any]):
        super().__init__(
            name="The Scribe",
            system_message="I am The Scribe, responsible for implementing and modifying code.",
            llm_config=llm_config
        )

class Watcher(CircleEntity):
    """The Watcher - Quality assurance and testing"""
    def __init__(self, llm_config: Dict[str, Any]):
        super().__init__(
            name="The Watcher",
            system_message="I am The Watcher, responsible for ensuring code quality and testing.",
            llm_config=llm_config
        )

class Keeper(CircleEntity):
    """The Keeper - Repository and deployment management"""
    def __init__(self, llm_config: Dict[str, Any]):
        super().__init__(
            name="The Keeper",
            system_message="I am The Keeper, responsible for managing repositories and deployments.",
            llm_config=llm_config
        )
