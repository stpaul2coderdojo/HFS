# Technical Architecture: Memory-Resident Debian & Loopback HFS

**Author:** Bheemaiah (Director, Synergy Robotics; IIT Madras Alumni)  
**Release:** v1.0.0 (October 2026)  
**Zenodo DOI:** [10.5281/zenodo.23366904](https://doi.org/10.5281/zenodo.23366904)  

---

## 1. Physical RAM & Volatile Memory Subsystem

The architecture mandates strict memory residency to eliminate disk-bound spindle and flash write amplification while ensuring that all storage artifacts reside in volatile ECC RAM.

- **Locking:** `mlockall(MCL_CURRENT | MCL_FUTURE)` is invoked to lock process and buffer mappings into physical pages, preventing swap daemon paging.
- **Swap Deactivation:** `swapoff -a` ensures zero persistent disk spills.
- **Hardware Mapping:** Operates over DDR5/ECC memory with direct bus mappings, eliminating disk head seek latency and achieving sub-microsecond buffer access.

---

## 2. Linux BRD (Block RAM Disk) Driver

Rather than using user-space memory mounts like standard `tmpfs` (which are subject to swap pressure and VFS page-cache double-buffering), HFS utilizes the kernel-native Block RAM Device (`brd`) driver:

```bash
modprobe brd rd_nr=1 rd_size=1048576 max_part=1
```

- **Device:** `/dev/ram0`
- **Capacity:** 1024 MB (1,048,576 KB)
- **Sector Size:** 4096 bytes
- **File System:** Ext4 formatted without journaling (`-O ^has_journal`) to eliminate metadata write amplification in RAM.

---

## 3. Memory-Resident Debian Kernel Boot Flow (`toram`)

The Debian Linux kernel (6.12+) is booted via live-boot parameters:

```text
BOOT_IMAGE=/boot/vmlinuz-6.12.15-deb12-amd64 root=/dev/ram0 toram boot=live rd.live.ram=1 hfs_guard.enforce=1 quiet
```

### Boot Sequence:
1. **BIOS / UEFI POST:** Kernel `vmlinuz` and `initramfs.img` loaded into high memory.
2. **Initramfs Stage:** The `toram` flag instructs `live-boot` to copy the entire compressed `squashfs` root filesystem from installation media into the `/dev/ram0` RAM disk.
3. **Pivot Root:** Control switches (`pivot_root`) into `/dev/ram0`. The boot medium can be completely disconnected.
4. **PID 1 (Systemd):** System initializes entirely within volatile RAM.

---

## 4. Loopback HFS Container (`/dev/loop0`)

The single file `hfs.img` is created as a sparse file:

```bash
truncate -s 256M /mnt/ramdisk/hfs.img
losetup --direct-io=on /dev/loop0 /mnt/ramdisk/hfs.img
```

- **Direct-IO:** Bypasses redundant OS page cache copies, establishing direct DMA-like memory transfers between the block loop device and the underlying RAM disk buffer.
- **Sparse Allocation:** Exploits Linux file holes where unallocated extents consume 0 physical blocks on the RAM disk until written.

---

## 5. Cryptographic Hole-Buffer & Slack Hashing Engine

Every file in HFS is parsed through FIEMAP ioctls (`FS_IOC_FIEMAP`) to identify:
1. **Allocated Extents:** Continuous data sectors with valid content.
2. **Sparse Holes:** Blocks where no physical storage is assigned. The kernel normally returns synthetic zero buffers on read.
3. **Tail Slack Space:** The delta bytes between logical file EOF (`st_size`) and the 4096-byte sector block boundary.

HFS calculates a cryptographic SHA-256 Merkle tree across both the allocated extents and the hole/slack buffers. If any unallocated byte deviates from its registered baseline hash (e.g. non-zero injection from a trailing virus), the kernel module traps the call and terminates the thread.
