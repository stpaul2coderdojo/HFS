import React, { useState } from 'react';
import { 
  Bug, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Trash2, 
  Wrench, 
  Info,
  Terminal,
  Activity,
  Zap
} from 'lucide-react';
import type { 
  TrailingVirusSignature, 
  HfsFile, 
  DebianKernelConfig 
} from '../types/hfs.ts';

interface VirusLabProps {
  files: HfsFile[];
  signatures: TrailingVirusSignature[];
  kernel: DebianKernelConfig;
  onInjectVirus: (fileId: string, holeBufferId: string, signatureId: string) => void;
  onRepairHole: (fileId: string, holeBufferId: string) => void;
  onRunScan: () => void;
  isScanning: boolean;
}

export const VirusLab: React.FC<VirusLabProps> = ({
  files,
  signatures,
  kernel,
  onInjectVirus,
  onRepairHole,
  onRunScan,
  isScanning,
}) => {
  const [selectedSigId, setSelectedSigId] = useState<string>(signatures[0]?.id || '');
  const [selectedFileId, setSelectedFileId] = useState<string>(files[0]?.id || '');

  const activeSig = signatures.find((s) => s.id === selectedSigId) || signatures[0];
  const activeFile = files.find((f) => f.id === selectedFileId) || files[0];

  // Find all currently compromised or quarantined hole buffers across all files
  const quarantinedHoles: { file: HfsFile; hole: any }[] = [];
  files.forEach((f) => {
    f.holeBuffers.forEach((h) => {
      if (h.status === 'compromised' || h.status === 'quarantined') {
        quarantinedHoles.push({ file: f, hole: h });
      }
    });
  });

  return (
    <div className="space-y-6">
      {/* Educational Banner explaining Trailing Viruses & Hole Buffers */}
      <div className="rounded-xl border border-rose-900/60 bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-950 p-6 space-y-4 shadow-xl">
        <div className="flex items-center space-x-2 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider">
          <Bug className="w-4 h-4" />
          <span>Trailing Virus & Slack-Space Threat Matrix</span>
        </div>
        <h2 className="text-xl font-bold text-slate-100">
          How Trailing Viruses Infiltrate File Slack & Sparse Hole Buffers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
            <div className="text-rose-400 font-bold font-mono">1. The Slack Gap Vulnerability</div>
            <p className="text-slate-400">
              Filesystems allocate storage in 4KB sector blocks. If a file is 5,000 bytes, it occupies two 4KB blocks (8,192 bytes), leaving 3,192 bytes of invisible &ldquo;slack space&rdquo; at the tail.
            </p>
          </div>
          <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
            <div className="text-rose-400 font-bold font-mono">2. Sparse Hole Buffer Exploits</div>
            <p className="text-slate-400">
              Sparse files leave multi-megabyte regions unallocated. Advanced parasites inject stealth loaders into these unmapped memory holes, executing via hijacked pointer offsets.
            </p>
          </div>
          <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
            <div className="text-emerald-400 font-bold font-mono">3. HFS Kernel Defense</div>
            <p className="text-slate-400">
              The memory-resident Debian kernel computes cryptographic SHA-256 digests over every trailing slack buffer and packed hole, continuously cross-verifying during execution.
            </p>
          </div>
        </div>
      </div>

      {/* Main Workbench Grid: Signatures & Attack Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Known Viral Signatures */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            Trailing Viral Signature Repository
          </h3>
          <p className="text-xs text-slate-400">
            Select a polymorphic trailing viral strain to inspect its payload heuristics and test injection:
          </p>

          <div className="space-y-3">
            {signatures.map((sig) => {
              const isSelected = sig.id === selectedSigId;
              return (
                <div
                  key={sig.id}
                  onClick={() => setSelectedSigId(sig.id)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-rose-500 bg-rose-950/30'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-slate-200">{sig.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-rose-950 text-rose-400 border border-rose-800">
                      {sig.heuristicSeverity}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-slate-400 font-mono">
                    Alias: <span className="text-slate-300">{sig.alias}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    {sig.description}
                  </p>
                  <div className="mt-2 text-[10px] font-mono text-slate-500 bg-black/60 p-2 rounded truncate select-all">
                    HEX: {sig.sampleBytesHex}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Interactive Attack Injection Harness */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-5">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            Attack Injection & Kernel Trap Harness
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Target HFS File:</label>
              <select
                value={selectedFileId}
                onChange={(e) => setSelectedFileId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500"
              >
                {files.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.holeBuffers.length} hole/slack buffers)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Available Hole / Slack Buffers in Target:</label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {activeFile?.holeBuffers.map((h) => (
                  <div
                    key={h.id}
                    className="p-2 bg-slate-950 rounded border border-slate-800 text-[11px] font-mono flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-300">Block #{h.blockIndex}</div>
                      <div className="text-slate-500 text-[10px]">{h.type}</div>
                    </div>
                    <button
                      onClick={() => onInjectVirus(activeFile.id, h.id, activeSig.id)}
                      className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-slate-950 font-bold rounded text-[10px] transition-colors cursor-pointer"
                    >
                      Inject Here
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-400 font-mono">
                Kernel Mode: <span className="text-emerald-400 font-bold uppercase">{kernel.securityModuleStatus}</span>
              </div>
              <button
                onClick={onRunScan}
                disabled={isScanning}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-mono font-bold rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isScanning ? 'Scanning Kernel...' : 'Trigger Kernel Scan'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quarantined Violations Tray */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-bold text-slate-200">
              Active Kernel Quarantine & Trailing Virus Detections
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {quarantinedHoles.length} Compromised Buffers Trapped
          </span>
        </div>

        {quarantinedHoles.length === 0 ? (
          <div className="py-8 text-center text-slate-500 font-mono text-xs flex flex-col items-center justify-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            <p className="text-slate-400 font-semibold">Zero trailing virus infections active.</p>
            <p className="text-slate-500 text-[11px]">All hole buffers and trailing slack spaces match expected SHA-256 cryptographic hashes.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {quarantinedHoles.map(({ file, hole }) => (
              <div
                key={hole.id}
                className="p-4 rounded-lg border border-rose-900 bg-rose-950/30 flex flex-wrap items-center justify-between gap-4 font-mono text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-rose-400">File: {file.name}</span>
                    <span className="px-1.5 py-0.2 bg-rose-950 text-rose-300 border border-rose-800 rounded text-[10px]">
                      Block #{hole.blockIndex}
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Payload: <strong className="text-rose-300">{hole.payloadDetected?.signatureName || 'Unknown Trailing Anomaly'}</strong>
                  </div>
                  <div className="text-slate-500 text-[10px] truncate max-w-xl">
                    Expected Hash: {hole.expectedHash} | Current: {hole.currentHash}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onRepairHole(file.id, hole.id)}
                    className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Sanitize Buffer</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
