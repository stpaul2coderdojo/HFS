import React, { useState } from 'react';
import { 
  Disc, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Lock, 
  Unlock, 
  RefreshCw, 
  Bug, 
  Layers, 
  FileCode,
  Wrench
} from 'lucide-react';
import type { HfsFile, HoleBuffer, TrailingVirusSignature } from '../types/hfs.ts';

interface HoleBufferExplorerProps {
  files: HfsFile[];
  virusSignatures: TrailingVirusSignature[];
  onRehashHoles: () => void;
  onInjectVirus: (fileId: string, holeBufferId: string, signatureId: string) => void;
  onRepairHole: (fileId: string, holeBufferId: string) => void;
  onRunScan: () => void;
  isScanning: boolean;
}

export const HoleBufferExplorer: React.FC<HoleBufferExplorerProps> = ({
  files,
  virusSignatures,
  onRehashHoles,
  onInjectVirus,
  onRepairHole,
  onRunScan,
  isScanning,
}) => {
  const [selectedFileId, setSelectedFileId] = useState<string>(files[0]?.id || '');
  const [selectedHoleId, setSelectedHoleId] = useState<string>(files[0]?.holeBuffers[0]?.id || '');
  const [selectedSignatureId, setSelectedSignatureId] = useState<string>(virusSignatures[0]?.id || '');

  const activeFile = files.find((f) => f.id === selectedFileId) || files[0];
  const activeHole = activeFile?.holeBuffers.find((h) => h.id === selectedHoleId) || activeFile?.holeBuffers[0];

  return (
    <div className="space-y-6">
      {/* Top Controls & Explanation */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
        <div className="space-y-1 max-w-2xl">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Disc className="w-5 h-5 text-purple-400" />
            HFS Cryptographic Hole-Buffer & Slack Space Visualizer
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Sparse files create unallocated &ldquo;holes&rdquo; where zero blocks are not written to physical storage. Normally, trailing file bytes leave unpadded slack buffers. Trailing viruses exploit this gap by attaching malicious bytes without increasing the logical file size. In HFS, the kernel enforces cryptographic hash integrity across every hole and slack buffer.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onRehashHoles}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-Compute Hashes</span>
          </button>
          <button
            onClick={onRunScan}
            disabled={isScanning}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-semibold font-mono transition-colors cursor-pointer disabled:opacity-50"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isScanning ? 'Scanning...' : 'Kernel Guard Check'}</span>
          </button>
        </div>
      </div>

      {/* File Selector Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        {files.map((file) => {
          const hasViolation = file.holeBuffers.some(
            (h) => h.status === 'compromised' || h.status === 'quarantined'
          );
          const isSelected = file.id === selectedFileId;
          return (
            <button
              key={file.id}
              onClick={() => {
                setSelectedFileId(file.id);
                setSelectedHoleId(file.holeBuffers[0]?.id || '');
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-purple-950/80 text-purple-300 border border-purple-800 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="font-semibold">{file.name}</span>
              {hasViolation ? (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              )}
            </button>
          );
        })}
      </div>

      {activeFile && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* File Block Extent Grid (Left 2 Columns) */}
          <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400" />
                  Extent & Hole Buffer Map ({activeFile.name})
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Logical Size: {(activeFile.logicalSize / (1024 * 1024)).toFixed(1)} MB | Physical Allocated: {(activeFile.physicalSize / (1024 * 1024)).toFixed(1)} MB | Merkle Root: {activeFile.merkleRootHash.substring(0, 16)}...
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center space-x-3 text-[11px] font-mono">
                <div className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-600" />
                  <span className="text-slate-400">Clean Hole</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded bg-amber-600" />
                  <span className="text-slate-400">Tail Slack</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded bg-rose-600 animate-pulse" />
                  <span className="text-rose-400">Compromised</span>
                </div>
              </div>
            </div>

            {/* Interactive Block Visualizer */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {activeFile.holeBuffers.map((hole) => {
                const isSelected = hole.id === selectedHoleId;
                const isViolation = hole.status === 'compromised' || hole.status === 'quarantined';
                
                let borderColor = 'border-slate-800';
                let bgColor = 'bg-slate-950';
                let statusBadgeColor = 'text-emerald-400 bg-emerald-950/80 border-emerald-800';

                if (hole.type === 'tail_slack') {
                  borderColor = 'border-amber-900/60';
                }

                if (isViolation) {
                  borderColor = 'border-rose-600';
                  bgColor = 'bg-rose-950/30';
                  statusBadgeColor = 'text-rose-400 bg-rose-950 border-rose-800 animate-pulse';
                } else if (isSelected) {
                  borderColor = 'border-purple-500';
                  bgColor = 'bg-purple-950/20';
                }

                return (
                  <div
                    key={hole.id}
                    onClick={() => setSelectedHoleId(hole.id)}
                    className={`rounded-lg border p-3.5 cursor-pointer transition-all hover:scale-[1.02] ${borderColor} ${bgColor} ${
                      isSelected ? 'ring-2 ring-purple-500/50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-slate-300">Block #{hole.blockIndex}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${statusBadgeColor}`}>
                        {hole.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="mt-2 text-xs font-mono space-y-1">
                      <div className="text-slate-400 text-[11px]">
                        Type: <span className={hole.type === 'tail_slack' ? 'text-amber-400' : 'text-cyan-400'}>{hole.type}</span>
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        Offset: 0x{hole.startOffset.toString(16)} - 0x{hole.endOffset.toString(16)}
                      </div>
                      <div className="text-slate-500 text-[10px] truncate">
                        Hash: {hole.currentHash.substring(0, 12)}...
                      </div>
                    </div>

                    {hole.payloadDetected && (
                      <div className="mt-2 pt-2 border-t border-rose-900/60 text-[10px] font-mono text-rose-300">
                        ⚠ Virus: {hole.payloadDetected.signatureName}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick Test Injection on this file */}
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Bug className="w-3.5 h-3.5 text-rose-400" />
                Simulate Trailing Virus Attack on Selected Hole Buffer
              </h4>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedSignatureId}
                  onChange={(e) => setSelectedSignatureId(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 rounded px-3 py-1.5 focus:outline-none focus:border-rose-500"
                >
                  {virusSignatures.map((sig) => (
                    <option key={sig.id} value={sig.id}>
                      {sig.name} ({sig.attackVector})
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    if (activeHole) {
                      onInjectVirus(activeFile.id, activeHole.id, selectedSignatureId);
                    }
                  }}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-slate-950 text-xs font-bold font-mono rounded transition-colors cursor-pointer"
                >
                  Inject Payload into #{activeHole?.blockIndex}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Hole Buffer Deep Inspector */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-emerald-400" />
                Hole Buffer Inspector
              </span>
              {activeHole && (
                <span className="text-xs font-mono text-purple-400">
                  Block #{activeHole.blockIndex}
                </span>
              )}
            </h3>

            {activeHole ? (
              <div className="space-y-4 text-xs font-mono">
                <div className="space-y-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Buffer ID:</span>
                    <span className="text-slate-200">{activeHole.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Buffer Classification:</span>
                    <span className={activeHole.type === 'tail_slack' ? 'text-amber-400 font-bold' : 'text-cyan-400 font-bold'}>
                      {activeHole.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Byte Range:</span>
                    <span className="text-slate-200">{activeHole.startOffset} - {activeHole.endOffset} ({activeHole.sizeBytes} B)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Integrity State:</span>
                    <span className={
                      activeHole.status === 'clean' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold animate-pulse'
                    }>
                      {activeHole.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Hashes Comparison */}
                <div className="space-y-2">
                  <label className="text-slate-400 font-semibold text-[11px]">Expected Baseline Hash (SHA-256):</label>
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-[11px] text-emerald-400 break-all select-all">
                    {activeHole.expectedHash}
                  </div>

                  <label className="text-slate-400 font-semibold text-[11px]">Current Computed Memory Hash:</label>
                  <div className={`p-2.5 rounded border text-[11px] break-all select-all ${
                    activeHole.currentHash === activeHole.expectedHash
                      ? 'bg-slate-950 border-slate-800 text-emerald-400'
                      : 'bg-rose-950/60 border-rose-800 text-rose-300'
                  }`}>
                    {activeHole.currentHash}
                  </div>
                </div>

                {/* Compromised Alert Box if any */}
                {activeHole.payloadDetected && (
                  <div className="p-3 bg-rose-950/50 border border-rose-800 rounded-lg space-y-2">
                    <div className="flex items-center space-x-1.5 text-rose-300 font-bold text-xs">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>Trailing Virus Detected!</span>
                    </div>
                    <div className="text-[11px] text-rose-200">
                      <strong>Payload:</strong> {activeHole.payloadDetected.signatureName}
                    </div>
                    <div className="text-[10px] text-slate-300 bg-black/60 p-2 rounded break-all">
                      <code>{activeHole.payloadDetected.bytesHex}</code>
                    </div>
                    <button
                      onClick={() => onRepairHole(activeFile.id, activeHole.id)}
                      className="w-full mt-2 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold rounded flex items-center justify-center space-x-1.5 cursor-pointer transition-colors"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Sanitize & Zero-Flush Buffer</span>
                    </button>
                  </div>
                )}

                {activeHole.status === 'clean' && (
                  <div className="p-3 bg-emerald-950/30 border border-emerald-900/50 rounded-lg flex items-center space-x-2 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-[11px]">Cryptographic integrity confirmed. No trailing payload attached.</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500">Select a hole buffer to inspect its hash digest.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
