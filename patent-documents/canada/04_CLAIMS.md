# CLAIMS

1. An IoT-enabled electrical protection device comprising:
   - a housing configured for mounting on a DIN rail in a two-module form factor;
   - a delayed thermal tripping mechanism configured to interrupt electrical current upon detection of a sustained overload condition;
   - a magnetic tripping mechanism configured to interrupt electrical current upon detection of a short-circuit condition;
   - an arc fault detection subsystem comprising at least one arc sensor and processing circuitry configured to identify an arcing fault based on at least one of current signature, optical emission, or acoustic emission;
   - an arc extinguishing subsystem comprising arc runners, pre-chamber plates, and an arc chamber configured to receive an electric arc from the arc runners and to subdivide the electric arc into a plurality of smaller arc segments until the arc is extinguished;
   - a microcontroller operatively coupled to the arc fault detection subsystem, the delayed thermal tripping mechanism, and the magnetic tripping mechanism, the microcontroller configured to execute local fault analysis and continuous internal self-test routines;
   - a sensor array comprising at least a current sensor and a voltage sensor;
   - a connectivity module operatively coupled to the microcontroller and configured to communicate over at least one wireless protocol selected from Wi-Fi and Bluetooth Low Energy; and
   - an LED indication subsystem configured to indicate a fault category upon occurrence of a fault condition.

2. The device of claim 1, wherein the housing provides a selectable breaking capacity of at least one of 6 kA or 10 kA.

3. The device of claim 1 or 2, further comprising a bidirectional power connection interface permitting electrical supply connection to either a top terminal pair or a bottom terminal pair.

4. The device of any one of claims 1 to 3, wherein the continuous internal self-test routines comprise at least one of: sensor calibration verification, trip actuator functional verification, communication module heartbeat verification, memory integrity verification, and arc sensor sensitivity verification.

5. The device of any one of claims 1 to 4, wherein the arc fault detection subsystem is configured to command trip actuation within a predetermined response time upon detection of an arcing fault.

6. The device of any one of claims 1 to 5, further comprising a temperature sensor in the sensor array for monitoring at least one of internal component temperature or ambient panel temperature.

7. A smart electrical safety and energy efficiency management system comprising:
   - the IoT-enabled electrical protection device of any one of claims 1 to 6;
   - a cloud-based data platform configured to receive telemetry from the IoT-enabled electrical protection device, store historical electrical parameter data, and generate alerts upon detection of abnormal electrical conditions; and
   - a mobile application configured to communicate with the cloud-based data platform to present real-time electrical parameter data, fault alerts, and remote control commands including at least trip and reset commands for the IoT-enabled electrical protection device.

8. The system of claim 7, wherein the cloud-based data platform comprises a machine-learning module configured to analyze historical and real-time electrical parameter data and to generate personalized energy efficiency recommendations transmitted to the mobile application.

9. The system of claim 7 or 8, wherein the mobile application is configured to integrate with a smart-home ecosystem via at least one of a RESTful API and an MQTT interface to coordinate electrical system functions with at least one external smart-home device.

10. The system of any one of claims 7 to 9, wherein communication between the IoT-enabled electrical protection device, the cloud-based data platform, and the mobile application is encrypted using TLS 1.2 or higher.

11. The system of any one of claims 7 to 10, wherein the mobile application presents data visualization including at least one of graphs, trend reports, and exportable consumption reports derived from telemetry stored on the cloud-based data platform.

12. The system of any one of claims 7 to 11, further comprising earthing and lightning protection components operatively coupled to the cloud-based data platform and configured to report at least one of ground resistance monitoring values and surge protection device status.

13. A method of managing electrical safety and energy efficiency, the method comprising:
    - acquiring electrical parameter data from a sensor array of an IoT-enabled electrical protection device installed in an electrical distribution panel;
    - performing local fault analysis on the acquired electrical parameter data using a microcontroller of the IoT-enabled electrical protection device;
    - detecting an arcing fault based on at least one arc signature derived from the acquired electrical parameter data;
    - upon detection of the arcing fault, actuating an arc extinguishing subsystem comprising arc runners, pre-chamber plates, and an arc chamber to extinguish an electric arc and interrupt current flow;
    - transmitting processed telemetry from the IoT-enabled electrical protection device to a cloud-based data platform via a wireless connectivity module;
    - analyzing at least one of historical and real-time telemetry at the cloud-based data platform using a machine-learning module to generate energy efficiency recommendations;
    - generating a fault alert upon detection of an abnormal electrical condition; and
    - presenting the energy efficiency recommendations, fault alerts, and remote control functions to a user via a mobile application communicatively coupled to the cloud-based data platform.

14. The method of claim 13, further comprising executing continuous internal self-test routines on the IoT-enabled electrical protection device and reporting self-test results to the cloud-based data platform.

15. The method of claim 13 or 14, further comprising:
    - detecting a sustained overload condition and actuating a delayed thermal tripping mechanism; and
    - detecting a short-circuit condition and actuating a magnetic tripping mechanism independently of the delayed thermal tripping mechanism.

16. The method of any one of claims 13 to 15, further comprising illuminating an LED indicator on the IoT-enabled electrical protection device to indicate a fault category corresponding to the detected abnormal electrical condition.

17. The method of any one of claims 13 to 16, further comprising receiving user feedback on the energy efficiency recommendations at the cloud-based data platform and updating the machine-learning module based on the user feedback.

18. The method of any one of claims 13 to 17, further comprising integrating the mobile application with a smart-home ecosystem to execute an automation rule triggered by at least one of the fault alert and the energy efficiency recommendations.

19. The device of any one of claims 1 to 6, wherein the at least one wireless protocol comprises Wi-Fi for local area network communication and Bluetooth Low Energy for device provisioning.

20. The system of any one of claims 7 to 12, wherein the cloud-based data platform applies a real-time rule engine to evaluate incoming telemetry against user-configurable thresholds including at least one of voltage sag, voltage swell, phase imbalance, and demand peak conditions.

---

**Total claims:** 20 (within standard fee tier; no excess-claim surcharge at filing)

*Claims must be clear, concise, and fully supported by the description. Review with a registered Canadian patent agent before filing.*
