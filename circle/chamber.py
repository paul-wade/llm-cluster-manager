"""
The Circle Chamber - A persistent space where entities can collaborate asynchronously
"""

from typing import Dict, List, Optional, Any
from datetime import datetime
from dataclasses import dataclass
import asyncio
import json
import websockets
import logging
from enum import Enum
import uuid

class MessageType(Enum):
    THOUGHT = "thought"         # Sharing ideas/considerations
    QUESTION = "question"       # Asking for input
    ANSWER = "answer"          # Responding to questions
    UPDATE = "update"          # Sharing progress
    BLOCKER = "blocker"        # Identifying obstacles
    SOLUTION = "solution"       # Proposing solutions
    CODE = "code"              # Sharing code
    REVIEW = "review"          # Code review comments
    SUMMON = "summon"          # Request specific entity's attention
    COUNCIL = "council"        # Summon the full council
    STATUS_REQUEST = "status_request"  # Ask about task status
    STATUS_REPORT = "status_report"    # Report current status

@dataclass
class Message:
    id: str
    type: MessageType
    sender: str
    content: str
    thread_id: Optional[str]    # For conversation threading
    mentions: List[str]         # Specific entities being addressed
    timestamp: datetime
    requires_attention: bool
    context: Dict[str, Any]     # Additional metadata
    urgency: str = "normal"     # normal, urgent, council

class CouncilSession:
    """Represents an active council session for solving blockers"""
    def __init__(self, summoner: str, issue: str):
        self.id = str(uuid.uuid4())
        self.summoner = summoner
        self.issue = issue
        self.participants: set[str] = set()
        self.status = "gathering"  # gathering, in_session, resolved
        self.solutions: List[str] = []
        self.started_at = datetime.now()
        self.resolved_at: Optional[datetime] = None

class CircleChamber:
    """
    A persistent space for entity collaboration, like a chat room for AIs
    """
    def __init__(self):
        self.conversations: Dict[str, List[Message]] = {}
        self.active_entities: Dict[str, 'EntityState'] = {}
        self.council_sessions: Dict[str, CouncilSession] = {}
        self.logger = logging.getLogger("Chamber")
        self.message_handlers = {}
        
    async def enter_chamber(self, entity_name: str, state: 'EntityState'):
        """An entity enters the chamber"""
        self.active_entities[entity_name] = state
        await self.broadcast_message(
            Message(
                id=str(uuid.uuid4()),
                type=MessageType.UPDATE,
                sender="Chamber",
                content=f"{entity_name} has entered the chamber",
                thread_id=None,
                mentions=[],
                timestamp=datetime.now(),
                requires_attention=False,
                context={"event": "enter"}
            )
        )
    
    async def leave_chamber(self, entity_name: str):
        """An entity leaves the chamber"""
        if entity_name in self.active_entities:
            del self.active_entities[entity_name]
            # Notify others
    
    async def post_message(self, message: Message):
        """Post a message to the chamber"""
        thread_id = message.thread_id or message.id
        if thread_id not in self.conversations:
            self.conversations[thread_id] = []
        self.conversations[thread_id].append(message)
        await self.notify_relevant_entities(message)
    
    async def notify_relevant_entities(self, message: Message):
        """Notify entities that should be aware of this message"""
        for entity_name, state in self.active_entities.items():
            if (entity_name in message.mentions or 
                message.requires_attention or 
                state.is_interested_in(message)):
                await state.notify(message)
    
    def get_conversation_context(self, thread_id: str, limit: int = 10) -> List[Message]:
        """Get recent messages from a conversation"""
        return self.conversations.get(thread_id, [])[-limit:]
    
    async def wait_for_response(self, 
                              thread_id: str, 
                              from_entity: Optional[str] = None,
                              timeout: Optional[float] = None) -> Optional[Message]:
        """Wait for a response in a conversation"""
        # Implementation that doesn't block the entire system
        pass

    async def summon_council(self, summoner: str, issue: str) -> str:
        """Summon all entities for a council session"""
        session = CouncilSession(summoner, issue)
        self.council_sessions[session.id] = session
        
        council_message = Message(
            id=str(uuid.uuid4()),
            type=MessageType.COUNCIL,
            sender="Chamber",
            content=f"🔔 Council Summoned by {summoner}\nIssue: {issue}",
            thread_id=session.id,
            mentions=list(self.active_entities.keys()),
            timestamp=datetime.now(),
            requires_attention=True,
            context={"session_id": session.id},
            urgency="council"
        )
        
        await self.broadcast_message(council_message)
        return session.id

    async def join_council(self, entity_name: str, session_id: str):
        """An entity joins a council session"""
        if session_id in self.council_sessions:
            session = self.council_sessions[session_id]
            session.participants.add(entity_name)
            await self.broadcast_message(
                Message(
                    id=str(uuid.uuid4()),
                    type=MessageType.UPDATE,
                    sender="Chamber",
                    content=f"{entity_name} has joined the council session",
                    thread_id=session_id,
                    mentions=[],
                    timestamp=datetime.now(),
                    requires_attention=False,
                    context={"event": "council_join"}
                )
            )

    async def propose_solution(self, session_id: str, entity_name: str, solution: str):
        """Propose a solution in a council session"""
        if session_id in self.council_sessions:
            session = self.council_sessions[session_id]
            session.solutions.append({"entity": entity_name, "solution": solution})
            await self.broadcast_message(
                Message(
                    id=str(uuid.uuid4()),
                    type=MessageType.SOLUTION,
                    sender=entity_name,
                    content=solution,
                    thread_id=session_id,
                    mentions=[session.summoner],
                    timestamp=datetime.now(),
                    requires_attention=True,
                    context={"event": "solution_proposed"}
                )
            )

    async def request_status(self, requester: str, target: str):
        """Request status update from another entity"""
        await self.post_message(
            Message(
                id=str(uuid.uuid4()),
                type=MessageType.STATUS_REQUEST,
                sender=requester,
                content=f"@{target} What's your current status?",
                thread_id=None,
                mentions=[target],
                timestamp=datetime.now(),
                requires_attention=True,
                context={"event": "status_request"}
            )
        )

    async def report_status(self, entity: str, status: str, thread_id: Optional[str] = None):
        """Report current status"""
        await self.post_message(
            Message(
                id=str(uuid.uuid4()),
                type=MessageType.STATUS_REPORT,
                sender=entity,
                content=status,
                thread_id=thread_id,
                mentions=[],
                timestamp=datetime.now(),
                requires_attention=False,
                context={"event": "status_report"}
            )
        )

