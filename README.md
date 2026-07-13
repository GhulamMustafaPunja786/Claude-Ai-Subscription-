# Laptop Cleanup & Speed Boost Pro

Windows batch toolkit for cleaning junk files, clearing caches, and applying light performance tweaks.

## How to run

1. Right-click `Laptop_Cleanup_Speed_Boost.bat`
2. Choose **Run as administrator**
3. Pick a mode:

| Mode | What it does |
|------|----------------|
| **1 Quick Cleanup** | Temp files, browser caches, recycle bin, DNS, thumbnails |
| **2 Full Boost** | Everything in Quick + Update cache, services, apps, power plan, Disk Cleanup |
| **3 Deep Clean** | Full Boost + SFC, DISM, drive optimize, event logs, Winsock reset |
| **4 Performance Only** | Stop heavy apps, tune services, network tweaks, High Performance plan |

## Notes

- Always restart after **Full Boost** or **Deep Clean**.
- Deep Clean can take a long time (SFC / DISM).
- Browser cache cleanup closes Edge / Chrome / Firefox if they are open.
- Does **not** delete personal documents, photos, or installed programs.
