import React from 'react';
import { 
  Cpu, 
  HardDrive, 
  Disc, 
  ShieldCheck, 
  Layers, 
  ArrowRight, 
  Activity, 
  FileText, 
  Key, 
  Sparkles,
  Terminal,
  RefreshCw
} from 'lucide-react';
import type { RamDiskConfig, DebianKernelConfig, HfsLoopDevice } from '../types/hfs.ts';

interface TopologyViewProps {
  ramDisk: RamDiskConfig;
  kernel: DebianKernelConfig;
  loopDevice: HfsLoopDevice;
  onRefresh: () => void;
  onSwitchTab: (tab: string) => void;
}

export const TopologyView: React.FC<TopologyViewProps> = ({
  ramDisk,
  kernel,
  loopDevice,
  onRefresh,
  onSwitchTab,
}) => {
  const totalHoleBuffers = loopDevice.files.reduce((acc, f) => acc + f.holeBuffers.length, 0);
  const quarantinedCount = loopDevice.files.reduce(
    (acc, f) => acc + f.holeBuffers.filter((h) => h.status === 'quarantined' || h.status === 'compromised').length,
    0
  );

  return (
    <div className="space-y-6">
      {/* Banner / Architectural Narrative */}
      <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-6 shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Cpu className="w-64 h-64 text-emerald-400" />
        </div>
        
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Antigravity Agent Architecture</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">
            Memory-Resident Debian Kernel with RAM Disk & Loopback HFS
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            This system runs completely in volatile memory: the Debian kernel boots with <code className="text-emerald-400 font-mono">toram</code> into a <code className="text-emerald-400 font-mono">/dev/ram0</code> RAM disk, mounting a loopback container called <strong className="text-slate-100 font-mono">HFS</strong>. Normal filesystems ignore sparse holes and unallocated sector slack space. In HFS, the kernel hashes every sparse hole buffer and tail slack block, continuously validating them against cryptographic baselines to stop <strong className="text-rose-400 font-mono">trailing viruses</strong> that attach to file ends or inject stealth code into zero-filled hole buffers.
          </p>
        </div>

        {/* Quick KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-400 font-mono">RAM Disk Memory</div>
            <div className="text-xl font-bold font-mono text-cyan-400 mt-1">{ramDisk.sizeMB} MB</div>
            <div className="text-[11px] text-slate-500 font-mono">Driver: brd (mlock locked)</div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-400 font-mono">HFS Loop Container</div>
            <div className="text-xl font-bold font-mono text-purple-400 mt-1">{loopDevice.sizeMB} MB</div>
            <div className="text-[11px] text-slate-500 font-mono">{loopDevice.device} Direct-IO</div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-400 font-mono">Protected Hole Buffers</div>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-1">{totalHoleBuffers} Blocks</div>
            <div className="text-[11px] text-slate-500 font-mono">SHA-256 Merkle root trees</div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
            <div className="text-xs text-slate-400 font-mono">Kernel Guard Checks</div>
            <div className="text-xl font-bold font-mono text-amber-400 mt-1">{kernel.totalKernelChecks}</div>
            <div className="text-[11px] text-slate-500 font-mono">
              {quarantinedCount > 0 ? (
                <span className="text-rose-400 font-semibold">{quarantinedCount} violations trapped</span>
              ) : (
                <span className="text-emerald-400">Zero violations</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Layer-by-Layer Architectural Schematic */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Live Execution Stack & Buffer Dataflow
            </h3>
            <p className="text-xs text-slate-400">
              Interactive structural map from hardware memory to sparse hole buffer cryptographic verification.
            </p>
          </div>
          <button
            onClick={onRefresh}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Poll State</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {/* Layer 1: Physical RAM */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-lg p-4 flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                  LAYER 1
                </span>
                <Cpu className="w-4 h-4 text-cyan-400" />
              </div>
              <h4 className="text-sm font-bold text-slate-200">Physical RAM</h4>
              <p className="text-xs text-slate-400">
                100% volatile execution. Zero persistent writes to disk or spindle. Page-swapping disabled.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-900 font-mono text-[11px] text-slate-400 space-y-1">
              <div>Type: LPDDR5 / ECC</div>
              <div>mlockall: <span className="text-emerald-400 font-semibold">Active</span></div>
              <div>Swap: <span className="text-slate-500">Disabled (0B)</span></div>
            </div>
          </div>

          {/* Layer 2: Kernel RAM Disk */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-lg p-4 flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                  LAYER 2
                </span>
                <HardDrive className="w-4 h-4 text-emerald-400" />
              </div>
              <h4 className="text-sm font-bold text-slate-200">RAM Disk ({ramDisk.device})</h4>
              <p className="text-xs text-slate-400">
                Linux BRD block device mapped in physical memory. Ext4 filesystem mounted with <code className="text-emerald-400">noatime</code>.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-900 font-mono text-[11px] text-slate-400 space-y-1">
              <div>Mount: <span className="text-emerald-400">{ramDisk.mountPoint}</span></div>
              <div>Size: {ramDisk.sizeMB} MB</div>
              <div>Blocks: {ramDisk.totalBlocks.toLocaleString()}</div>
            </div>
          </div>

          {/* Layer 3: Memory-Resident Debian Kernel */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-lg p-4 flex flex-col justify-between hover:border-blue-500/40 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800">
                  LAYER 3
                </span>
                <Terminal className="w-4 h-4 text-blue-400" />
              </div>
              <h4 className="text-sm font-bold text-slate-200">Debian Kernel</h4>
              <p className="text-xs text-slate-400">
                Vmlinuz 6.12 with stripped initramfs loaded into memory via <code className="text-blue-400">toram</code> boot parameter.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-900 font-mono text-[11px] text-slate-400 space-y-1">
              <div>Boot: <span className="text-blue-400">toram, boot=live</span></div>
              <div>Init: systemd / pid1 in RAM</div>
              <div>Hooks: kprobes on vfs_read</div>
            </div>
          </div>

          {/* Layer 4: Loopback HFS Container */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-lg p-4 flex flex-col justify-between hover:border-purple-500/40 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800">
                  LAYER 4
                </span>
                <Disc className="w-4 h-4 text-purple-400" />
              </div>
              <h4 className="text-sm font-bold text-slate-200">Loopback HFS</h4>
              <p className="text-xs text-slate-400">
                Single sparse file <code className="text-purple-400">hfs.img</code> attached to <code className="text-purple-400">{loopDevice.device}</code> with Direct-IO.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-900 font-mono text-[11px] text-slate-400 space-y-1">
              <div>Target: <span className="text-purple-400">{loopDevice.mountPoint}</span></div>
              <div>Sparse Size: {loopDevice.sizeMB} MB</div>
              <div>Status: {loopDevice.status}</div>
            </div>
          </div>

          {/* Layer 5: Cryptographic Hole Guard */}
          <div className="bg-slate-950/90 border border-emerald-900/60 rounded-lg p-4 flex flex-col justify-between hover:border-emerald-500 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                  LAYER 5
                </span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <h4 className="text-sm font-bold text-slate-200">Hole Hash Guard</h4>
              <p className="text-xs text-slate-400">
                Cryptographically hashes sparse holes & tail slack buffers. Traps and quarantines trailing viruses.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-900 font-mono text-[11px] text-slate-400 space-y-1">
              <div>Crypto: <span className="text-emerald-400">SHA-256 Merkle</span></div>
              <div>Slack check: Enforced</div>
              <div>Action: Freeze & Scrub</div>
            </div>
          </div>
        </div>

        {/* Action Shortcuts */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Kernel Security Module: <strong className="text-emerald-400 uppercase font-mono">hfs_hole_guard.ko</strong> is actively intercepting file system read calls.</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onSwitchTab('hole-buffers')}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <span>Inspect Hole Buffers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onSwitchTab('virus-lab')}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-rose-300 bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/80 rounded-lg transition-colors cursor-pointer"
            >
              <span>Simulate Trailing Virus</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Linux Kernel Parameters & Runtime Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              Active Linux Boot Parameters (/proc/cmdline)
            </h3>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
              Live In-Memory
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 space-y-1 overflow-x-auto">
            {kernel.bootParams.map((param, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <span className="text-slate-600 select-none">{idx + 1}.</span>
                <span className={param.includes('toram') || param.includes('hfs_guard') ? 'text-emerald-400 font-semibold' : 'text-slate-300'}>
                  {param}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400">
            The <code className="text-emerald-400 font-mono">toram</code> flag directs Debian live-boot to copy the full squashfs image into RAM disk <code className="text-emerald-400 font-mono">/dev/ram0</code> before mounting root.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Memory-Resident Kernel eBPF & Kprobe Hooks
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              Attached & Active
            </span>
          </div>

          <div className="space-y-2">
            {kernel.kprobeHooks.map((hook, idx) => (
              <div key={idx} className="flex items-center justify-between bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-xs font-mono">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-slate-200">{hook}</span>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  Slack/Hole Hash Validator
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400">
            When user space or daemon processes request reads on file extents, the kprobe checks if the target buffer falls into a hole or trailing slack offset and validates its SHA-256 digest against the kernel registry.
          </p>
        </div>
      </div>
    </div>
  );
};
