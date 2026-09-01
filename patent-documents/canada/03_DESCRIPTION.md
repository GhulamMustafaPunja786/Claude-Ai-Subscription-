# DESCRIPTION

## TITLE OF THE INVENTION

**SMART ELECTRICAL SAFETY AND ENERGY EFFICIENCY MANAGEMENT SYSTEM WITH IoT-ENABLED ARC FAULT PROTECTION AND INTEGRATED CLOUD ANALYTICS**

---

## TECHNICAL FIELD

The present invention relates to electrical protection and energy management systems. More particularly, the invention relates to an integrated system combining an IoT-enabled circuit protection device with arc fault detection and extinguishing, dual tripping mechanisms, continuous self-testing, and cloud-connected analytics for real-time electrical safety monitoring and energy efficiency optimization in residential and commercial installations.

---

## BACKGROUND OF THE INVENTION

Electrical distribution systems in buildings require protection against overload, short-circuit, and arcing fault conditions. Conventional circuit breakers and residual-current devices provide basic overcurrent and ground-fault protection but often lack integrated diagnostics, remote monitoring, and energy analytics capabilities.

Arcing faults—unintentional electrical discharges across an air gap—are a leading cause of residential and commercial electrical fires. Conventional thermal-magnetic breakers may not detect low-level series arcing faults before significant damage occurs. Dedicated arc-fault circuit interrupters (AFCIs) address some arc conditions but are typically deployed as separate devices without integrated energy management or cloud connectivity.

The proliferation of smart home technology and rising energy costs have increased demand for systems that combine electrical safety with real-time energy monitoring, remote control, and data-driven efficiency recommendations. Existing market offerings generally address only subsets of these requirements: standalone smart meters provide consumption data without integrated protection; conventional breakers provide protection without IoT connectivity; and energy management platforms lack embedded arc fault extinguishing hardware in a compact form factor.

There remains a need for a unified system that:

1. Integrates dual thermal-magnetic tripping with active arc fault detection and arc extinguishing in a compact protective device;
2. Provides continuous internal self-testing and localized LED fault indication;
3. Connects securely to a cloud platform for real-time telemetry, alerts, and historical analytics;
4. Delivers machine-learning-based energy efficiency recommendations through a mobile application;
5. Enables remote trip/reset control and smart-home ecosystem integration.

The present invention addresses these needs.

---

## SUMMARY OF THE INVENTION

In a first aspect, the invention provides an IoT-enabled electrical protection device comprising:

- a housing occupying a two-module DIN-rail form factor;
- a delayed thermal tripping mechanism configured to interrupt current flow upon sustained overload;
- a magnetic tripping mechanism configured to interrupt current flow upon short-circuit;
- an arc fault detection subsystem comprising at least one arc sensor and signal processing circuitry;
- an arc extinguishing subsystem comprising arc runners, pre-chamber plates, and an arc chamber configured to divide an electric arc into progressively smaller arc segments until extinguished;
- a microcontroller configured to execute local fault analysis, continuous internal self-test routines, and communication with a connectivity module;
- a connectivity module supporting at least one of Wi-Fi and Bluetooth Low Energy;
- a sensor array comprising current sensors, voltage sensors, and temperature sensors;
- an LED indication subsystem for localized fault identification; and
- a bidirectional power connection interface permitting supply connection from either a top or bottom terminal orientation.

In a second aspect, the invention provides a smart electrical safety and energy efficiency management system comprising the IoT-enabled electrical protection device, a cloud-based data platform, and a mobile application, wherein the cloud platform receives telemetry from one or more devices, stores historical electrical parameter data, generates real-time alerts upon detection of abnormal conditions, and applies machine-learning algorithms to produce personalized energy efficiency recommendations transmitted to the mobile application.

In a third aspect, the invention provides a method of managing electrical safety and energy efficiency comprising: acquiring electrical parameter data from sensors in an IoT-enabled protection device; performing local arc fault detection and tripping when arc signatures exceed predetermined thresholds; transmitting processed telemetry to a cloud platform; analyzing historical and real-time data using machine-learning models; generating alerts and efficiency recommendations; and presenting data and control functions to a user via a mobile application including remote trip and reset commands.

