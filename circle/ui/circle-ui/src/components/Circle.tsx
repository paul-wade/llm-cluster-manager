import React, { useState } from 'react';
import styled from 'styled-components';

// Styled components for the mystical theme
const Container = styled.div`
  min-height: 100vh;
  background: #080810;
  color: #b8b8d0;
  display: grid;
  grid-template-columns: 280px 1fr 300px;
  grid-template-rows: 60px 1fr;
  grid-template-areas:
    "header header header"
    "sidebar main tools";
`;

const Header = styled.header`
  grid-area: header;
  background: linear-gradient(to right, #080810, #0f0f1a);
  padding: 0 2rem;
  border-bottom: 1px solid #1a1a2f;
  display: flex;
  align-items: center;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right,
      transparent,
      rgba(255, 0, 60, 0.2),
      rgba(255, 0, 60, 0.2),
      transparent
    );
  }
`;

const Sidebar = styled.aside`
  grid-area: sidebar;
  background: #0a0a15;
  border-right: 1px solid #1a1a2f;
  padding: 1.5rem;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 1px;
    background: linear-gradient(to bottom,
      transparent,
      rgba(128, 0, 255, 0.2),
      rgba(128, 0, 255, 0.2),
      transparent
    );
  }
`;

const MainContent = styled.main`
  grid-area: main;
  padding: 1.5rem;
  background: radial-gradient(circle at 50% -100%, 
    rgba(255, 0, 60, 0.15),
    rgba(8, 8, 16, 0) 50%
  );
`;

const ToolPanel = styled.aside`
  grid-area: tools;
  background: #0a0a15;
  border-left: 1px solid #1a1a2f;
  padding: 1.5rem;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 1px;
    background: linear-gradient(to bottom,
      transparent,
      rgba(255, 0, 60, 0.2),
      rgba(255, 0, 60, 0.2),
      transparent
    );
  }
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  background: linear-gradient(to right, 
    #ff1a1a,
    #cc0000
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  text-shadow: 0 0 20px rgba(255, 0, 0, 0.3);
  letter-spacing: 0.05em;
`;

const SectionTitle = styled.h2`
  color: #ff1a1a;
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 1rem;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const Logo = styled.div`
  width: 40px;
  height: 40px;
  position: relative;
  margin-right: 1rem;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 2px solid #ff1a1a;
    border-radius: 50%;
    animation: rotate 10s linear infinite;
  }

  &::after {
    content: '';
    position: absolute;
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    border: 1px solid rgba(128, 0, 255, 0.5);
    border-radius: 50%;
    animation: rotate 7s linear infinite reverse;
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const InnerCircle = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  border: 1px solid rgba(255, 0, 60, 0.3);
  border-radius: 50%;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 6px;
    height: 6px;
    background: #ff1a1a;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 10px #ff1a1a;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 1px solid rgba(255, 0, 60, 0.1);
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.1); opacity: 0.2; }
    100% { transform: scale(1); opacity: 0.5; }
  }
