import { ValidationMetric, EvidenceType, ValidationStatus } from '../types';

export const VALIDATION_METRICS: ValidationMetric[] = [
  // Edge AI egg counting
  {
    id: 'ai-mae', category: 'Edge AI egg counting', name: 'Mean absolute error',
    definition: 'Average absolute difference between model count and manual count',
    currentValue: null, target: '< 10%', status: 'Not Started', evidenceType: 'Provisional Team Target', plannedPhase: 'Lab MVP'
  },
  {
    id: 'ai-prec', category: 'Edge AI egg counting', name: 'Precision',
    definition: 'True positives / (True positives + False positives)',
    currentValue: null, target: '> 90%', status: 'Not Started', evidenceType: 'Provisional Team Target', plannedPhase: 'Lab MVP'
  },
  {
    id: 'ai-recall', category: 'Edge AI egg counting', name: 'Recall',
    definition: 'True positives / (True positives + False negatives)',
    currentValue: null, target: '> 90%', status: 'Not Started', evidenceType: 'Provisional Team Target', plannedPhase: 'Lab MVP'
  },
  {
    id: 'ai-f1', category: 'Edge AI egg counting', name: 'F1 score',
    definition: 'Harmonic mean of precision and recall',
    currentValue: null, target: '> 90%', status: 'Not Started', evidenceType: 'Provisional Team Target', plannedPhase: 'Lab MVP'
  },
  {
    id: 'ai-fp', category: 'Edge AI egg counting', name: 'False positives per image',
    definition: 'Average number of false positive bounding boxes per image',
    currentValue: null, target: '< 2', status: 'Not Started', evidenceType: 'Provisional Team Target', plannedPhase: 'Lab MVP'
  },
  {
    id: 'ai-usable', category: 'Edge AI egg counting', name: 'Usable-image rate',
    definition: 'Percentage of images with sufficient quality for inference',
    currentValue: null, target: '> 95%', status: 'Planned', evidenceType: 'Design Target',
    sourceLabel: 'Provisional Team Target',
    rationale: 'Hardware/software engineering goal for MVP.', plannedPhase: 'Pilot'
  },
  {
    id: 'ai-agree', category: 'Edge AI egg counting', name: 'Manual-count agreement',
    definition: 'Percentage of inferences within 10% of manual expert count',
    currentValue: null, target: '> 85%', status: 'Not Started', evidenceType: 'Provisional Team Target', plannedPhase: 'Pilot'
  },
  // Climate sensing
  {
    id: 'cli-temp', category: 'Climate sensing', name: 'Temperature error',
    definition: 'Difference from reference thermometer',
    currentValue: null, target: '< 0.5°C', status: 'Planned', evidenceType: 'Provisional Team Target', plannedPhase: 'Lab MVP'
  },
  {
    id: 'cli-hum', category: 'Climate sensing', name: 'Humidity error',
    definition: 'Difference from reference hygrometer',
    currentValue: null, target: '< 2%', status: 'Planned', evidenceType: 'Provisional Team Target', plannedPhase: 'Lab MVP'
  },
  {
    id: 'cli-drift', category: 'Climate sensing', name: 'Sensor drift',
    definition: 'Change in baseline reading over 6 months',
    currentValue: null, target: '< 1%', status: 'Not Started', evidenceType: 'Design Target',
    sourceLabel: 'Provisional Team Target',
    rationale: 'Hardware/software engineering goal for MVP.', plannedPhase: 'Post-Pilot'
  },
  {
    id: 'cli-miss', category: 'Climate sensing', name: 'Missing-reading rate',
    definition: 'Percentage of expected climate readings not recorded',
    currentValue: null, target: '< 1%', status: 'Planned', evidenceType: 'Design Target',
    sourceLabel: 'Provisional Team Target',
    rationale: 'Hardware/software engineering goal for MVP.', plannedPhase: 'Pilot'
  },
  // LoRaWAN
  {
    id: 'lora-pdr', category: 'LoRaWAN', name: 'Packet-delivery rate',
    definition: 'Percentage of transmitted packets received by backend',
    currentValue: null, target: '> 98%', status: 'Planned', evidenceType: 'Provisional Team Target', plannedPhase: 'Connectivity Test'
  },
  {
    id: 'lora-lat', category: 'LoRaWAN', name: 'Packet latency',
    definition: 'Time from transmission to backend ingestion',
    currentValue: null, target: '< 5s', status: 'Planned', evidenceType: 'Provisional Team Target', plannedPhase: 'Connectivity Test'
  },
  {
    id: 'lora-retry', category: 'LoRaWAN', name: 'Retry rate',
    definition: 'Percentage of packets requiring retransmission',
    currentValue: null, target: '< 5%', status: 'Not Started', evidenceType: 'Provisional Team Target', plannedPhase: 'Connectivity Test'
  },
  {
    id: 'lora-q', category: 'LoRaWAN', name: 'Offline queue recovery',
    definition: 'Successful transmission of queued packets after reconnect',
    currentValue: null, target: '100%', status: 'Not Started', evidenceType: 'Design Target',
    sourceLabel: 'Provisional Team Target',
    rationale: 'Hardware/software engineering goal for MVP.', plannedPhase: 'Pilot'
  },
  {
    id: 'lora-reach', category: 'LoRaWAN', name: 'Gateway reachability',
    definition: 'Percentage of nodes with RSSI > -110 dBm to gateway',
    currentValue: null, target: '100%', status: 'Planned', evidenceType: 'Design Target',
    sourceLabel: 'Provisional Team Target',
    rationale: 'Hardware/software engineering goal for MVP.', plannedPhase: 'Pilot'
  },
  // Power and durability
  {
    id: 'pwr-bal', category: 'Power and durability', name: 'Daily energy balance',
    definition: 'Energy harvested minus energy consumed (Wh/day)',
    currentValue: null, target: '> 0', status: 'Not Started', evidenceType: 'Design Target',
    sourceLabel: 'Provisional Team Target',
    rationale: 'Hardware/software engineering goal for MVP.', plannedPhase: 'Pilot'
  },
  {
    id: 'pwr-up', category: 'Power and durability', name: 'Node uptime',
    definition: 'Percentage of time node is powered and operational',
    currentValue: null, target: '> 99%', status: 'Planned', evidenceType: 'Design Target',
    sourceLabel: 'Provisional Team Target',
    rationale: 'Hardware/software engineering goal for MVP.', plannedPhase: 'Pilot'
  },
  {
    id: 'pwr-aut', category: 'Power and durability', name: 'Cloudy-day autonomy',
    definition: 'Days of operation without solar charging',
    currentValue: null, target: '> 7 days', status: 'Not Started', evidenceType: 'Provisional Team Target', plannedPhase: 'Pilot'
  },
  {
    id: 'pwr-water', category: 'Power and durability', name: 'Enclosure water ingress',
    definition: 'Occurrences of water reaching internal electronics',
    currentValue: null, target: '0', status: 'Planned', evidenceType: 'Design Target',
    sourceLabel: 'Provisional Team Target',
    rationale: 'Hardware/software engineering goal for MVP.', plannedPhase: 'Pilot'
  },
  {
    id: 'pwr-cond', category: 'Power and durability', name: 'Condensation occurrence',
    definition: 'Instances of condensation obstructing the camera lens',
    currentValue: null, target: '< 1 per month', status: 'Not Started', evidenceType: 'Provisional Team Target', plannedPhase: 'Pilot'
  },
  // Biological safety
  {
    id: 'bio-mech', category: 'Biological safety', name: 'Mechanical containment integrity',
    definition: 'No structural failure allowing adult escape',
    currentValue: null, target: '100%', status: 'Planned', evidenceType: 'Design Target',
    sourceLabel: 'Provisional Team Target',
    rationale: 'Hardware/software engineering goal for MVP.', plannedPhase: 'Lab MVP'
  },
  {
    id: 'bio-esc', category: 'Biological safety', name: 'Zero adult emergence',
    definition: 'Number of adults successfully escaping the trap',
    currentValue: null, target: '0', status: 'Planned', evidenceType: 'Design Target',
    sourceLabel: 'Provisional Team Target',
    rationale: 'Hardware/software engineering goal for MVP.', plannedPhase: 'Lab MVP'
  },
  {
    id: 'bio-mort', category: 'Biological safety', name: 'Egg mortality (experimental)',
    definition: 'Percentage of eggs destroyed by experimental control module',
    currentValue: null, target: '> 95%', status: 'Not Started', evidenceType: 'Provisional Team Target', plannedPhase: 'Lab MVP'
  },
  {
    id: 'bio-corr', category: 'Biological safety', name: 'Corrosion',
    definition: 'Signs of corrosion on internal metal components',
    currentValue: null, target: 'None', status: 'Not Started', evidenceType: 'Design Target',
    sourceLabel: 'Provisional Team Target',
    rationale: 'Hardware/software engineering goal for MVP.', plannedPhase: 'Pilot'
  },
  {
    id: 'bio-fail', category: 'Biological safety', name: 'Fail-safe behavior',
    definition: 'Trap defaults to safe containment on power failure',
    currentValue: null, target: 'Yes', status: 'Planned', evidenceType: 'Design Target',
    sourceLabel: 'Provisional Team Target',
    rationale: 'Hardware/software engineering goal for MVP.', plannedPhase: 'Lab MVP'
  },
  // Risk model
  {
    id: 'risk-lead', category: 'Risk model', name: 'Warning lead time',
    definition: 'Days between alert and onset of localized outbreak',
    currentValue: null, target: '> 14 days', status: 'Not Started', evidenceType: 'Provisional Team Target', plannedPhase: 'Post-Pilot'
  },
  {
    id: 'risk-sens', category: 'Risk model', name: 'Sensitivity',
    definition: 'True positives / (True positives + False negatives) for outbreak prediction',
    currentValue: null, target: '> 80%', status: 'Not Started', evidenceType: 'Provisional Team Target', plannedPhase: 'Post-Pilot'
  },
  {
    id: 'risk-spec', category: 'Risk model', name: 'Specificity',
    definition: 'True negatives / (True negatives + False positives)',
    currentValue: null, target: '> 70%', status: 'Not Started', evidenceType: 'Provisional Team Target', plannedPhase: 'Post-Pilot'
  },
  {
    id: 'risk-fa', category: 'Risk model', name: 'False-alert rate',
    definition: 'Percentage of High/Critical alerts without subsequent cases',
    currentValue: null, target: '< 20%', status: 'Not Started', evidenceType: 'Provisional Team Target', plannedPhase: 'Post-Pilot'
  },
  {
    id: 'risk-cal', category: 'Risk model', name: 'Calibration',
    definition: 'Agreement between predicted probability and observed frequency',
    currentValue: null, target: 'High', status: 'Not Started', evidenceType: 'Provisional Team Target', plannedPhase: 'Post-Pilot'
  },
  {
    id: 'risk-pr', category: 'Risk model', name: 'Precision-recall AUC',
    definition: 'Area under the precision-recall curve',
    currentValue: null, target: '> 0.75', status: 'Not Started', evidenceType: 'Provisional Team Target', plannedPhase: 'Post-Pilot'
  },
  {
    id: 'risk-comp', category: 'Risk model', name: 'Data completeness',
    definition: 'Percentage of required inputs available for calculation',
    currentValue: null, target: '> 90%', status: 'Planned', evidenceType: 'Provisional Team Target', plannedPhase: 'Pilot'
  },
  // Operations
  {
    id: 'op-insp', category: 'Operations', name: 'Alert-to-inspection time',
    definition: 'Average hours from alert generation to on-site inspection',
    currentValue: null, target: '< 48h', status: 'Not Started', evidenceType: 'Design Target',
    sourceLabel: 'Provisional Team Target',
    rationale: 'Hardware/software engineering goal for MVP.', plannedPhase: 'Pilot'
  },
  {
    id: 'op-verif', category: 'Operations', name: 'Percentage of alerts verified',
    definition: 'Percentage of alerts with completed verification records',
    currentValue: null, target: '> 90%', status: 'Not Started', evidenceType: 'Design Target',
    sourceLabel: 'Provisional Team Target',
    rationale: 'Hardware/software engineering goal for MVP.', plannedPhase: 'Pilot'
  },
  {
    id: 'op-comp', category: 'Operations', name: 'Task completion rate',
    definition: 'Percentage of assigned tasks marked as completed',
    currentValue: null, target: '> 95%', status: 'Not Started', evidenceType: 'Design Target',
    sourceLabel: 'Provisional Team Target',
    rationale: 'Hardware/software engineering goal for MVP.', plannedPhase: 'Pilot'
  },
  {
    id: 'op-follow', category: 'Operations', name: 'Follow-up completion',
    definition: 'Percentage of completed actions with a recorded follow-up',
    currentValue: null, target: '> 85%', status: 'Not Started', evidenceType: 'Design Target',
    sourceLabel: 'Provisional Team Target',
    rationale: 'Hardware/software engineering goal for MVP.', plannedPhase: 'Pilot'
  },
  {
    id: 'op-eff', category: 'Operations', name: 'Change in egg activity after action',
    definition: 'Average percentage reduction in egg count post-intervention',
    currentValue: null, target: '> 50%', status: 'Not Started', evidenceType: 'Provisional Team Target', plannedPhase: 'Pilot'
  },
  {
    id: 'op-feed', category: 'Operations', name: 'Officer feedback score',
    definition: 'Average satisfaction rating from vector control officers',
    currentValue: null, target: '> 4/5', status: 'Not Started', evidenceType: 'Design Target',
    sourceLabel: 'Provisional Team Target',
    rationale: 'Hardware/software engineering goal for MVP.', plannedPhase: 'Pilot'
  }
];
