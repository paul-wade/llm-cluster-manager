from typing import Dict, Any
import autogen

class BaseDevAgent(autogen.AssistantAgent):
    """Base class for all development agents"""
    
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
        """Determine if this agent can handle the given task"""
        raise NotImplementedError
        
    def execute_task(self, task: str) -> str:
        """Execute the given task and return the result"""
        raise NotImplementedError
