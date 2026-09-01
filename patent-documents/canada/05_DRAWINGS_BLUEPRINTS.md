# DRAWINGS AND TECHNICAL BLUEPRINTS

## Drawing standards (CIPO compliance)

| Requirement | Specification |
|-------------|---------------|
| Sheet size | A4 (210 mm × 297 mm) |
| Colour | Black and white only |
| Margins | Top/left: 25 mm; right: 15 mm; bottom: 10 mm |
| Line weight | 0.3–0.5 mm main outlines; 0.15 mm detail |
| Reference characters | ≥ 3.2 mm height; unique per element |
| Figure numbering | Arabic numerals: 1, 2, 3 … |
| Cross-sections | Hatching with fine parallel lines |

---

## Reference numeral index

| Numeral | Element |
|---------|---------|
| 100 | Smart electrical safety and energy efficiency management system |
| 102 | ElecSecure IoT-enabled protection device |
| 104 | Local network (Wi-Fi / LAN) |
| 106 | Cloud-based data platform |
| 108 | Mobile application |
| 110 | Smart-home devices |
| 112 | Connectivity module |
| 202 | Device enclosure (two-module DIN form factor) |
| 204 | Input terminals |
| 206 | Output terminals |
| 208 | LED fault indicators |
| 210 | Manual test/reset interface |
| 300 | Arc extinguishing subsystem |
| 302 | Arc runners |
| 304 | Pre-chamber plates |
| 306 | Arc chamber |
| 308 | Arc sensors |
| 402 | Microcontroller |
| 404 | Delayed thermal tripping mechanism |
| 406 | Magnetic tripping mechanism |
| 408 | Sensor array |
| 410 | Connectivity module (Wi-Fi / BLE) |
| 412 | Power supply |
| 414 | Non-volatile memory |
| 500 | Local fault detection process |
| 600 | Cloud processing process |
| 604 | Time-series database |
| 612 | Machine-learning module |
| 802 | Mobile app dashboard |
| 804 | Circuit panel view |
| 806 | Alert center |
| 808 | Remote control panel |
| 810 | Analytics view |
| 812 | Recommendations panel |
| 814 | Smart-home integration |

---

## Figure 1 — System Architecture

**File:** `drawings/figure-01-system-architecture.svg`

Shows end-to-end data flow: protection device **102** → local network **104** → cloud platform **106** ↔ mobile app **108** ↔ smart-home devices **110**.

---

## Figure 2 — Device Front Elevation

**File:** `drawings/figure-02-device-front-elevation.svg`

Front view of enclosure **202** with dimensions:
- Width: 36 mm (2 modules × 18 mm)
- Height: ~90 mm (typical DIN module)
- Depth: ~75 mm (panel mount)

Terminals **204** (top), **206** (bottom), LEDs **208**, test/reset **210**.

---

## Figure 3 — Arc Extinguishing Subsystem (Sectional View)

**File:** `drawings/figure-03-arc-chamber-section.svg`

Cross-section showing arc path:
1. Contacts separate under fault
2. Arc forms at contact gap
3. Arc runners **302** guide arc upward
4. Pre-chamber plates **304** split arc
5. Arc chamber **306** extinguishes subdivided arcs

---

## Figure 4 — Internal Electronics Block Diagram

**File:** `drawings/figure-04-electronics-block-diagram.svg`

Functional blocks: power supply **412** → microcontroller **402** ← sensors **408**; trip mechanisms **404**, **406**; connectivity **410**; memory **414**.

---

## Figure 5 — Local Fault Detection Flowchart

**File:** `drawings/figure-05-fault-detection-flowchart.svg`

Process steps 502–522 as defined in the Description.

---

## Figure 6 — Cloud Processing Flowchart

**File:** `drawings/figure-06-cloud-processing-flowchart.svg`

Process steps 602–616 as defined in the Description.

---

## Figure 7 — Dual Tripping Mechanism Schematic

**File:** `drawings/figure-07-dual-tripping-schematic.svg`

Overload path **702** via bimetallic element **710**; short-circuit path **720** via solenoid **726**.

---

## Figure 8 — Mobile Application Interface

**File:** `drawings/figure-08-mobile-app-wireframe.svg`

Wireframe panels **802**–**814**.

---

## Mechanical blueprint — Panel mounting (supplementary)

### DIN rail mounting

```
        ┌──────────────────────────────────────┐
        │  Panel door (not shown)              │
        ├──────────────────────────────────────┤
        │  ┌────┐ ┌────┐ ┌────┐ ┌────┐        │
        │  │Mod1│ │102 │ │Mod3│ │Mod4│  ...   │  ← 36mm device 102 spans 2 modules
        │  └────┘ └────┘ └────┘ └────┘        │
        │  ═══════════════════════════════     │  ← DIN rail 35mm
        └──────────────────────────────────────┘
```

### Terminal wiring (bidirectional)

```
Option A (top feed):          Option B (bottom feed):

  LINE IN ──► 204              206 ──► LOAD
  LOAD ◄── 206                 204 ◄── LINE IN
```

---

## Electrical schematic notes (supplementary)

| Parameter | Value / range |
|-----------|---------------|
| Rated voltage | 120/240 V AC (split-phase, Canadian residential) |
| Rated current | 15 A / 20 A / 30 A (model variants) |
| Breaking capacity | 6 kA or 10 kA @ rated voltage |
| Thermal trip | Inverse-time, IEC Type B/C curve (model dependent) |
| Magnetic trip | Instantaneous, 5–10 × In |
| Arc detection response | < 100 ms (target) |
| Wi-Fi | 2.4 GHz, 802.11 b/g/n |
| BLE | 5.0, provisioning service UUID TBD |
| Operating temperature | −25 °C to +55 °C |
| IP rating | IP20 (panel interior) |

---

## Bill of materials (BOM) — reference

| Ref | Component | Qty | Notes |
|-----|-----------|-----|-------|
| U1 | Microcontroller (ARM Cortex-M4) | 1 | 120 MHz, FPU for arc DSP |
| U2 | Wi-Fi/BLE combo module | 1 | ISED-certified module |
| T1 | Current transformer / shunt | 1 | 0–30 A range |
| R1 | Voltage divider network | 1 | Line voltage sensing |
| TH1 | NTC thermistor | 1 | Internal temperature |
| AS1 | Arc sensor (optical/HF current) | 1–2 | Redundant in premium model |
| K1 | Magnetic trip solenoid | 1 | Short-circuit actuation |
| BM1 | Bimetallic thermal element | 1 | Overload actuation |
| AR1 | Arc runner assembly | 1 | Copper alloy |
| PC1 | Pre-chamber plate set | 2–4 | Ceramic insulator |
| AC1 | Arc chamber housing | 1 | Vented arc chute |
| LED1–4 | Status LEDs | 4 | Fault category indication |
| PS1 | AC-DC power supply IC | 1 | 3.3 V / 5 V rails |
| M1 | Flash memory | 1 | 4–16 MB firmware + logs |

---

*All reference numerals in these drawings must appear in the Description. Convert SVG files to PDF at 300 DPI for CIPO electronic submission.*
