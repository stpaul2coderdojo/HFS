import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  HardDrive, 
  Disc, 
  Terminal, 
  AlertTriangle, 
  Sparkles,
  Layers,
  FileCode,
  Bug
} from 'lucide-react';
import type { RamDiskConfig, DebianKernelConfig, HfsLoopDevice } from '../types/hfs.ts';

interface HeaderProps {
  ramDisk: RamDiskConfig;
  kernel: DebianKernelConfig;
  loopDevice: HfsLoopDevice;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onQuickScan: () => void;
  isScanning: boolean;
  quarantinedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  ramDisk,
  kernel,
  loopDevice,
  activeTab,
  setActiveTab,
  onQuickScan,
  isScanning,
  quarantinedCount,
}) => {
  const tabs = [
    { id: 'topology', label: 'Architecture Topology', icon: Layers },
    { id: 'hole-buffers', label: 'HFS Hole Buffers', icon: Disc },
    { id: 'agent-console', label: 'Antigravity Agent', icon: Sparkles },
    { id: 'virus-lab', label: 'Trailing Virus Lab', icon: Bug, badge: quarantinedCount > 0 ? quarantinedCount : undefined },
    { id: 'deployer', label: 'Kernel C & Scripts', icon: FileCode },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50">
      {/* Top Bar with System Identity */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-semibold">
                Antigravity Agentic OS
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono uppercase bg-cyan-950/80 text-cyan-300 border border-cyan-800 rounded">
                Linux {kernel.version.split('-')[0]}
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-800 rounded">
                toram
              </span>
            </div>
            <h1 className="text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2">
              Memory-Resident Debian Kernel & Loopback HFS
            </h1>
          </div>
        </div>

        {/* Live Diagnostics Badges */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono">
            <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">RAM Disk:</span>
            <span className="text-cyan-300 font-semibold">{ramDisk.device} ({ramDisk.sizeMB}MB)</span>
          </div>

          <div className="flex items-center space-x-2 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono">
            <Disc className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-slate-400">HFS Loop:</span>
            <span className="text-purple-300 font-semibold">{loopDevice.device} ({loopDevice.sizeMB}MB)</span>
          </div>

          <div className="flex items-center space-x-2 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Guard:</span>
            <span className="text-emerald-400 font-semibold uppercase">{kernel.securityModuleStatus}</span>
          </div>

          {quarantinedCount > 0 && (
            <div className="flex items-center space-x-1.5 bg-rose-950/80 px-3 py-1.5 rounded-lg border border-rose-800 text-xs font-mono text-rose-300 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>{quarantinedCount} Quarantined</span>
            </div>
          )}

          <button
            onClick={onQuickScan}
            disabled={isScanning}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-semibold font-mono transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isScanning ? 'Scanning...' : 'Verify Kernel HFS'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/60 flex space-x-1 overflow-x-auto scrollbar-none py-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-medium rounded-md transition-colors relative whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-slate-800 text-emerald-300 shadow-sm border border-slate-700/80'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="ml-1.5 px-1.5 py-0.2 bg-rose-600 text-white text-[10px] rounded-full font-mono">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
