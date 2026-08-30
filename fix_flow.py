import re

new_flow = """
const FLOW_STEPS = [
  {
    icon: FileText,
    title: '1. Oviposition chamber',
    purpose: 'Attract gravid female Aedes mosquitoes to a standardised egg-laying site.',
    status: 'Planned' as MaturityStatus,
    data: 'Planned hardware',
    validation: 'Lure effectiveness, containment, servicing interval',
  },
  {
    icon: Activity,
    title: '2. MEMS microphone',
    purpose: 'Listen for the proposed Aedes wingbeat trigger range.',
    status: 'Planned' as MaturityStatus,
    data: 'Current state: No physical microphone is connected.',
    validation: 'Ambient-noise rejection, false triggers, missed triggers, classifier performance.',
  },
  {
    icon: AlertTriangle,
    title: '3. Wingbeat trigger',
    purpose: 'Decide whether to wake the camera.',
    status: 'Simulated' as MaturityStatus,
    data: 'Current state: Trigger logic shown for workflow demonstration only.',
    validation: 'Threshold calibration and camera-wake reliability.',
  },
  {
    icon: Monitor,
    title: '4. Camera capture',
    purpose: 'Wake after the proposed wingbeat trigger and capture the egg-laying substrate.',
    status: 'Planned' as MaturityStatus,
    data: 'Current state: No physical camera-trigger integration has been built.',
    validation: '',
  },
  {
    icon: Cpu,
    title: '5. ESP32-S3 / TinyML egg counting',
    purpose: 'Run lightweight image preprocessing and TinyML egg-count estimation.',
    status: 'Not Started' as MaturityStatus,
    data: 'Not built, Model not trained',
    validation: '',
  },
  {
    icon: Activity,
    title: '6. Temperature + humidity merge',
    purpose: 'Combine the egg count with temperature and humidity.',
    status: 'Simulated' as MaturityStatus,
    data: 'SHT30 or final selected equivalent',
    validation: '',
  },
  {
    icon: Activity,
    title: '7. Compact result',
    purpose: 'Compile sensor readings and AI estimates.',
    status: 'Simulated' as MaturityStatus,
    data: 'Egg-count estimate, Image-quality state, Temp, Humidity, Battery, Flags, Timestamp',
    validation: '',
  },
  {
    icon: Radio,
    title: '8. LoRaWAN packet',
    purpose: 'Transmit compact payload over low-power wide-area network.',
    status: 'Simulated' as MaturityStatus,
    data: 'Simulated packet only. No live transmission.',
    validation: '',
  },
  {
    icon: Radio,
    title: '9. GW-01 proposed gateway',
    purpose: 'Receive LoRaWAN packets and forward to backend.',
    status: 'Planned' as MaturityStatus,
    data: 'Gateway: GW-01. Proposed placement.',
    validation: 'Coverage not field-tested',
  },
  {
    icon: Server,
    title: '10. Mock backend',
    purpose: 'Ingest data, store, and serve API.',
    status: 'Not Started' as MaturityStatus,
    data: 'Current representation: Local mock data in React.',
    validation: '',
  },
  {
    icon: Activity,
    title: '11. Illustrative risk logic',
    purpose: 'Calculate intervention priority based on environmental risk factors.',
    status: 'Simulated' as MaturityStatus,
    data: 'Current representation: Stored scenario values and qualitative reason codes.',
    validation: '',
  },
  {
    icon: Monitor,
    title: '12. Dashboard output',
    purpose: 'Display alerts, risk bands, and decision support.',
    status: 'Implemented in Mock UI' as MaturityStatus,
    data: 'Outputs: Risk band, Priority list, Reason codes, Actions, Alerts.',
    validation: 'Working mock interface',
  },
];
"""

with open('src/components/evidence/SystemDataFlow.tsx', 'r') as f:
    content = f.read()

# Replace the old FLOW_STEPS
import re
content = re.sub(r'const FLOW_STEPS = \[.*?\];', new_flow, content, flags=re.DOTALL)

with open('src/components/evidence/SystemDataFlow.tsx', 'w') as f:
    f.write(content)