Further aspects and embodiments are defined in the claims.

---

## BRIEF DESCRIPTION OF THE DRAWINGS

Embodiments of the invention will now be described by way of example with reference to the accompanying drawings, in which:

**Figure 1** is a system architecture diagram showing the ElecSecure protection device, connectivity layer, cloud platform, mobile application, and smart-home integrations.

**Figure 2** is a front elevational view of the ElecSecure device showing module dimensions, terminals, and LED indicators.

**Figure 3** is a sectional side view of the arc extinguishing subsystem showing arc runners (302), pre-chamber plates (304), and arc chamber (306).

**Figure 4** is a functional block diagram of internal electronics including microcontroller (402), tripping mechanisms (404, 406), sensors (408), connectivity module (410), and power supply (412).

**Figure 5** is a flowchart of the local fault detection and arc extinguishing process.

**Figure 6** is a flowchart of cloud data processing, machine-learning analysis, and mobile application interaction.

**Figure 7** is a schematic diagram of dual tripping mechanism operation under overload and short-circuit conditions.

**Figure 8** is a user interface wireframe of the mobile application showing real-time monitoring, alerts, and remote control panels.

---

## DETAILED DESCRIPTION OF THE PREFERRED EMBODIMENTS

### System Overview (Figure 1)

Reference numeral **100** designates the smart electrical safety and energy efficiency management system. System **100** comprises an ElecSecure protection device **102**, a local network **104**, a cloud platform **106**, a mobile application **108**, and optional smart-home devices **110**.

The protection device **102** is installed in an electrical distribution panel and monitors one or more circuits. Device **102** acquires electrical parameters, performs local protection functions including arc fault detection and extinguishing, and transmits telemetry via connectivity module **112** through local network **104** to cloud platform **106**.

Cloud platform **106** aggregates data from multiple devices **102**, performs storage, analytics, and machine-learning processing, and pushes alerts and recommendations to mobile application **108**. Mobile application **108** provides user interfaces for monitoring, reporting, remote control, and integration with smart-home ecosystems **110**.

### ElecSecure Protection Device — Mechanical Design (Figure 2)

The protection device **102** is housed in an enclosure **202** conforming to a two-module DIN-rail form factor, providing a width of approximately 36 mm (two standard 18 mm modules). Despite the compact footprint, the device supports selectable breaking capacities of **6 kA** or **10 kA** in accordance with applicable product standards (e.g., IEC 60898, IEC 61009, or CSA C22.2 No. 5 as adapted for Canadian installations).

Input terminals **204** and output terminals **206** are arranged to permit bidirectional power connection—electrical supply may be connected to either the top or bottom terminal pair, improving installation flexibility in constrained panel layouts.

LED indicators **208** provide localized fault identification. Each LED corresponds to a fault category (e.g., overload, short-circuit, arc fault, ground fault, communication loss, self-test failure), enabling field technicians to diagnose conditions without requiring immediate access to the mobile application.

A manual test/reset interface **210** permits user-initiated self-test cycles and manual reset following a trip event.

### Arc Extinguishing Subsystem (Figure 3)

The arc extinguishing subsystem **300** is a distinguishing feature of device **102**. When a fault condition produces an electric arc, arc runners **302** guide the arc from the contact separation point into a pre-chamber defined by pre-chamber plates **304**. The arc is directed into arc chamber **306**, which is configured with insulating partitions and cooling surfaces that subdivide the main arc into a series of smaller arc segments.

Each subdivision increases arc voltage drop and reduces arc current until the arc is extinguished. This active arc management reduces contact erosion, limits thermal damage to adjacent components, and decreases the probability of arc-induced ignition of surrounding materials.

