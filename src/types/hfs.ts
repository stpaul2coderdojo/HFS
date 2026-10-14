export interface RamDiskConfig {
  device: string; // e.g. "/dev/ram0"
  type: 'brd' | 'tmpfs' | 'ramfs';
  sizeMB: number;
  allocatedMB: number;
  mountPoint: string; // e.g. "/mnt/ramdisk"
  fsType: 'ext4' | 'xfs' | 'btrfs';
  status: 'unmounted' | 'mounting' | 'mounted' | 'error';
  mlockEnabled: boolean;
  totalBlocks: number;
  usedBlocks: number;
}

export interface DebianKernelConfig {
  version: string; // e.g. "6.12.15-deb12-amd64"
  architecture: string; // "x86_64"
  memoryResident: boolean;
  bootParams: string[];
  initramfsModules: string[];
  kprobeHooks: string[];
  securityModuleStatus: 'active' | 'learning' | 'enforcing' | 'disabled';
  lastIntegrityCheckTime?: string;
  totalKernelChecks: number;
  trappedViolations: number;
}

export interface HoleBuffer {
  id: string;
  blockIndex: number;
  startOffset: number;
  endOffset: number;
  sizeBytes: number;
  type: 'sparse_hole' | 'tail_slack' | 'packed_buffer';
  expectedHash: string; // SHA-256
  currentHash: string;
  status: 'clean' | 'compromised' | 'quarantined' | 'scanning';
  quarantineReason?: string;
  payloadDetected?: {
    signatureName: string;
    matchedPattern: string;
    injectedAt: string;
    bytesHex: string;
  };
}

export interface HfsFile {
  id: string;
  name: string;
  logicalSize: number; // in bytes
  physicalSize: number; // in bytes
  inode: number;
  holeBuffers: HoleBuffer[];
  merkleRootHash: string;
  isExecutable: boolean;
  isLoopImage: boolean;
  lastScanned?: string;
}

export interface HfsLoopDevice {
  device: string; // "/dev/loop0"
  backingFile: string; // "/mnt/ramdisk/hfs.img"
  sizeMB: number;
  mountPoint: string; // "/mnt/hfs"
  status: 'detached' | 'attached' | 'mounted';
  readOnly: boolean;
  files: HfsFile[];
}

export interface TrailingVirusSignature {
  id: string;
  name: string;
  alias: string;
  attackVector: 'trailing_slack' | 'hole_cave_injection' | 'elf_padding_infection';
  description: string;
  sampleBytesHex: string;
  heuristicSeverity: 'critical' | 'high' | 'medium';
}

export interface AgentStep {
  id: string;
  timestamp: string;
  type: 'thought' | 'command' | 'output' | 'error' | 'verification' | 'tool_call';
  title: string;
  content: string;
  signature?: string;
  commandExecuted?: string;
  exitCode?: number;
}

export interface AgentRunState {
  isRunning: boolean;
  agentName: string;
  model: string;
  directive: string;
  steps: AgentStep[];
  error?: string;
}
