# Antigravity HFS: Memory-Resident Debian Kernel & Loopback Hole-Buffer Guard

[![Release](https://img.shields.io/badge/Release-v1.0.0-emerald.svg)](https://github.com/synergy-robotics/antigravity-hfs/releases/tag/v1.0.0)
[![DOI](https://img.shields.io/badge/DOI-10.5281%2Fzenodo.23366904-blue.svg)](https://doi.org/10.5281/zenodo.23366904)
[![Kernel](https://img.shields.io/badge/Linux-6.12%2B%20Debian%2012-cyan.svg)](https://www.debian.org)
[![Author](https://img.shields.io/badge/Author-Bheemaiah%20%7C%20Synergy%20Robotics-purple.svg)](mailto:bheemaiah@alumni.iitm.ac.in)
[![Affiliation](https://img.shields.io/badge/Alma%20Mater-IIT%20Madras%20Alumni-orange.svg)](https://www.iitm.ac.in)
[![License](https://img.shields.io/badge/License-Apache%202.0%20%2F%20GPLv2-yellow.svg)](LICENSE)

An autonomous agentic systems architecture designing, deploying, and supervising a **memory-resident Debian kernel (`toram`)**, physical **kernel RAM disk (`/dev/ram0`)**, and a **loop-mounted single container (`hfs.img` on `/dev/loop0`)**. The system implements cryptographic **hole-buffer and sector slack space hashing** to trap and quarantine **trailing viruses** attempting stealth attachment to system binaries and sparse files.

---

## 📌 Principal Author & Affiliation

- **Principal Architect:** **Bheemaiah**
- **Roles:** **Director, Synergy Robotics** | **IIT Madras Alumni (IITM)**
- **Correspondence:** `bheemaiah@alumni.iitm.ac.in`
- **Official Zenodo Archive:** [10.5281/zenodo.23366904](https://doi.org/10.5281/zenodo.23366904)
- **Current Version:** `1.0.0` (October 2026)

---

## 🔬 The Problem: Trailing Viruses & Unmonitored Hole Buffers

Traditional Linux file systems and endpoint detection tools rely on file metadata descriptors (such as `st_size` from POSIX `stat`). However, filesystems allocate storage in discrete sector blocks (typically 4096 bytes). This creates two dangerous security blind spots:

1. **File Slack Space (Trailing Slack):**
   When a 5,000-byte binary is saved, it occupies two 4KB blocks (8,192 bytes), leaving **3,192 bytes of invisible slack space** at the tail. Trailing viruses append polymorphic shellcode to this slack area without modifying `st_size`, completely evading file length monitors.
2. **Sparse Extent Holes (Cave Divers):**
   Sparse files intentionally leave multi-megabyte regions unallocated. Malware injects stealth loaders into these unmapped memory holes, executing via manipulated pointers or unaligned `mmap` offsets.

```
Standard File Allocation (Vulnerable):
+------------------------------------+--------------------------+
| Active File Payload (EOF: 5,000B)  | Trailing Slack (3,192B)  | <- Trailing Virus Infiltrates Here!
+------------------------------------+--------------------------+
|<------------ 4096B Sector 1 ------>|<---- 4096B Sector 2 ---->|

HFS Cryptographic Defense (Protected):
+------------------------------------+--------------------------+
| Active Extent Data (Hashed)        | Slack Packed & Hashed    | <- Kernel Kprobe Traps Mismatch!
+------------------------------------+--------------------------+
  SHA-256 Merkle Block Tree Validation on every vfs_read()
```

---

## 🏛️ System Architecture

```
+-----------------------------------------------------------------------------------------+
|                                    PHYSICAL RAM (DDR5 / ECC)                            |
|                          Zero Swap • mlockall() Locked • Volatile Space                 |
+-----------------------------------------------------------------------------------------+
                                             │
                                             ▼
+-----------------------------------------------------------------------------------------+
|                              LINUX BRD RAM DISK (/dev/ram0)                             |
|                modprobe brd rd_nr=1 rd_size=1048576 • ext4 -O ^has_journal             |
+-----------------------------------------------------------------------------------------+
                                             │
                                             ▼
+-----------------------------------------------------------------------------------------+
|                          MEMORY-RESIDENT DEBIAN LIVE KERNEL                             |
|               Boot Parameters: BOOT_IMAGE=/boot/vmlinuz toram boot=live quiet           |
+-----------------------------------------------------------------------------------------+
                                             │
                                             ▼
+-----------------------------------------------------------------------------------------+
|                            LOOPBACK HFS CONTAINER (/dev/loop0)                          |
|             losetup --direct-io=on /mnt/ramdisk/hfs.img • Mounted at /mnt/hfs           |
+-----------------------------------------------------------------------------------------+
                                             │
                                             ▼
+-----------------------------------------------------------------------------------------+
|                      CRYPTOGRAPHIC HOLE-BUFFER GUARD (hfs_kernel_guard.ko)              |
|        Kprobe Hooks: vfs_read, do_sys_openat2 • Continuous SHA-256 Slack Validation     |
|              Automated Memory Quarantine • Zero Trailing Payload Execution              |
+-----------------------------------------------------------------------------------------+
```

---

## 🚀 Quick Start & Setup

### 1. Prerequisites
- Linux kernel 6.12+ (Debian 12 Bookworm recommended).
- Root privileges (`sudo`) for loop and RAM disk management.
- Node.js 22+ and `npm` (for the Antigravity Agent web orchestrator).

### 2. Automated Linux Shell Deployment
Run the automated deployer to provision the RAM disk, configure loopback HFS, and compute baseline hole hashes:

```bash
# Clone the repository
git clone https://github.com/synergy-robotics/antigravity-hfs.git
cd antigravity-hfs

# Make deployer executable and run
chmod +x deploy_ramdisk_hfs.sh
sudo ./deploy_ramdisk_hfs.sh
```

### 3. Launch the Antigravity Agent Web Control Panel

```bash
# Install dependencies
npm install

# Start full-stack application (Express + Vite on Port 3000)
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 📦 What's Inside

| File / Component | Purpose |
|:---|:---|
| `server.ts` | Full-stack backend orchestrating the Antigravity Agent API, hole-buffer crypto tables, and quarantine actions. |
| `src/components/TopologyView.tsx` | Interactive 5-layer visual schematic from physical ECC RAM to the HFS cryptographic guard. |
| `src/components/HoleBufferExplorer.tsx` | Visual block extent inspector detailing data, holes, slack spaces, and SHA-256 hashes. |
| `src/components/VirusLab.tsx` | Trailing virus attack simulator and kernel trap center. |
| `src/components/AgentConsole.tsx` | Live Proof-of-Work stream showing the Antigravity Agent's thoughts, shell commands, and kernel diagnostics. |
| `src/components/WhitePaperModal.tsx` | Complete technical white paper viewer with Zenodo export bundle and BibTeX citation. |
| `src/components/AuthorshipModal.tsx` | Attribution and credential records for **Bheemaiah (Director, Synergy Robotics; IIT Madras Alumni)**. |
| `deploy_ramdisk_hfs.sh` | Production bash deployment script for real Debian/Linux installations. |
| `.zenodo.json` | Open Science deposit metadata for automated GitHub-to-Zenodo release publishing. |

---

## 🛡️ Trailing Virus Threat Catalog

HFS tests and protects against three primary trailing viral strains:

1. **`W64.SlackParasite.Heuristic`** (Critical Severity)  
   *Vector:* Appends malicious payload bytes to sector slack buffer beyond EOF to evade standard file-size inspection.
2. **`Linux.CaveDiver.SparsePayload`** (Critical Severity)  
   *Vector:* Injects polymorphic loader into unallocated zeroed sparse extents (file holes) executed via unaligned pointer redirection.
3. **`ELF.SegmentGap.StealthTail`** (High Severity)  
   *Vector:* Corrupts trailing page alignment buffer in binary executable memory mapping without altering file header offset.

---

## 📖 Citation & Zenodo Archive

If you use this architecture, white paper, or code in your research or industrial deployment, please cite our Zenodo archive:

```bibtex
@article{bheemaiah2026hfs,
  title={Cryptographic Hole-Buffer Hashing in Memory-Resident Kernels: Mitigating Trailing Slack and Sparse Extent Parasitic Infections in Loopback HFS},
  author={Bheemaiah},
  affiliation={Director, Synergy Robotics; IIT Madras Alumni},
  year={2026},
  month={October},
  version={1.0.0},
  publisher={Zenodo},
  doi={10.5281/zenodo.23366904},
  url={https://doi.org/10.5281/zenodo.23366904}
}
```

---

## 📜 License

- **Web Application & Orchestrator:** [Apache License 2.0](LICENSE)
- **Linux Kernel Module (`hfs_kernel_guard.c`):** GNU General Public License v2 (GPLv2)
- **Technical White Paper:** Creative Commons Attribution 4.0 International (CC-BY 4.0)

Copyright © 2026 **Bheemaiah**, Director, Synergy Robotics & IIT Madras Alumni.
