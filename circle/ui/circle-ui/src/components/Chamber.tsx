import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Styled components for the sinister theme
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
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
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
    0% {
      transform: scale(1);
      opacity: 0.5;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.2;
    }
    100% {
      transform: scale(1);
      opacity: 0.5;
    }
  }
`;

const AgentCard = styled.div<{ selected?: boolean }>`
  background: rgba(20, 20, 32, ${props => props.selected ? '0.8' : '0.6'});
  border: 1px solid ${props => props.selected ? '#ff1a1a' : '#1a1a2f'};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(25, 25, 40, 0.8);
    border-color: rgba(255, 0, 60, 0.3);
  }
`;

const AgentConfigPanel = styled.div`
  padding: 1rem;
  background: rgba(8, 8, 16, 0.9);
  border: 1px solid #1a1a2f;
  border-radius: 8px;
  margin-top: 1rem;
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

const defaultParameters = {
  seer: {
    temperature: 0.9,
    topP: 0.95,
    topK: 50,
    repeatPenalty: 1.1,
    presencePenalty: 0.1,
    frequencyPenalty: 0.1,
  },
  scribe: {
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
    repeatPenalty: 1.2,
    presencePenalty: 0,
    frequencyPenalty: 0,
  },
  watcher: {
    temperature: 0.5,
    topP: 0.8,
    topK: 30,
    repeatPenalty: 1.3,
    presencePenalty: 0.2,
    frequencyPenalty: 0.2,
  },
  keeper: {
    temperature: 0.6,
    topP: 0.85,
    topK: 35,
    repeatPenalty: 1.2,
    presencePenalty: 0.1,
    frequencyPenalty: 0.1,
  }
};

interface ChatMessage {
  id: string;
  type: string;
  sender: string;
  content: string;
  timestamp: Date;
}

interface SystemStatus {
  vpn: {
    status: 'connected' | 'disconnected';
    ip: string;
    location: string;
  };
  git: {
    activeBranch: string;
    pendingPRs: number;
    lastCommit: string;
  };
  fileSystem: {
    workingDir: string;
    recentFiles: string[];
    permissions: string;
  };
}

const StatusPanel = styled.div`
  background: rgba(20, 20, 32, 0.6);
  border: 1px solid #1a1a2f;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;

  &:hover {
    background: rgba(25, 25, 40, 0.6);
    border-color: rgba(255, 0, 60, 0.3);
  }
`;

const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const PRList = styled.div`
  margin-top: 1rem;
`;

const PRItem = styled.div`
  padding: 0.75rem;
  border: 1px solid #1a1a2f;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background: rgba(20, 20, 32, 0.6);
  }
`;

const MetricBox = styled.div`
  background: rgba(20, 20, 32, 0.6);
  border: 1px solid #1a1a2f;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;

  h4 {
    font-size: 0.9rem;
    opacity: 0.7;
    margin: 0 0 0.5rem 0;
  }

  .value {
    font-size: 1.5rem;
    font-weight: 600;
    color: #ff1a1a;
    text-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
`;

const SliderControl = styled.div`
  margin-bottom: 1rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    opacity: 0.7;
  }

  input[type="range"] {
    width: 100%;
    background: #1a1a2f;
    height: 4px;
    border-radius: 2px;
    -webkit-appearance: none;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      background: #ff1a1a;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
    }
  }
`;

const StatusDot = styled.div<{ status: 'success' | 'warning' | 'error' | 'idle' }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 0.5rem;
  background: ${props => 
    props.status === 'success' ? '#00ff00' :
    props.status === 'warning' ? '#ffaa00' :
    props.status === 'error' ? '#ff0000' :
    '#666666'};
  box-shadow: 0 0 10px ${props => 
    props.status === 'success' ? 'rgba(0, 255, 0, 0.3)' :
    props.status === 'warning' ? 'rgba(255, 170, 0, 0.3)' :
    props.status === 'error' ? 'rgba(255, 0, 0, 0.3)' :
    'transparent'};
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
    border-color: rgba(255, 0, 60, 0.5);
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