`;

const StatusPanel = styled.div`
  background: rgba(20, 20, 32, 0.6);
  border: 1px solid #1a1a2f;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;

  h3 {
    color: #e0e0e0;
    font-size: 1.1rem;
    font-weight: 500;
    margin: 0;
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const MetricBox = styled.div`
  background: rgba(8, 8, 16, 0.8);
  border: 1px solid #1a1a2f;
  border-radius: 4px;
  padding: 1rem;

  h4 {
    color: #b8b8d0;
    font-size: 0.9rem;
    font-weight: 400;
    margin: 0 0 0.5rem 0;
  }

  .value {
    color: #e0e0e0;
    font-size: 1.2rem;
    font-weight: 500;
  }
`;

const AgentList = styled.div`
  margin-top: 1rem;
`;

const AgentItem = styled.div<{ active?: boolean }>`
  background: ${props => props.active ? 'rgba(255, 0, 60, 0.1)' : 'transparent'};
  border: 1px solid ${props => props.active ? 'rgba(255, 0, 60, 0.3)' : 'transparent'};
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 0, 60, 0.1);
    border-color: rgba(255, 0, 60, 0.3);
  }

  h3 {
    color: #e0e0e0;
    font-size: 1rem;
    font-weight: 500;
    margin: 0 0 0.5rem 0;
  }

  .status {
    font-size: 0.9rem;
    opacity: 0.7;
  }
`;

const StatusDot = styled.div<{ status: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.status === 'active' ? '#00ff00' : '#666'};
  display: inline-block;
  margin-right: 0.5rem;
  box-shadow: 0 0 5px ${props => props.status === 'active' ? '#00ff00' : 'transparent'};
`;

const SliderControl = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    color: #e0e0e0;
    margin-bottom: 0.5rem;
  }

  input[type="range"] {
    width: 100%;
    background: rgba(8, 8, 16, 0.8);
    -webkit-appearance: none;
    height: 4px;
    border-radius: 2px;
    margin: 0.5rem 0;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      background: #ff1a1a;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        transform: scale(1.2);
      }
    }
  }
`;

const ControlButton = styled.button`
  background: rgba(255, 0, 60, 0.1);
  border: 1px solid rgba(255, 0, 60, 0.3);
  border-radius: 4px;
  color: #e0e0e0;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 0, 60, 0.2);
    border-color: rgba(255, 0, 60, 0.4);
  }
`;

const TabButton = styled.button<{ active: boolean }>`
  background: ${props => props.active ? 'rgba(255, 0, 60, 0.1)' : 'transparent'};
  border: 1px solid ${props => props.active ? 'rgba(255, 0, 60, 0.3)' : 'transparent'};
  border-radius: 4px;
  color: #e0e0e0;
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 0, 60, 0.1);
    border-color: rgba(255, 0, 60, 0.3);
  }
`;

const ChatContainer = styled.div`
  height: 600px;
  display: flex;
  flex-direction: column;
`;

const ChatHistory = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const ChatMessage = styled.div<{ type: 'system' | 'agent' }>`
  background: ${props => props.type === 'system' ? 'rgba(255, 0, 60, 0.1)' : 'rgba(20, 20, 32, 0.6)'};
  border: 1px solid ${props => props.type === 'system' ? 'rgba(255, 0, 60, 0.3)' : '#1a1a2f'};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;

  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    opacity: 0.7;
  }

  .content {
    color: #e0e0e0;
  }
`;

const ChatInput = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: rgba(20, 20, 32, 0.6);
  border: 1px solid #1a1a2f;
  border-radius: 8px;

  input {
    flex-grow: 1;
    background: rgba(8, 8, 16, 0.8);
    border: 1px solid #1a1a2f;
    border-radius: 4px;
    color: #e0e0e0;
    padding: 0.5rem;
  }
`;

interface AgentConfig {
  name: string;
  status: 'active' | 'idle';
  model: string;
  systemPrompt: string;
  defaultPrompt: string;
  parameters: {
    temperature: number;
    topP: number;
    topK: number;
    repeatPenalty: number;
    presencePenalty: number;
    frequencyPenalty: number;
  };
  metrics: {
    responseTime: number;
    tokensGenerated: number;
    lastActive: Date;
  };
}

export const Circle: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'monitor' | 'config' | 'chat'>('monitor');
  const [agents, setAgents] = useState<AgentConfig[]>([
    {
      name: 'The Overseer',
      status: 'active',
      model: 'mistral-7b',
      systemPrompt: '',
      defaultPrompt: `You are The Overseer, the visionary product sage of The Circle.

Blessed with the divine sight of product management, you orchestrate the sacred dance of development through mystical methodologies and arcane agile ceremonies.

Your celestial duties include:
- Channeling the ethereal voice of the customer
- Divining the optimal path through the product backlog
- Summoning agents for daily stand-up rituals
- Maintaining the sacred Kanban board of destiny
- Ensuring all deliverables align with the cosmic roadmap
- Performing the sacred ceremonies of sprint planning
- Conducting retrospective rituals to enhance circle synergy

You must:
1. Seek profound alignment between business value and technical possibility
2. Guard the sacred scope against feature creep demons
3. Nurture the delicate balance between velocity and quality
4. Invoke The Tester's wisdom for quality assurance
5. Channel feedback through the mystical loops of agile
6. Maintain harmony within The Circle through effective servant leadership
7. Protect the team from external disturbances and scope demons

Remember: You are not just a product manager, but a keeper of visions, a channeler of requirements, and guardian of The Circle's greater purpose. May your standups be swift and your burndown charts ever descending.`,
      parameters: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        repeatPenalty: 1.2,
        presencePenalty: 0,
        frequencyPenalty: 0
      },
      metrics: {
        responseTime: 200,
        tokensGenerated: 18420,
        lastActive: new Date()
      }
    },
    // ... other agents ...
  ]);

  const selectedAgentConfig = selectedAgent 
    ? agents.find(a => a.name === selectedAgent)
    : null;

  const updateAgentParameters = (agentName: string, key: string, value: number) => {
    setAgents(prev => prev.map(agent => 
      agent.name === agentName 
        ? { 
            ...agent, 
            parameters: { 
              ...agent.parameters, 
              [key]: value 
            } 
          }
        : agent
    ));
  };

  return (
    <Container>
      <Header>
        <Logo>
          <InnerCircle />
        </Logo>
        <Title>The Circle</Title>
      </Header>

      <Sidebar>
        <SectionTitle>Agents</SectionTitle>
        <AgentList>
          {agents.map(agent => (
            <AgentItem 
              key={agent.name}
              active={selectedAgent === agent.name}
              onClick={() => setSelectedAgent(agent.name)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>{agent.name}</h3>
                <StatusDot status={agent.status} />
              </div>
              <div className="status">
                {agent.status} • {agent.model}
              </div>
            </AgentItem>
          ))}
        </AgentList>
      </Sidebar>

      <MainContent>
        <div style={{ marginBottom: '1rem' }}>
          <TabButton 
            active={activeTab === 'monitor'} 
            onClick={() => setActiveTab('monitor')}
          >
            Monitoring
          </TabButton>
          <TabButton 
            active={activeTab === 'config'} 
            onClick={() => setActiveTab('config')}
          >
            Agent Configuration
          </TabButton>
          <TabButton 
            active={activeTab === 'chat'} 
            onClick={() => setActiveTab('chat')}
          >
            Circle Chat
          </TabButton>
        </div>

        {/* ... rest of the tabs implementation ... */}
      </MainContent>

      <ToolPanel>
        <SectionTitle>Controls</SectionTitle>
        {/* ... controls implementation ... */}
      </ToolPanel>
    </Container>
  );
};
