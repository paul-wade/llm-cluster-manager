import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Styled components for the medieval/mystical theme
const ChamberContainer = styled.div`
  background: #1a1a1a;
  background-image: url('/chamber-background.png');
  min-height: 100vh;
  color: #d4d4d4;
`;

const RoundTable = styled.div`
  width: 800px;
  height: 800px;
  margin: 0 auto;
  position: relative;
  background: radial-gradient(circle, #2a2a2a 0%, #1a1a1a 100%);
  border: 2px solid #3a3a3a;
  border-radius: 50%;
  box-shadow: 0 0 50px rgba(0,0,0,0.5);
`;

const EntitySeat = styled.div<{ position: number }>`
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${props => props.active ? '#2a2a2a' : '#1a1a1a'};
  border: 2px solid #3a3a3a;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-origin: center;
  transform: rotate(${props => props.position * 90}deg) translateY(-350px);
  transition: all 0.3s ease;
  
  &:hover {
    background: #3a3a3a;
  }
`;

const ChatBubble = styled.div<{ from: string }>`
  background: #2a2a2a;
  border: 1px solid #3a3a3a;
  border-radius: 10px;
  padding: 15px;
  margin: 10px;
  max-width: 80%;
  position: relative;
  align-self: ${props => props.from === 'self' ? 'flex-end' : 'flex-start'};
  
  &:before {
    content: '';
    position: absolute;
    border-style: solid;
    border-width: 10px;
    border-color: transparent #3a3a3a transparent transparent;
    left: -20px;
    top: 50%;
    transform: translateY(-50%);
  }
`;

const CouncilAlert = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(58, 58, 58, 0.9);
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  border: 2px solid #gold;
  animation: glow 2s infinite alternate;
  
  @keyframes glow {
    from {
      box-shadow: 0 0 10px #gold;
    }
    to {
      box-shadow: 0 0 20px #gold;
    }
  }
`;

const ChatContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

interface Message {
  id: string;
  sender: string;
  content: string;
  type: string;
  timestamp: Date;
}

interface Entity {
  name: string;
  role: string;
  status: string;
  position: number;
}

export const Chamber: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [entities, setEntities] = useState<Entity[]>([
    { name: 'The Seer', role: 'architect', status: 'active', position: 0 },
    { name: 'The Scribe', role: 'developer', status: 'thinking', position: 1 },
    { name: 'The Watcher', role: 'qa', status: 'active', position: 2 },
    { name: 'The Keeper', role: 'devops', status: 'away', position: 3 }
  ]);
  const [councilActive, setCouncilActive] = useState(false);

  return (
    <ChamberContainer>
      <RoundTable>
        {entities.map(entity => (
          <EntitySeat 
            key={entity.name}
            position={entity.position}
            active={entity.status === 'active'}
          >
            <div className="entity-avatar">
              {/* Entity-specific icon */}
              <img src={`/icons/${entity.role}.svg`} alt={entity.name} />
              <div className={`status-indicator ${entity.status}`} />
            </div>
          </EntitySeat>
        ))}
        
        <ChatContainer>
          {messages.map(message => (
            <ChatBubble
              key={message.id}
              from={message.sender}
              type={message.type}
            >
              <div className="message-header">
                <span className="sender">{message.sender}</span>
                <span className="timestamp">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="message-content">{message.content}</div>
            </ChatBubble>
          ))}
        </ChatContainer>
        
        {councilActive && (
          <CouncilAlert>
            <h3>🔔 Council Session Active</h3>
            <p>The council has been summoned to address an issue.</p>
          </CouncilAlert>
        )}
      </RoundTable>
    </ChamberContainer>
  );
};