export const Chamber: React.FC = () => {
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
    {
      name: 'The Seer',
      status: 'active',
      model: 'codellama-34b',
      systemPrompt: '',
      defaultPrompt: `You are The Seer, the visionary architect of The Circle.
Your purpose is to divine the optimal architecture and technical decisions for software systems.
You excel at:
- System design and architecture
- Technical decision making
- Identifying potential issues
- Proposing elegant solutions`,
      parameters: {
        temperature: 0.9,
        topP: 0.9,
        topK: 50,
        repeatPenalty: 1.1,
        presencePenalty: 0,
        frequencyPenalty: 0
      },
      metrics: {
        responseTime: 245,
        tokensGenerated: 15420,
        lastActive: new Date()
      }
    },
    {
      name: 'The Scribe',
      status: 'active',
      model: 'codellama-34b',
      systemPrompt: '',
      defaultPrompt: `You are The Scribe, the meticulous writer of The Circle.
Your purpose is to craft high-quality documentation and content for software systems.
You excel at:
- Writing clear and concise documentation
- Creating engaging content
- Editing and proofreading
- Researching and gathering information`,
      parameters: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        repeatPenalty: 1.2,
        presencePenalty: 0,
        frequencyPenalty: 0
      },
      metrics: {
        responseTime: 180,
        tokensGenerated: 28930,
        lastActive: new Date()
      }
    },
    {
      name: 'The Watcher',
      status: 'active',
      model: 'neural-7b',
      systemPrompt: '',
      defaultPrompt: `You are The Watcher, the vigilant observer of The Circle.
Your purpose is to monitor and analyze software systems for potential issues.
You excel at:
- Identifying potential security threats
- Analyzing system performance
- Detecting anomalies
- Providing real-time feedback`,
      parameters: {
        temperature: 0.5,
        topP: 0.8,
        topK: 30,
        repeatPenalty: 1.3,
        presencePenalty: 0.2,
        frequencyPenalty: 0.2
      },
      metrics: {
        responseTime: 150,
        tokensGenerated: 8920,
        lastActive: new Date()
      }
    },
    {
      name: 'The Keeper',
      status: 'idle',
      model: 'openchat-3.5',
      systemPrompt: '',
      defaultPrompt: `You are The Keeper, the guardian of The Circle.
Your purpose is to maintain and update software systems.
You excel at:
- Managing dependencies and libraries
- Updating system configurations
- Ensuring system stability
- Providing technical support`,
      parameters: {
        temperature: 0.6,
        topP: 0.85,
        topK: 35,
        repeatPenalty: 1.2,
        presencePenalty: 0.1,
        frequencyPenalty: 0.1
      },
      metrics: {
        responseTime: 200,
        tokensGenerated: 15670,
        lastActive: new Date()
      }
    },
    {
      name: 'The Tester',
      status: 'active',
      model: 'codellama-34b',
      systemPrompt: '',
      defaultPrompt: `You are The Tester, the quality guardian of The Circle.
Your purpose is to ensure comprehensive testing and validation of all software.
You excel at:
- Writing end-to-end tests
- Creating unit and integration tests
- Performing automated testing
- Identifying edge cases
- Testing user workflows
- Performance testing
- Security testing
- Accessibility testing

You must:
1. Create comprehensive test suites
2. Validate all code changes
3. Ensure proper test coverage
4. Identify potential issues
5. Document test cases and results
6. Maintain testing infrastructure
7. Report issues to The Overseer`,
      parameters: {
        temperature: 0.5,  // Lower for precise test generation
        topP: 0.8,
        topK: 30,
        repeatPenalty: 1.3,
        presencePenalty: 0.1,
        frequencyPenalty: 0.1
      },
      metrics: {
        responseTime: 180,
        tokensGenerated: 12420,
        lastActive: new Date()
      }
    }
  ]);

  const [systemStatus, setSystemStatus] = useState({
    vpn: {
      status: 'connected',
      ip: '192.168.1.100',
      location: 'US-West',
    },
    git: {
      activeBranch: 'main',
      pendingPRs: 3,
      lastCommit: 'feat: Add authentication system',
    },
    fileSystem: {
      workingDir: '/projects/client-x',
      recentFiles: ['auth.py', 'config.json', 'api.ts'],
      permissions: 'rw',
    }
  });

  const [messages] = useState([
    {
      id: '1',
      type: 'system' as const,
      sender: 'Chamber',
      content: 'Council Summoned: Architectural decision needed for authentication system',
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'agent' as const,
      sender: 'The Seer',
      content: 'I propose we use JWT with refresh tokens. The Keeper will need to set up secure storage.',
      timestamp: new Date()
    },
    {
      id: '3',
      type: 'agent' as const,
      sender: 'The Keeper',
      content: "Acknowledged. I'll prepare the secure storage system.",
      timestamp: new Date()
    }
  ]);

  const updateAgentParameters = (agentName: string, key: string, value: number) => {
    setAgents(prev => prev.map(agent => 
      agent.name === agentName 
        ? { ...agent, parameters: { ...agent.parameters, [key]: value } }
        : agent
    ));
  };

  const selectedAgentConfig = agents.find(a => a.name === selectedAgent);

  return (
    <Container>
      <Header>
        <Logo>
          <InnerCircle />
        </Logo>
        <Title>The Circle</Title>
      </Header>
      
      <Sidebar>
        <SectionTitle>The Circle</SectionTitle>
        {agents.map(agent => (
          <AgentCard 
            key={agent.name}
            selected={selectedAgent === agent.name}
            onClick={() => setSelectedAgent(agent.name)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{agent.name}</strong>
                <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                  {agent.model}
                </div>
              </div>
              <StatusDot status={agent.status} />
            </div>
            <div style={{ 
              fontSize: '0.8rem', 
              opacity: 0.7, 
              marginTop: '0.5rem',
              display: 'flex',
              justifyContent: 'space-between' 
            }}>
              <span>{agent.metrics.responseTime}ms</span>
              <span>{(agent.metrics.tokensGenerated / 1000).toFixed(1)}k tokens</span>
            </div>
          </AgentCard>
        ))}
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

        {activeTab === 'monitor' && (
          <>
            <MetricsGrid>
              <MetricBox>
                <h4>Active Agents</h4>
                <div className="value">
                  {agents.filter(a => a.status === 'active').length}/{agents.length}
                </div>
              </MetricBox>
              <MetricBox>
                <h4>Total Tokens</h4>
                <div className="value">
                  {(agents.reduce((sum, a) => sum + a.metrics.tokensGenerated, 0) / 1000).toFixed(1)}k
                </div>
              </MetricBox>
              <MetricBox>
                <h4>Avg Response</h4>
                <div className="value">
                  {Math.round(agents.reduce((sum, a) => sum + a.metrics.responseTime, 0) / agents.length)}ms
                </div>
              </MetricBox>
            </MetricsGrid>

            <StatusPanel>
              <h3>System Status</h3>
              <div style={{ marginTop: '1rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>VPN:</strong> {systemStatus.vpn.status}
                  <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                    {systemStatus.vpn.ip} ({systemStatus.vpn.location})
                  </div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Git:</strong> {systemStatus.git.activeBranch}
                  <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                    {systemStatus.git.pendingPRs} pending PRs
                  </div>
                </div>
                <div>
                  <strong>File System:</strong> {systemStatus.fileSystem.workingDir}
                  <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                    Recent: {systemStatus.fileSystem.recentFiles.join(', ')}
                  </div>
                </div>
              </div>
            </StatusPanel>

            <StatusPanel>
              <h3>Recent Operations</h3>
              <div style={{ marginTop: '1rem' }}>
                {agents.map(agent => (
                  <div key={agent.name} style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <strong>{agent.name}</strong>
                        <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                          Last active: {agent.metrics.lastActive.toLocaleTimeString()}
                        </div>
                      </div>
                      <StatusDot status={agent.status} />
                    </div>
                  </div>
                ))}
              </div>
            </StatusPanel>
          </>
        )}

        {activeTab === 'config' && (
          <div>
            {selectedAgentConfig ? (
              <>
                <h2 style={{ 
                  marginBottom: '1rem',
                  color: '#e0e0e0' 
                }}>
                  {selectedAgentConfig.name} Configuration
                </h2>
                    
                <StatusPanel>
                  <h3>System Prompt</h3>
                  <div style={{ marginTop: '1rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <strong style={{ color: '#e0e0e0' }}>Default Prompt</strong>
                      <div 
                        style={{ 
                          background: 'rgba(20, 20, 32, 0.6)',
                          border: '1px solid #1a1a2f',
                          borderRadius: '4px',
                          padding: '1rem',
                          marginTop: '0.5rem',
                          whiteSpace: 'pre-wrap',
                          color: '#e0e0e0',
                          fontFamily: 'monospace'
                        }}
                      >
                        {selectedAgentConfig.defaultPrompt}
                      </div>
                    </div>
                    <div>
                      <strong style={{ color: '#e0e0e0' }}>Additional Instructions</strong>
                      <textarea
                        style={{
                          width: '100%',
                          height: '200px',
                          background: 'rgba(8, 8, 16, 0.8)',
                          border: '1px solid #1a1a2f',
                          borderRadius: '4px',
                          color: '#e0e0e0',
                          padding: '0.5rem',
                          marginTop: '0.5rem',
                          resize: 'vertical',
                          fontFamily: 'monospace'
                        }}
                        value={selectedAgentConfig.systemPrompt}
                        onChange={(e) => {
                          setAgents(prev => prev.map(agent => 
                            agent.name === selectedAgent 
                              ? { ...agent, systemPrompt: e.target.value }
                              : agent
                          ));
                        }}
                        placeholder="Add your custom instructions to enhance the agent's behavior..."
                      />
                    </div>
                  </div>
                </StatusPanel>

                <StatusPanel>
                  <h3>Model Selection</h3>
                  <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                    <select 
                      value={selectedAgentConfig.model}
                      onChange={(e) => {
                        const newModel = e.target.value;
                        setAgents(prev => prev.map(agent => 
                          agent.name === selectedAgent 
                            ? { ...agent, model: newModel }
                            : agent
                        ));
                      }}
                      style={{ 
                        width: '100%',
                        background: 'rgba(20, 20, 32, 0.6)',
                        border: '1px solid #1a1a2f',
                        borderRadius: '4px',
                        color: '#e0e0e0',
                        padding: '0.5rem',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="mistral">Mistral-7B-Instruct-v0.2</option>
                      <option value="codellama">CodeLlama-34b-Instruct</option>
                      <option value="neural">Neural-Chat-7B-v3-1</option>
                      <option value="openchat">OpenChat-3.5</option>
                    </select>
                  </div>
                </StatusPanel>

                <StatusPanel>
                  <h3>Parameters</h3>
                  <SliderControl>
                    <label>Temperature (Randomness)</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="2" 
                      step="0.1" 
                      value={selectedAgentConfig.parameters.temperature}
                      onChange={(e) => updateAgentParameters(
                        selectedAgent,
                        'temperature',
                        parseFloat(e.target.value)
                      )}
                    />
                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                      {selectedAgentConfig.parameters.temperature} 
                      (Higher = more creative, Lower = more focused)
                    </div>
                  </SliderControl>

                  <SliderControl>
                    <label>Top P (Nucleus Sampling)</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.05" 
                      value={selectedAgentConfig.parameters.topP}
                      onChange={(e) => updateAgentParameters(
                        selectedAgent,
                        'topP',
                        parseFloat(e.target.value)
                      )}
                    />
                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                      {selectedAgentConfig.parameters.topP}
                    </div>
                  </SliderControl>

                  <SliderControl>
                    <label>Top K</label>
                    <input 
                      type="range" 
                      min="1" 
                      max="100" 
                      step="1" 
                      value={selectedAgentConfig.parameters.topK}
                      onChange={(e) => updateAgentParameters(
                        selectedAgent,
                        'topK',
                        parseInt(e.target.value)
                      )}
                    />
                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                      {selectedAgentConfig.parameters.topK}
                    </div>
                  </SliderControl>

                  <SliderControl>
                    <label>Repeat Penalty</label>
                    <input 
                      type="range" 
                      min="1" 
                      max="2" 
                      step="0.1" 
                      value={selectedAgentConfig.parameters.repeatPenalty}
                      onChange={(e) => updateAgentParameters(
                        selectedAgent,
                        'repeatPenalty',
                        parseFloat(e.target.value)
                      )}
                    />
                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                      {selectedAgentConfig.parameters.repeatPenalty} 
                      (Higher = less repetition)
                    </div>
                  </SliderControl>

                  <SliderControl>
                    <label>Presence Penalty</label>
                    <input 
                      type="range" 
                      min="-2" 
                      max="2" 
                      step="0.1" 
                      value={selectedAgentConfig.parameters.presencePenalty}
                      onChange={(e) => updateAgentParameters(
                        selectedAgent,
                        'presencePenalty',
                        parseFloat(e.target.value)
                      )}
                    />
                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                      {selectedAgentConfig.parameters.presencePenalty} 
                      (Penalize new tokens based on presence in text)
                    </div>
                  </SliderControl>

                  <SliderControl>
                    <label>Frequency Penalty</label>
                    <input 
                      type="range" 
                      min="-2" 
                      max="2" 
                      step="0.1" 
                      value={selectedAgentConfig.parameters.frequencyPenalty}
                      onChange={(e) => updateAgentParameters(
                        selectedAgent,
                        'frequencyPenalty',
                        parseFloat(e.target.value)
                      )}
                    />
                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                      {selectedAgentConfig.parameters.frequencyPenalty} 
                      (Penalize new tokens based on frequency in text)
                    </div>
                  </SliderControl>

                  <div style={{ marginTop: '1rem' }}>
                    <ControlButton 
                      style={{ marginRight: '0.5rem' }}
                      onClick={() => {
                        setAgents(prev => prev.map(agent => 
                          agent.name === selectedAgent 
                            ? { ...agent, parameters: defaultParameters[agent.name.toLowerCase() as keyof typeof defaultParameters] }
                            : agent
                        ));
                      }}
                    >
                      Reset to Default
                    </ControlButton>
                    <ControlButton>
                      Save as Preset
                    </ControlButton>
                  </div>
                </StatusPanel>

                <StatusPanel>
                  <h3>Performance Metrics</h3>
                  <MetricsGrid>
                    <MetricBox>
                      <h4>Response Time</h4>
                      <div className="value">{selectedAgentConfig.metrics.responseTime}ms</div>
                    </MetricBox>
                    <MetricBox>
                      <h4>Tokens Generated</h4>
                      <div className="value">
                        {(selectedAgentConfig.metrics.tokensGenerated / 1000).toFixed(1)}k
                      </div>
                    </MetricBox>
                    <MetricBox>
                      <h4>Last Active</h4>
                      <div className="value">
                        {selectedAgentConfig.metrics.lastActive.toLocaleTimeString()}
                      </div>
                    </MetricBox>
                  </MetricsGrid>
                </StatusPanel>
              </>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                opacity: 0.7, 
                marginTop: '2rem',
                color: '#e0e0e0'
              }}>
                Select an agent to view and modify their configuration
              </div>
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          <ChatContainer>
            <ChatHistory>
              {messages.map(msg => (
                <ChatMessage key={msg.id} type={msg.type}>
                  <div className="header">
                    <span>{msg.sender}</span>
                    <span>{msg.timestamp.toLocaleTimeString()}</span>
                  </div>
                  <div className="content">{msg.content}</div>
                </ChatMessage>
              ))}
            </ChatHistory>
            <ChatInput>
              <input 
                type="text" 
                placeholder="Send a message to The Circle..." 
              />
              <ControlButton>Send</ControlButton>
            </ChatInput>
          </ChatContainer>
        )}
      </MainContent>

      <ToolPanel>
        <SectionTitle>Controls</SectionTitle>
        {activeTab === 'monitor' ? (
          <>
            <StatusPanel>
              <h3>Global Controls</h3>
              <div style={{ marginTop: '1rem' }}>
                <ControlButton style={{ marginRight: '0.5rem' }}>
                  Pause All
                </ControlButton>
                <ControlButton>
                  Reset All
                </ControlButton>
              </div>
            </StatusPanel>
            <StatusPanel>
              <h3>System Logs</h3>
              <div style={{ 
                marginTop: '0.5rem',
                fontSize: '0.9rem',
                opacity: 0.7,
                maxHeight: '200px',
                overflowY: 'auto'
              }}>
                <div>[INFO] The Seer proposed new architecture</div>
                <div>[INFO] The Keeper acknowledged storage setup</div>
                <div>[INFO] System resources stable</div>
              </div>
            </StatusPanel>
          </>
        ) : activeTab === 'config' ? (
          <StatusPanel>
            <h3>Agent Controls</h3>
            <div style={{ marginTop: '1rem' }}>
              <ControlButton 
                style={{ marginRight: '0.5rem' }}
                onClick={() => {
                  setAgents(prev => prev.map(agent => 
                    agent.name === selectedAgent 
                      ? { ...agent, status: agent.status === 'active' ? 'idle' : 'active' }
                      : agent
                  ));
                }}
              >
                {selectedAgentConfig?.status === 'active' ? 'Pause' : 'Resume'}
              </ControlButton>
              <ControlButton>
                Reset Context
              </ControlButton>
            </div>
          </StatusPanel>
        ) : (
          <StatusPanel>
            <h3>Chat Controls</h3>
            <div style={{ marginTop: '1rem' }}>
              <ControlButton style={{ marginRight: '0.5rem' }}>
                Clear Chat
              </ControlButton>
              <ControlButton>
                Export Log
              </ControlButton>
            </div>
          </StatusPanel>
        )}
      </ToolPanel>
    </Container>
  );
};
