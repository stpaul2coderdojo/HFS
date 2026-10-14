# Trailing Virus Threat Model & Malware Analysis

**Author:** Bheemaiah (Director, Synergy Robotics; IIT Madras Alumni)  
**Release:** v1.0.0 (October 2026)  
**Zenodo DOI:** [10.5281/zenodo.14028912](https://doi.org/10.5281/zenodo.14028912)  

---

## 1. Threat Overview: Why Traditional Antivirus Fails

Traditional Linux antivirus software, Endpoint Detection and Response (EDR) agents, and file integrity monitoring systems (such as `AIDE`, `Tripwire`, or `auditd`) verify file integrity by opening files via standard VFS calls and reading up to `st_size` bytes.

However, operating systems allocate physical disk sectors in multiples of block sizes (usually **4096 bytes**).

### The Mathematical Gap:
$$\text{Slack Space} = (4096 - (\text{Logical File Size} \pmod{4096})) \pmod{4096}$$

For example, a file of **4,500 bytes** occupies two 4096-byte blocks ($8,192\text{ bytes}$). The remaining **$3,692\text{ bytes}$** are ignored by standard userland tools, creating an invisible harbor for malware.

---

## 2. Attack Taxonomy

### 2.1 Slack Parasite Injection (`W64.SlackParasite.Heuristic`)
- **Mechanism:** Malware locates an executable binary (e.g. in `/bin/` or `/usr/sbin/`). It appends its encrypted payload directly to the physical sector tail after EOF without altering the inode's `i_size` field.
- **Execution Hook:** The virus hooks into the dynamic linker or overrides pointer jumps to read the slack offset.
- **Antivirus Blindspot:** File hashes (like `sha256sum file`) read only up to EOF, computing a clean hash despite malicious bytes lurking in sector slack.

### 2.2 Sparse Hole Extent Hijacking (`Linux.CaveDiver.SparsePayload`)
- **Mechanism:** In sparse files, large ranges of blocks are unallocated &ldquo;holes&rdquo;. Malicious rootkits inject code into the physical storage blocks that correspond to these virtual holes, or use low-level block writes (`/dev/loop0`) to corrupt zero buffers.
- **Execution:** When the file is memory-mapped (`mmap`) into process address space, unaligned memory reads execute the parasite directly from RAM.

### 2.3 ELF Segment Padding Subversion (`ELF.SegmentGap.StealthTail`)
- **Mechanism:** Executable and Linkable Format (ELF) binaries mandate page-aligned segment boundaries for `.text` and `.data`. Attackers insert polymorphic code into the intra-segment alignment padding.

---

## 3. HFS Detection & Neutralization Lifecycle

```
[ File Access Trigger ]
          │
          ▼
[ Kernel Kprobe: vfs_read() ]
          │
          ▼
[ Evaluate Target Sector Boundary ]
    Is offset within sparse hole or tail slack?
          │
          ├── YES ──> [ Read Raw Memory Buffer ]
          │                  │
          │                  ▼
          │           [ Compute SHA-256 Digest ]
          │                  │
          │                  ▼
          │           [ Compare against HFS Cryptographic Registry ]
          │                  │
          │                  ├── MATCH (Clean Zero Buffer) ──> [ Allow Read (Code 0) ]
          │                  │
          │                  └── MISMATCH (Payload Detected) ──> [ ACTION ]
          │                                                         │
          │                                                         ├── Drop Buffer
          │                                                         ├── Quarantine Block
          │                                                         ├── Memory Freeze
          │                                                         └── SIGKILL Process
          │
          └── NO (Standard Data Extent) ──> [ Standard VFS Pass-through ]
```

---

## 4. Test Signatures Catalog

| Signature ID | Name | Sample Payload Snippet (Hex) | Severity |
|:---|:---|:---|:---|
| `sig-slack-01` | `W64.SlackParasite.Heuristic` | `e94200000031c04889c30f05e8100000007f454c4620545241494c` | Critical |
| `sig-hole-02` | `Linux.CaveDiver.SparsePayload` | `4831ff6a66580f054831f6564889e66a015f6a105a6a2a580f05` | Critical |
| `sig-elf-03` | `ELF.SegmentGap.StealthTail` | `9090909031c9f7e151682f2f7368682f62696e89e3515389e1cd80` | High |