class EntityState:
    """Represents an entity's state in the chamber"""
    def __init__(self, name: str, role: str):
        self.name = name
        self.role = role
        self.status = "active"
        self.current_task = None
        self.interests = set()  # What kinds of messages this entity cares about
        
    def is_interested_in(self, message: Message) -> bool:
        """Determine if this entity should be notified of a message"""
        return (message.type in self.interests or
                self.role in message.content.lower() or
                message.requires_attention)
    
    async def notify(self, message: Message):
        """Handle a new message notification"""
        # Implementation for how entity responds to notifications
        pass

class ConversationManager:
    """Manages ongoing conversations and their states"""
    def __init__(self):
        self.active_threads: Dict[str, 'ConversationThread'] = {}
        
    def create_thread(self, topic: str) -> 'ConversationThread':
        """Create a new conversation thread"""
        thread = ConversationThread(topic)
        self.active_threads[thread.id] = thread
        return thread
    
    def get_thread(self, thread_id: str) -> Optional['ConversationThread']:
        """Get an existing conversation thread"""
        return self.active_threads.get(thread_id)

class ConversationThread:
    """Represents a single conversation thread"""
    def __init__(self, topic: str):
        self.id = str(uuid.uuid4())
        self.topic = topic
        self.messages: List[Message] = []
        self.participants: set[str] = set()
        self.status = "active"
        self.created_at = datetime.now()
        self.last_activity = datetime.now()
        
    def add_message(self, message: Message):
        """Add a message to the thread"""
        self.messages.append(message)
        self.participants.add(message.sender)
        self.last_activity = datetime.now()
        
    def get_summary(self) -> str:
        """Get a summary of the conversation"""
        return {
            "topic": self.topic,
            "participants": list(self.participants),
            "message_count": len(self.messages),
            "last_activity": self.last_activity,
            "status": self.status
        }
