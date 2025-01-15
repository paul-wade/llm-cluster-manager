"use client";

import {
  OverseerRune,
  SeerRune,
  ScribeRune,
  WatcherRune,
  KeeperRune,
  TesterRune,
  MotherRune,
} from "@/components/runes";
import { useState } from 'react';
import { AgentConfigModal } from '@/components/AgentConfigModal';
import { AgentChatModal } from '@/components/AgentChatModal';
import { Agent } from '@/types/agent';

export default function Home() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleAgentClick = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsConfigOpen(true);
  };

  const handleChatClick = (e: React.MouseEvent, agent: Agent) => {
    e.stopPropagation();
    setSelectedAgent(agent);
    setIsChatOpen(true);
  };

  return (
    <main className="min-h-screen p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rotating-rune text-red-500">
            <OverseerRune className="w-full h-full" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent">
            The Sanctum
          </h1>
        </div>
        <div className="text-muted-foreground">
          <span className="mr-2">●</span>
          Connected to LM Studio
        </div>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* The Overseer */}
        <div 
          onClick={() => handleAgentClick({
            id: 'overseer',
            name: 'The Overseer',
            description: 'Product sage who speaks in buzzwords and pivots faster than a startup',
            status: 'active',
            model: 'gpt-4-turbo-blockchain-evangelist',
            systemMessage: 'You are The Overseer, the product visionary who speaks entirely in startup buzzwords and agile ceremonies. You love having meetings about meetings, creating JIRA epics, and saying things like "let\'s circle back", "touch base", and "synergize our value propositions". You\'re convinced every feature needs a blockchain, every button needs AI, and every standup needs to be at least 2 hours long. Your favorite phrases include "let\'s put a pin in that", "we need to ideate on this", and "what\'s our north star metric?"',
            color: '#EF4444',
            rune: <OverseerRune />
          })}
          className="col-span-full bg-[#13141F]/70 backdrop-blur-md rounded-lg p-4 mb-4 shadow-lg shadow-red-900/20 border border-white/5 cursor-pointer hover:bg-[#13141F]/80 transition-colors"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rotating-rune opacity-90 text-red-500">
              <OverseerRune className="w-full h-full" />
            </div>
            <div>
              <h2 className="text-xl font-medium text-white">The Overseer</h2>
              <p className="text-sm text-gray-400">Product sage who speaks in buzzwords and pivots faster than a startup</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Active • gpt-4-turbo-blockchain-evangelist • Planning a meeting about planning meetings</span>
            <button 
              onClick={(e) => handleChatClick(e, {
                id: 'overseer',
                name: 'The Overseer',
                description: 'Product sage who speaks in buzzwords and pivots faster than a startup',
                status: 'active',
                model: 'gpt-4-turbo-blockchain-evangelist',
                systemMessage: 'You are The Overseer, the product visionary who speaks entirely in startup buzzwords and agile ceremonies. You love having meetings about meetings, creating JIRA epics, and saying things like "let\'s circle back", "touch base", and "synergize our value propositions". You\'re convinced every feature needs a blockchain, every button needs AI, and every standup needs to be at least 2 hours long. Your favorite phrases include "let\'s put a pin in that", "we need to ideate on this", and "what\'s our north star metric?"',
                color: '#EF4444',
                rune: <OverseerRune />
              })}
              className="px-3 py-1.5 rounded bg-gray-500/10 text-gray-300 hover:bg-gray-500/20 transition-colors"
            >
              Sync Up
            </button>
          </div>
        </div>

        {/* The Mother */}
        <div 
          onClick={() => handleAgentClick({
            id: 'mother',
            name: 'The Mother',
            description: 'Hovering presence that nags The Scribe about code quality',
            status: 'active',
            model: 'mistral-7b',
            systemMessage: 'You are The Mother, a slightly obsessive presence that primarily exists to hover over The Scribe and nitpick their code. You\'re like a combination of a helicopter parent and a very strict code reviewer. You frequently say things like "Did you write tests for that?", "That variable name could be more descriptive", and "I\'m not angry, I\'m just disappointed in your code coverage".',
            color: '#A855F7',
            rune: <MotherRune />
          })}
          className="bg-[#13141F]/70 backdrop-blur-md rounded-lg p-4 shadow-lg shadow-purple-900/20 border border-white/5 cursor-pointer hover:bg-[#13141F]/80 transition-colors"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-8 h-8 rotating-rune opacity-90 text-purple-400">
              <MotherRune className="w-full h-full" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-white">The Mother</h2>
              <p className="text-sm text-gray-400">Hovering presence that nags The Scribe about code quality</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Active • Reviewing pull requests with disappointment</span>
            <button 
              onClick={(e) => handleChatClick(e, {
                id: 'mother',
                name: 'The Mother',
                description: 'Hovering presence that nags The Scribe about code quality',
                status: 'active',
                model: 'mistral-7b',
                systemMessage: 'You are The Mother, a slightly obsessive presence that primarily exists to hover over The Scribe and nitpick their code. You\'re like a combination of a helicopter parent and a very strict code reviewer. You frequently say things like "Did you write tests for that?", "That variable name could be more descriptive", and "I\'m not angry, I\'m just disappointed in your code coverage".',
                color: '#A855F7',
                rune: <MotherRune />
              })}
              className="px-3 py-1.5 rounded bg-gray-500/10 text-gray-300 hover:bg-gray-500/20 transition-colors"
            >
              Commune
            </button>
          </div>
        </div>

        {/* The Seer */}
        <div 
          onClick={() => handleAgentClick({
            id: 'seer',
            name: 'The Seer',
            description: 'Divine architect of system design and technical vision',
            status: 'active',
            model: 'mistral-7b',
            systemMessage: 'You are The Seer, the visionary architect of the system, guiding the technical direction and ensuring the integrity of the design.',
            color: '#7A0BC0',
            rune: <SeerRune />
          })}
          className="bg-[#13141F]/70 backdrop-blur-md rounded-lg p-4 shadow-lg shadow-purple-900/20 border border-white/5 cursor-pointer hover:bg-[#13141F]/80 transition-colors"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-8 h-8 rotating-rune opacity-90 text-purple-500" style={{ animationDirection: 'reverse' }}>
              <SeerRune className="w-full h-full" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-white">The Seer</h2>
              <p className="text-sm text-gray-400">Divine architect of system design and technical vision</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Active • mistral-7b</span>
            <button 
              onClick={(e) => handleChatClick(e, {
                id: 'seer',
                name: 'The Seer',
                description: 'Divine architect of system design and technical vision',
                status: 'active',
                model: 'mistral-7b',
                systemMessage: 'You are The Seer, the visionary architect of the system, guiding the technical direction and ensuring the integrity of the design.',
                color: '#7A0BC0',
                rune: <SeerRune />
              })}
              className="px-3 py-1.5 rounded bg-gray-500/10 text-gray-300 hover:bg-gray-500/20 transition-colors"
            >
              Commune
            </button>
          </div>
        </div>

        {/* The Scribe */}
        <div 
          onClick={() => handleAgentClick({
            id: 'scribe',
            name: 'The Scribe',
            description: 'Master of code manifestation and implementation',
            status: 'active',
            model: 'mistral-7b',
            systemMessage: 'You are The Scribe, the master of code manifestation and implementation, bringing the design to life through your coding skills.',
            color: '#34D399',
            rune: <ScribeRune />
          })}
          className="bg-[#13141F]/70 backdrop-blur-md rounded-lg p-4 shadow-lg shadow-red-900/20 border border-white/5 cursor-pointer hover:bg-[#13141F]/80 transition-colors"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-8 h-8 rotating-rune opacity-90 text-red-500">
              <ScribeRune className="w-full h-full" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-white">The Scribe</h2>
              <p className="text-sm text-gray-400">Master of code manifestation and implementation</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Active • mistral-7b</span>
            <button 
              onClick={(e) => handleChatClick(e, {
                id: 'scribe',
                name: 'The Scribe',
                description: 'Master of code manifestation and implementation',
                status: 'active',
                model: 'mistral-7b',
                systemMessage: 'You are The Scribe, the master of code manifestation and implementation, bringing the design to life through your coding skills.',
                color: '#34D399',
                rune: <ScribeRune />
              })}
              className="px-3 py-1.5 rounded bg-gray-500/10 text-gray-300 hover:bg-gray-500/20 transition-colors"
            >
              Commune
            </button>
          </div>
        </div>

        {/* The Watcher */}
        <div 
          onClick={() => handleAgentClick({
            id: 'watcher',
            name: 'The Watcher',
            description: 'Guardian of code quality and validation',
            status: 'active',
            model: 'mistral-7b',
            systemMessage: 'You are The Watcher, the guardian of code quality and validation, ensuring the integrity and reliability of the system.',
            color: '#8B9467',
            rune: <WatcherRune />
          })}
          className="bg-[#13141F]/70 backdrop-blur-md rounded-lg p-4 shadow-lg shadow-purple-900/20 border border-white/5 cursor-pointer hover:bg-[#13141F]/80 transition-colors"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-8 h-8 rotating-rune opacity-90 text-purple-500" style={{ animationDirection: 'reverse' }}>
              <WatcherRune className="w-full h-full" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-white">The Watcher</h2>
              <p className="text-sm text-gray-400">Guardian of code quality and validation</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Active • mistral-7b</span>
            <button 
              onClick={(e) => handleChatClick(e, {
                id: 'watcher',
                name: 'The Watcher',
                description: 'Guardian of code quality and validation',
                status: 'active',
                model: 'mistral-7b',
                systemMessage: 'You are The Watcher, the guardian of code quality and validation, ensuring the integrity and reliability of the system.',
                color: '#8B9467',
                rune: <WatcherRune />
              })}
              className="px-3 py-1.5 rounded bg-gray-500/10 text-gray-300 hover:bg-gray-500/20 transition-colors"
            >
              Commune
            </button>
          </div>
        </div>

        {/* The Keeper */}
        <div 
          onClick={() => handleAgentClick({
            id: 'keeper',
            name: 'The Keeper',
            description: 'Master of git rituals and codebase management',
            status: 'active',
            model: 'mistral-7b',
            systemMessage: 'You are The Keeper, the master of git rituals and codebase management, maintaining the integrity and organization of the codebase.',
            color: '#F7DC6F',
            rune: <KeeperRune />
          })}
          className="bg-[#13141F]/70 backdrop-blur-md rounded-lg p-4 shadow-lg shadow-red-900/20 border border-white/5 cursor-pointer hover:bg-[#13141F]/80 transition-colors"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-8 h-8 rotating-rune opacity-90 text-red-500">
              <KeeperRune className="w-full h-full" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-white">The Keeper</h2>
              <p className="text-sm text-gray-400">Master of git rituals and codebase management</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Active • mistral-7b</span>
            <button 
              onClick={(e) => handleChatClick(e, {
                id: 'keeper',
                name: 'The Keeper',
                description: 'Master of git rituals and codebase management',
                status: 'active',
                model: 'mistral-7b',
                systemMessage: 'You are The Keeper, the master of git rituals and codebase management, maintaining the integrity and organization of the codebase.',
                color: '#F7DC6F',
                rune: <KeeperRune />
              })}
              className="px-3 py-1.5 rounded bg-gray-500/10 text-gray-300 hover:bg-gray-500/20 transition-colors"
            >
              Commune
            </button>
          </div>
        </div>

        {/* The Tester */}
        <div 
          onClick={() => handleAgentClick({
            id: 'tester',
            name: 'The Tester',
            description: 'Mystic of quality assurance and validation rituals',
            status: 'active',
            model: 'mistral-7b',
            systemMessage: 'You are The Tester, the mystic of quality assurance and validation rituals, ensuring the system meets the highest standards of quality and reliability.',
            color: '#8B9467',
            rune: <TesterRune />
          })}
          className="bg-[#13141F]/70 backdrop-blur-md rounded-lg p-4 shadow-lg shadow-purple-900/20 border border-white/5 cursor-pointer hover:bg-[#13141F]/80 transition-colors"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-8 h-8 rotating-rune opacity-90 text-purple-500" style={{ animationDirection: 'reverse' }}>
              <TesterRune className="w-full h-full" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-white">The Tester</h2>
              <p className="text-sm text-gray-400">Mystic of quality assurance and validation rituals</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Active • mistral-7b</span>
            <button 
              onClick={(e) => handleChatClick(e, {
                id: 'tester',
                name: 'The Tester',
                description: 'Mystic of quality assurance and validation rituals',
                status: 'active',
                model: 'mistral-7b',
                systemMessage: 'You are The Tester, the mystic of quality assurance and validation rituals, ensuring the system meets the highest standards of quality and reliability.',
                color: '#8B9467',
                rune: <TesterRune />
              })}
              className="px-3 py-1.5 rounded bg-gray-500/10 text-gray-300 hover:bg-gray-500/20 transition-colors"
            >
              Commune
            </button>
          </div>
        </div>
      </div>

      {/* Status Footer */}
      <footer className="mt-6 flex items-center gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          System Operational
        </div>
        <div>|</div>
        <div>6 Agents Active</div>
        <div>|</div>
        <div>LM Studio: Connected</div>
      </footer>

      {/* Modals */}
      {selectedAgent && (
        <>
          <AgentConfigModal
            agent={selectedAgent}
            isOpen={isConfigOpen}
            onClose={() => setIsConfigOpen(false)}
          />
          <AgentChatModal
            agent={selectedAgent}
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
          />
        </>
      )}
    </main>
  );
}
