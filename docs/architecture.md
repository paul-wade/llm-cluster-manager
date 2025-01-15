# The Circle Architecture

## Communication Patterns

```mermaid
graph TD
    O[Overseer] --> |Commands| Q[Message Queue]
    Q --> |Tasks| S[The Seer]
    Q --> |Tasks| SC[The Scribe]
    Q --> |Tasks| W[The Watcher]
    Q --> |Tasks| K[The Keeper]
    
    subgraph Knowledge Base
        G[Grimoire]
    end
    
    S --> |Updates| G
    SC --> |Updates| G
    W --> |Updates| G
    K --> |Updates| G
    
    G --> |Context| S
    G --> |Context| SC
    G --> |Context| W
    G --> |Context| K
```

## Distributed Processing Model

### 1. Message Queue System
- Distributed message queue for async communication
- Priority system for urgent synchronous requests
- Message types:
  - Command (requires immediate response)
  - Task (can be processed asynchronously)
  - Update (status and progress)
  - Query (knowledge base requests)

### 2. Entity States
Each entity can be in one of these states:
- Available: Ready for new tasks
- Processing: Working on a task
- Waiting: Blocked on another entity
- Offline: Not currently accessible

### 3. Task Dependencies
```mermaid
graph LR
    A[Architecture Task] --> C[Code Implementation]
    C --> T[Testing]
    T --> D[Deployment]
    
    subgraph Parallel Tasks
        PT1[Documentation]
        PT2[Performance Analysis]
        PT3[Security Review]
    end
```

### 4. Distributed LLM Configuration

Each entity can run on different machines with different LLM configurations:

| Entity | Recommended Model | Optimization |
|--------|------------------|--------------|
| Seer | Large context model | Context length |
| Scribe | Code-specialized model | Code completion |
| Watcher | Medium model | Testing focus |
| Keeper | Small model | Quick responses |

### 5. Synchronization Mechanisms

1. **Blocking Operations**
   - Architecture approval
   - Critical bug fixes
   - Deployment gates

2. **Non-Blocking Operations**
   - Documentation updates
   - Test execution
   - Code analysis
   - Repository maintenance

### 6. Network Topology

```mermaid
graph TD
    subgraph Machine 1
        O[Overseer]
        G[Grimoire]
    end
    
    subgraph Machine 2
        S[Seer - Large Model]
    end
    
    subgraph Machine 3
        SC[Scribe - Code Model]
    end
    
    subgraph Machine 4
        W[Watcher - Test Model]
    end
    
    subgraph Machine 5
        K[Keeper - Small Model]
    end
    
    O --> |Commands| S
    O --> |Commands| SC
    O --> |Commands| W
    O --> |Commands| K
    
    G --> |Knowledge| S
    G --> |Knowledge| SC
    G --> |Knowledge| W
    G --> |Knowledge| K
```

## Implementation Strategy

1. **Message Queue System**
```python
class CircleMessage:
    id: str
    type: MessageType  # Command/Task/Update/Query
    priority: int
    sender: str
    recipient: str
    content: dict
    requires_response: bool
    timeout: Optional[int]
```

2. **Entity Manager**
```python
class EntityManager:
    def schedule_task(self, task: Task) -> None:
        """Schedule a task considering dependencies"""
        
    def check_dependencies(self, task: Task) -> bool:
        """Check if all dependencies are met"""
        
    def notify_completion(self, task: Task) -> None:
        """Notify dependent tasks of completion"""
```

3. **State Management**
```python
class EntityState:
    def transition_to(self, new_state: State) -> None:
        """Handle state transitions"""
        
    def can_process(self, task: Task) -> bool:
        """Check if entity can process task"""
```
