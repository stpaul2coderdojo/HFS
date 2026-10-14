import React from 'react';
import { User, Mail, GraduationCap, Building2, Shield, FileText, X, ExternalLink, BookOpen, Award } from 'lucide-react';

interface AuthorshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWhitePaper?: () => void;
}

export const AuthorshipModal: React.FC<AuthorshipModalProps> = ({ 
  isOpen, 
  onClose,
  onOpenWhitePaper 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with decorative badge */}
        <div className="relative p-6 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/60 border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-mono text-xl font-bold shadow-inner">
              B
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-emerald-950 text-emerald-300 border border-emerald-800 rounded font-semibold">
                  Principal Architect
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-purple-950 text-purple-300 border border-purple-800 rounded font-semibold">
                  Director, Synergy Robotics
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-cyan-950 text-cyan-300 border border-cyan-800 rounded">
                  IITM Alumni
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-amber-950 text-amber-300 border border-amber-800 rounded font-semibold">
                  v1.0.0
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-100 tracking-tight mt-1.5">
                Bheemaiah
              </h2>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-xs font-mono">
          {/* Key Credentials Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Affiliation 1: Synergy Robotics */}
            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center space-x-2 text-slate-400">
                <Building2 className="w-4 h-4 text-purple-400" />
                <span className="font-semibold text-slate-300">Corporate Affiliation & Role</span>
              </div>
              <div className="text-purple-300 font-bold text-sm">
                Director, Synergy Robotics
              </div>
              <div className="text-[11px] text-slate-500">Autonomous Systems & Robotics Leadership</div>
            </div>

            {/* Affiliation 2: IIT Madras */}
            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center space-x-2 text-slate-400">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-slate-300">Academic Alma Mater</span>
              </div>
              <div className="text-slate-200 font-medium">
                Indian Institute of Technology Madras (IITM)
              </div>
              <div className="text-[11px] text-slate-500">Alumni Network</div>
            </div>
          </div>

          {/* Contact & Zenodo DOI Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center space-x-2 text-slate-400">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold text-slate-300">Contact & Correspondence</span>
              </div>
              <div className="text-cyan-300 font-medium select-all">
                bheemaiah@alumni.iitm.ac.in
              </div>
              <div className="text-[11px] text-slate-500">Verified Alumni Identity</div>
            </div>

            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center space-x-2 text-slate-400">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-slate-300">Zenodo Archive & DOI</span>
              </div>
              <a
                href="https://doi.org/10.5281/zenodo.14028912"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 font-bold flex items-center space-x-1"
              >
                <span>10.5281/zenodo.14028912</span>
                <ExternalLink className="w-3 h-3 inline" />
              </a>
              <div className="text-[11px] text-slate-500">Open Science Registry (Release v1.0.0)</div>
            </div>
          </div>

          {/* Research & Architectural Contribution */}
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2.5">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <Shield className="w-4 h-4" />
              <span>Architectural Invention & Scientific Thesis</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-sans text-xs">
              Conceived and specified the <strong>HFS (Hole-buffer File System)</strong> security paradigm: addressing the vulnerability where trailing file slack spaces and unallocated sparse hole extents in standard Linux filesystems are left unmonitored by traditional endpoint protection. By constructing a memory-resident Debian kernel (<code className="text-emerald-400 font-mono text-[11px]">toram</code>) with physical RAM disk allocation (<code className="text-emerald-400 font-mono text-[11px]">/dev/ram0</code>) and loop-mounted HFS, every hole buffer is cryptographically hashed to block stealth trailing virus payloads from attaching to system binaries.
            </p>
          </div>

          {/* Systems Credits & Module Metadata */}
          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2 text-[11px]">
            <div className="text-slate-400 font-semibold flex items-center justify-between">
              <span>Kernel Module & Systems Attribution:</span>
              <span className="text-emerald-400 font-bold">Release Version 1.0.0</span>
            </div>
            <div className="space-y-1 text-slate-400 bg-slate-900/80 p-2.5 rounded border border-slate-800 font-mono">
              <div><strong className="text-slate-300">Author:</strong> Bheemaiah &lt;bheemaiah@alumni.iitm.ac.in&gt;</div>
              <div><strong className="text-slate-300">Affiliation:</strong> Director, Synergy Robotics | IIT Madras Alumni</div>
              <div><strong className="text-slate-300">Publication:</strong> Zenodo DOI 10.5281/zenodo.14028912</div>
              <div><strong className="text-slate-300">License:</strong> Apache 2.0 (Application) / GPLv2 (hfs_kernel_guard.c)</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          {onOpenWhitePaper && (
            <button
              onClick={() => {
                onClose();
                onOpenWhitePaper();
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-purple-950 hover:bg-purple-900 text-purple-200 border border-purple-800 text-xs font-mono font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Read White Paper & Zenodo Package</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold rounded-lg transition-colors cursor-pointer ml-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
