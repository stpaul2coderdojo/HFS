import React, { useState } from 'react';
import { 
  Sparkles, 
  Terminal, 
  Play, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  ChevronRight, 
  Cpu, 
  ShieldCheck, 
  Layers,
  Code2
} from 'lucide-react';
import type { AgentStep } from '../types/hfs.ts';

interface AgentConsoleProps {
  steps: AgentStep[];
  isRunning: boolean;
  modelUsed: string;
  onRunDirective: (directive: string) => void;
}

const PRESET_DIRECTIVES = [
  'Deploy memory-resident Debian kernel, mount loop HFS, and compute hole-buffer hashes',
  'Audit all tail slack buffers and unallocated sparse extents for trailing polymorphic viruses',
  'Reconfigure Linux BRD RAM disk with mlockall and attach kprobe hooks on vfs_read',
  'Simulate and trap a stealth cave-diver virus attempting injection into sparse hole #2',
  'Export verified cryptographic Merkle root tree for memory-resident HFS loop image',
];

export const AgentConsole: React.FC<AgentConsoleProps> = ({
  steps,
  isRunning,
  modelUsed,
  onRunDirective,
}) => {
  const [directiveInput, setDirectiveInput] = useState<string>(PRESET_DIRECTIVES[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directiveInput.trim() || isRunning) return;
    onRunDirective(directiveInput.trim());
  };

  return (
    <div className="space-y-6">
      {/* Directive Control Header */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Antigravity Agent Mission Control
              </h2>
              <p className="text-xs text-slate-400">
                Managed agent orchestrating Linux kernel memory residency, RAM disk allocation, and HFS hole-buffer security.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 font-mono text-xs">
            <span className="text-slate-400">Engine:</span>
            <span className="px-2.5 py-1 bg-emerald-950/80 text-emerald-300 border border-emerald-800 rounded font-semibold">
              {modelUsed}
            </span>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={directiveInput}
              onChange={(e) => setDirectiveInput(e.target.value)}
              placeholder="Enter system directive for Antigravity agent..."
              disabled={isRunning}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-4 py-3 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 pr-28"
            />
            <button
              type="submit"
              disabled={isRunning || !directiveInput.trim()}
              className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs font-mono rounded flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunning ? 'Executing...' : 'Run Agent'}</span>
            </button>
          </div>

          {/* Quick Preset Directives */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-slate-500 font-mono">Quick Directives:</span>
            {PRESET_DIRECTIVES.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setDirectiveInput(preset)}
                className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors cursor-pointer truncate max-w-xs"
                title={preset}
              >
                {preset}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Proof of Work Timeline */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            Agent Execution Trace & Proof-of-Work Timeline
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {steps.length} Steps Recorded
          </span>
        </div>

        {steps.length === 0 ? (
          <div className="py-12 text-center space-y-2 text-slate-500 font-mono text-xs">
            <Cpu className="w-8 h-8 mx-auto text-slate-600" />
            <p>No agent execution trace recorded yet. Run a directive above to begin.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {steps.map((step, idx) => {
              const isCommand = step.type === 'command';
              const isThought = step.type === 'thought';
              const isVerification = step.type === 'verification';
              const isOutput = step.type === 'output';

              let badgeColor = 'text-blue-400 bg-blue-950/80 border-blue-800';
              let Icon = Terminal;

              if (isThought) {
                badgeColor = 'text-purple-400 bg-purple-950/80 border-purple-800';
                Icon = Sparkles;
              } else if (isVerification) {
                badgeColor = 'text-emerald-400 bg-emerald-950/80 border-emerald-800';
                Icon = ShieldCheck;
              } else if (isOutput) {
                badgeColor = 'text-cyan-400 bg-cyan-950/80 border-cyan-800';
                Icon = Code2;
              }

              return (
                <div
                  key={step.id || idx}
                  className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-4 space-y-2.5 hover:border-slate-700 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1 rounded border ${badgeColor}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-slate-200 font-mono">
                        {step.title}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(step.timestamp).toLocaleTimeString()}</span>
                      <span className={`px-2 py-0.5 rounded border uppercase font-semibold ${badgeColor}`}>
                        {step.type}
                      </span>
                    </div>
                  </div>

                  {/* Shell Command Block if present */}
                  {step.commandExecuted && (
                    <div className="bg-black/80 rounded p-2.5 border border-slate-800 font-mono text-xs text-emerald-300 space-y-1">
                      <div className="text-slate-500 text-[10px] select-none flex items-center justify-between">
                        <span># Executing bash in memory sandbox:</span>
                        {step.exitCode !== undefined && (
                          <span className="text-emerald-400">Exit Code: {step.exitCode}</span>
                        )}
                      </div>
                      <div className="text-emerald-400 select-all">$ {step.commandExecuted}</div>
                    </div>
                  )}

                  {/* Step Description / Content */}
                  <div className="text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
                    {step.content}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