Arc sensors **308** (optical, acoustic, or current-signature-based) detect arc initiation. Upon detection, the microcontroller **402** (Figure 4) commands trip actuation within a predetermined response time (typically less than 100 ms for series arc conditions, subject to applicable standard requirements).

### Internal Electronics (Figure 4)

The electronic architecture of device **102** centers on microcontroller **402**, which may be implemented as an ARM Cortex-M class processor or equivalent embedded controller with sufficient processing capacity for real-time sensor sampling, arc signature analysis, and communication protocol handling.

**Delayed thermal tripping mechanism 404** comprises a bimetallic element or equivalent thermal actuator calibrated to trip after a sustained overcurrent condition exceeding the rated current by a time-dependent margin (inverse-time characteristic).

**Magnetic tripping mechanism 406** comprises a solenoid coil that actuates instantaneously when current exceeds a magnetic trip threshold indicative of a short-circuit condition.

Sensor array **408** includes:

- **Current sensors** (e.g., shunt resistors, current transformers, or Hall-effect sensors) for per-circuit amperage measurement;
- **Voltage sensors** for line voltage and power quality monitoring;
- **Temperature sensors** for thermal monitoring of internal components and ambient panel temperature;
- **Arc sensors** as described above.

Connectivity module **410** supports Wi-Fi (IEEE 802.11 b/g/n) for LAN communication and Bluetooth Low Energy (BLE) for provisioning, local diagnostics, and fallback communication. Firmware in non-volatile memory **414** implements encrypted TLS communication to cloud platform **106**.

Power supply **412** derives low-voltage DC power from the monitored circuit or an auxiliary supply, with voltage regulators maintaining stable operating voltage for electronics independent of line voltage fluctuations within rated range.

### Continuous Internal Self-Test

Device **102** executes continuous internal self-test routines without requiring user intervention. Self-test procedures include:

1. Verification of sensor calibration within acceptable drift limits;
2. Functional test of trip actuators using simulated drive signals (non-destructive);
3. Communication module heartbeat verification;
4. Memory integrity checks (CRC on firmware and configuration);
5. Arc sensor sensitivity verification using injected test signals.

Failure of any self-test sub-routine is logged locally and reported to cloud platform **106**, and a corresponding LED indicator **208** is illuminated.

### Local Fault Detection Process (Figure 5)

Process **500** begins at step **502** with continuous acquisition of sensor data. At step **504**, microcontroller **402** evaluates current magnitude against thermal and magnetic trip thresholds.

If a short-circuit threshold is exceeded (step **506**—yes), magnetic trip mechanism **406** is actuated at step **508**. If an overload condition is detected (step **510**—yes), thermal trip mechanism **404** is actuated at step **512**.

Parallel to overcurrent evaluation, arc signature analysis is performed at step **514**. Arc signatures may be characterized by high-frequency current perturbations, optical emissions, or acoustic emissions. If an arc fault is detected (step **516**—yes), the arc extinguishing subsystem **300** is engaged at step **518** concurrently with trip actuation.

At step **520**, fault data including timestamp, fault type, magnitude, and waveform excerpts are packaged for transmission. At step **522**, an alert is pushed to cloud platform **106** and mobile application **108**.

### Cloud Platform and Machine Learning (Figure 6)

Process **600** describes server-side operations. At step **602**, cloud platform **106** receives encrypted telemetry from device **102**. Data is validated and stored in time-series database **604**.

At step **606**, real-time rule engine evaluates incoming data against user-configurable thresholds (voltage sag, swell, imbalance, demand peaks). Alerts generated at step **608** are delivered via push notification to mobile application **108**.

At step **610**, machine-learning module **612** analyzes historical consumption patterns. Models may include:

- Clustering of daily load profiles to identify anomalous consumption;
- Regression models predicting demand peaks;
- Classification models distinguishing normal inrush current from fault conditions to reduce nuisance tripping;
- Recommendation engine suggesting load scheduling, standby power reduction, and equipment maintenance.

Recommendations are transmitted to mobile application **108** at step **614. User feedback on recommendations (accepted, dismissed, implemented) is collected at step **616** to improve model accuracy through supervised learning.

