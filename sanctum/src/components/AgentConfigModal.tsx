import React from 'react';
import { Agent } from '@/types/agent';

interface AgentConfigModalProps {
  agent: Agent;
  isOpen: boolean;
  onClose: () => void;
}

export function AgentConfigModal({ agent, isOpen, onClose }: AgentConfigModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#13141F]/90 backdrop-blur-md rounded-lg p-6 max-w-2xl w-full mx-4 shadow-2xl border border-white/10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
            <div className="w-8 h-8 rotating-rune opacity-90" style={{ color: agent.color }}>
              {agent.rune}
            </div>
            {agent.name}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-white mb-2">System Message</h3>
            <textarea 
              className="w-full h-32 bg-black/30 text-white rounded-md p-3 text-sm"
              value={agent.systemMessage}
              readOnly
            />
          </div>

          <div>
            <h3 className="text-lg font-medium text-white mb-2">Configuration</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/30 p-3 rounded-md">
                <div className="text-sm text-gray-400">Model</div>
                <div className="text-white">{agent.model}</div>
              </div>
              <div className="bg-black/30 p-3 rounded-md">
                <div className="text-sm text-gray-400">Temperature</div>
                <div className="text-white">0.7</div>
              </div>
              <div className="bg-black/30 p-3 rounded-md">
                <div className="text-sm text-gray-400">Max Tokens</div>
                <div className="text-white">2048</div>
              </div>
              <div className="bg-black/30 p-3 rounded-md">
                <div className="text-sm text-gray-400">Status</div>
                <div className="text-white">{agent.status}</div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-white bg-gray-500/20 hover:bg-gray-500/30 rounded-md transition-colors"
            >
              Close
            </button>
            <button
              className="px-4 py-2 text-white bg-purple-500/20 hover:bg-purple-500/30 rounded-md transition-colors"
            >
              Update Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
