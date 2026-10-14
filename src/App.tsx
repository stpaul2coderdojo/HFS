/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { TopologyView } from './components/TopologyView.tsx';
import { HoleBufferExplorer } from './components/HoleBufferExplorer.tsx';
import { AgentConsole } from './components/AgentConsole.tsx';
import { VirusLab } from './components/VirusLab.tsx';
import { KernelDeployer } from './components/KernelDeployer.tsx';
import { AuthorshipModal } from './components/AuthorshipModal.tsx';
import { WhitePaperModal } from './components/WhitePaperModal.tsx';
import type { 
  RamDiskConfig, 
  DebianKernelConfig, 
  HfsLoopDevice, 
  AgentStep, 
  TrailingVirusSignature 
} from './types/hfs.ts';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('topology');
  const [isAuthorshipOpen, setIsAuthorshipOpen] = useState<boolean>(false);
  const [isWhitePaperOpen, setIsWhitePaperOpen] = useState<boolean>(false);
  const [ramDisk, setRamDisk] = useState<RamDiskConfig>({
    device: '/dev/ram0',
    type: 'brd',
    sizeMB: 1024,
    allocatedMB: 512,
    mountPoint: '/mnt/ramdisk',
    fsType: 'ext4',
    status: 'mounted',
    mlockEnabled: true,
    totalBlocks: 262144,
    usedBlocks: 131072,
  });

  const [kernel, setKernel] = useState<DebianKernelConfig>({
    version: '6.12.15-deb12-amd64',
    architecture: 'x86_64',
    memoryResident: true,
    bootParams: [
      'BOOT_IMAGE=/boot/vmlinuz-6.12.15-deb12-amd64',
      'root=/dev/ram0',
      'toram',
      'boot=live',
      'rd.live.ram=1',
      'hfs_guard.enforce=1',
      'quiet',
    ],
    initramfsModules: ['brd', 'loop', 'ext4', 'crypto_sha256', 'hfs_hole_guard.ko'],
    kprobeHooks: ['vfs_read', 'vfs_write', 'do_sys_openat2', 'loop_process_work'],
    securityModuleStatus: 'enforcing',
    totalKernelChecks: 1420,
    trappedViolations: 0,
    lastIntegrityCheckTime: new Date().toISOString(),
  });

  const [loopDevice, setLoopDevice] = useState<HfsLoopDevice>({
    device: '/dev/loop0',
    backingFile: '/mnt/ramdisk/hfs.img',
    sizeMB: 256,
    mountPoint: '/mnt/hfs',
    status: 'mounted',
    readOnly: false,
    files: [],
  });

  const [virusSignatures, setVirusSignatures] = useState<TrailingVirusSignature[]>([]);
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>([]);
  const [isAgentRunning, setIsAgentRunning] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [modelUsed, setModelUsed] = useState<string>('antigravity-preview-09-2026');
  const [notification, setNotification] = useState<{ message: string; type: 'info' | 'success' | 'error' | 'warning' } | null>(null);

  const showToast = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchSystemState = async () => {
    try {
      const res = await fetch('/api/system/state');
      if (res.ok) {
        const data = await res.json();
        setRamDisk(data.ramDisk);
        setKernel(data.debianKernel);
        setLoopDevice(data.loopDevice);
        setVirusSignatures(data.knownVirusSignatures);
      }
    } catch (err) {
      console.error('Failed to fetch system state:', err);
    }
  };

  useEffect(() => {
    fetchSystemState();
  }, []);

  // Run Antigravity Agent Directive
  const handleRunAgentDirective = async (directive: string) => {
    setIsAgentRunning(true);
    showToast(`Antigravity Agent processing: "${directive.substring(0, 40)}..."`, 'info');
    try {
      const res = await fetch('/api/antigravity/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ directive }),
      });
      const data = await res.json();
      if (data.success) {
        setAgentSteps(data.steps || []);
        setModelUsed(data.modelUsed || 'antigravity-preview-09-2026');
        if (data.currentState) {
          setRamDisk(data.currentState.ramDisk);
          setKernel(data.currentState.debianKernel);
          setLoopDevice(data.currentState.loopDevice);
        }
        showToast('Antigravity Agent directive completed successfully.', 'success');
      } else {
        showToast(data.error || 'Agent execution failed', 'error');
      }
    } catch (err: any) {
      showToast(`Agent error: ${err.message}`, 'error');
    } finally {
      setIsAgentRunning(false);
    }
  };

  // Re-hash hole buffers
  const handleRehashHoles = async () => {
    try {
      const res = await fetch('/api/hfs/hash-holes', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setLoopDevice((prev) => ({ ...prev, files: data.files }));
        setKernel(data.debianKernel);
        showToast('All sparse hole & tail slack buffer hashes successfully re-computed.', 'success');
      }
    } catch (err: any) {
      showToast(`Re-hash failed: ${err.message}`, 'error');
    }
  };

  // Inject trailing virus into hole buffer or slack space
  const handleInjectVirus = async (fileId: string, holeBufferId: string, signatureId: string) => {
    try {
      const res = await fetch('/api/hfs/inject-virus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId, holeBufferId, signatureId }),
      });
      const data = await res.json();
      if (data.success) {
        setLoopDevice((prev) => ({
          ...prev,
          files: prev.files.map((f) => (f.id === fileId ? data.file : f)),
        }));
        setKernel(data.debianKernel);
        showToast(data.message, 'warning');
      }
    } catch (err: any) {
      showToast(`Injection failed: ${err.message}`, 'error');
    }
  };

  // Kernel scan across all hole buffers
  const handleRunScan = async () => {
    setIsScanning(true);
    showToast('Kernel checking hole buffers against cryptographic hash tables...', 'info');
    try {
      const res = await fetch('/api/hfs/kernel-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoQuarantine: true }),
      });
      const data = await res.json();
      if (data.success) {
        setLoopDevice((prev) => ({ ...prev, files: data.files }));
        setKernel(data.debianKernel);
        if (data.quarantinedCount > 0) {
          showToast(`[ALERT] ${data.quarantinedCount} trailing virus violations quarantined by kernel!`, 'error');
        } else {
          showToast(`All ${data.cleanCount} buffers verified clean. Zero trailing virus signatures detected.`, 'success');
        }
      }
    } catch (err: any) {
      showToast(`Scan error: ${err.message}`, 'error');
    } finally {
      setIsScanning(false);
    }
  };

  // Repair / Sanitize compromised buffer
  const handleRepairHole = async (fileId: string, holeBufferId: string) => {
    try {
      const res = await fetch('/api/hfs/repair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId, holeBufferId }),
      });
      const data = await res.json();
      if (data.success) {
        setLoopDevice((prev) => ({
          ...prev,
          files: prev.files.map((f) => (f.id === fileId ? data.file : f)),
        }));
        showToast(data.message, 'success');
      }
    } catch (err: any) {
      showToast(`Repair failed: ${err.message}`, 'error');
    }
  };

  const quarantinedCount = loopDevice.files.reduce(
    (acc, f) => acc + f.holeBuffers.filter((h) => h.status === 'quarantined' || h.status === 'compromised').length,
    0
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-5 right-5 z-50 max-w-md px-4 py-3 rounded-lg shadow-2xl border text-xs font-mono transition-all animate-bounce ${
            notification.type === 'error'
              ? 'bg-rose-950/90 border-rose-700 text-rose-200'
              : notification.type === 'warning'
              ? 'bg-amber-950/90 border-amber-700 text-amber-200'
              : notification.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-700 text-emerald-200'
              : 'bg-slate-900/90 border-slate-700 text-slate-200'
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Main Header */}
      <Header
        ramDisk={ramDisk}
        kernel={kernel}
        loopDevice={loopDevice}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onQuickScan={handleRunScan}
        isScanning={isScanning}
        quarantinedCount={quarantinedCount}
        onOpenAuthorship={() => setIsAuthorshipOpen(true)}
        onOpenWhitePaper={() => setIsWhitePaperOpen(true)}
      />

      {/* Authorship Modal */}
      <AuthorshipModal
        isOpen={isAuthorshipOpen}
        onClose={() => setIsAuthorshipOpen(false)}
        onOpenWhitePaper={() => setIsWhitePaperOpen(true)}
      />

      {/* White Paper Modal */}
      <WhitePaperModal
        isOpen={isWhitePaperOpen}
        onClose={() => setIsWhitePaperOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'topology' && (
          <TopologyView
            ramDisk={ramDisk}
            kernel={kernel}
            loopDevice={loopDevice}
            onRefresh={fetchSystemState}
            onSwitchTab={setActiveTab}
          />
        )}

        {activeTab === 'hole-buffers' && (
          <HoleBufferExplorer
            files={loopDevice.files}
            virusSignatures={virusSignatures}
            onRehashHoles={handleRehashHoles}
            onInjectVirus={handleInjectVirus}
            onRepairHole={handleRepairHole}
            onRunScan={handleRunScan}
            isScanning={isScanning}
          />
        )}

        {activeTab === 'agent-console' && (
          <AgentConsole
            steps={agentSteps}
            isRunning={isAgentRunning}
            modelUsed={modelUsed}
            onRunDirective={handleRunAgentDirective}
          />
        )}

        {activeTab === 'virus-lab' && (
          <VirusLab
            files={loopDevice.files}
            signatures={virusSignatures}
            kernel={kernel}
            onInjectVirus={handleInjectVirus}
            onRepairHole={handleRepairHole}
            onRunScan={handleRunScan}
            isScanning={isScanning}
          />
        )}

        {activeTab === 'deployer' && <KernelDeployer />}
      </main>

      {/* Status & Authorship Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-3.5 text-[11px] font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-300 font-semibold">Antigravity HFS</span>
            <span className="px-1.5 py-0.2 bg-amber-950 text-amber-300 border border-amber-800 rounded text-[10px]">Release v1.0.0</span>
            <span className="text-slate-600">•</span>
            <span>Debian 6.12 (toram)</span>
            <span className="text-slate-600">•</span>
            <span>Loopback {loopDevice.device}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsWhitePaperOpen(true)}
              className="text-purple-400 hover:text-purple-300 transition-colors font-medium cursor-pointer"
            >
              Zenodo: 10.5281/zenodo.14028912
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={() => setIsAuthorshipOpen(true)}
              className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium cursor-pointer"
            >
              Author: Bheemaiah (Director, Synergy Robotics • IIT Madras Alumni)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