### Dual Tripping Mechanism (Figure 7)

Figure 7 illustrates operation of dual tripping mechanisms under two fault regimes.

Under **overload condition 702**, current **704** exceeds rated current **706** for duration **708** sufficient to heat bimetallic element **710**, causing mechanical displacement **712** that releases latch **714** and separates contacts **716**.

Under **short-circuit condition 720**, current **722** rises rapidly above magnetic trip threshold **724**, energizing solenoid **726** to actuate instantaneous trip **728** of contacts **716**.

Both mechanisms operate independently, ensuring appropriate response to fault type without compromising selectivity.

### Mobile Application (Figure 8)

Mobile application **108** provides:

- **Dashboard 802**: real-time voltage, current, power, power factor, and energy consumption;
- **Circuit panel 804**: per-circuit status with color-coded health indicators;
- **Alert center 806**: chronological fault and warning notifications with severity classification;
- **Remote control 808**: authorized trip and reset commands with two-factor authentication;
- **Analytics 810**: graphs, trend reports, and exportable CSV/PDF reports;
- **Recommendations 812**: machine-learning-generated efficiency suggestions;
- **Smart-home integration 814**: APIs for coordination with thermostats, lighting, and home automation hubs.

### Smart Home Integration

Application **108** exposes a RESTful API and/or MQTT interface for integration with smart-home platforms. Users may define automation rules such as:

- Shedding non-critical loads upon detection of impending demand threshold;
- Sending notifications to building management systems upon arc fault events;
- Coordinating backup generator transfer upon utility voltage loss detection.

### Earthing and Lightning Protection (Optional Embodiment)

In an extended embodiment, system **100** includes earthing and lightning protection components **120** compliant with IEC 62305 and Canadian Electrical Code (CEC) Part I requirements. These components integrate with cloud platform **106** to report ground resistance monitoring values and surge protection device status.

### Security

All communication between device **102**, cloud platform **106**, and mobile application **108** employs:

- TLS 1.2 or higher encryption in transit;
- Mutual authentication using device certificates;
- Role-based access control for remote trip/reset functions;
- Data compression for bandwidth optimization without compromising encrypted payload integrity.

### Canadian Regulatory Considerations

For deployment in Canada, device **102** is designed for compliance with:

- Canadian Electrical Code (CEC), Part I (CSA C22.1);
- CSA C22.2 No. 5 — Molded-case circuit breakers;
- Applicable AFCI requirements per CEC Rule 26-720 et seq. for dwelling unit branch circuits;
- Innovation, Science and Economic Development Canada (ISED) radio equipment certification for Wi-Fi/BLE modules.

---

## EXAMPLES

### Example 1 — Residential Panel Installation

A single ElecSecure device **102** is installed on a 15 A branch circuit serving kitchen receptacles. During operation, a deteriorating connection on a countertop appliance produces series arcing. Arc sensor **308** detects characteristic high-frequency current modulations. Microcontroller **402** actuates trip within 80 ms. Arc extinguishing subsystem **300** limits arc duration. Mobile application **108** delivers push notification: "Arc fault detected — Circuit 7 tripped." Cloud analytics identify the circuit as a recurring fault location, recommending professional inspection.

### Example 2 — Commercial Energy Optimization

A facility deploys twelve devices **102** across distribution panels. Cloud platform **106** aggregates consumption data. Machine-learning module **612** identifies that HVAC loads operate concurrently with peak tariff periods. Application **108** recommends rescheduling two circuits to off-peak hours, projecting 8% monthly cost reduction.

---

## INDUSTRIAL APPLICABILITY

The invention is applicable to residential, commercial, and light-industrial electrical installations requiring enhanced arc fault protection, real-time monitoring, and energy efficiency management. The compact form factor enables retrofit installation in existing panels without significant spatial modification.

---

*End of Description. This document must begin on a new page when filed. Reference numerals in this description correspond to figures in the Drawings section.*
