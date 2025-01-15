import React, { useState } from 'react';
import { Agent } from '@/types/agent';

interface AgentChatModalProps {
  agent: Agent;
  isOpen: boolean;
  onClose: () => void;
}

export function AgentChatModal({ agent, isOpen, onClose }: AgentChatModalProps) {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);

  if (!isOpen) return null;

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Add user message to chat
    setChatHistory(prev => [...prev, { role: 'user', content: message }]);
    
    // TODO: Send message to backend and get response
    // For now, simulate a response
    setTimeout(() => {
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: `[${agent.name}] I acknowledge your message and will process it according to my directives.`
      }]);
    }, 1000);

    setMessage('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#13141F]/90 backdrop-blur-md rounded-lg w-full max-w-3xl h-[80vh] mx-4 flex flex-col shadow-2xl border border-white/10">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rotating-rune opacity-90" style={{ color: agent.color }}>
              {agent.rune}
            </div>
            <h2 className="text-xl font-semibold text-white">{agent.name}</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatHistory.map((msg, i) => (
            <div 
              key={i} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-purple-500/20 text-white' 
                    : 'bg-black/30 text-white'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10">
          <div className="flex gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={`Send a message to ${agent.name}...`}
              className="flex-1 bg-black/30 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
