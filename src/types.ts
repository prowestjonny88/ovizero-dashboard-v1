export enum AppScreen {
  COMMAND_CENTER = 'COMMAND_CENTER',
  RISK_MAP = 'RISK_MAP',
  PRIORITY_ZONES = 'PRIORITY_ZONES',
  ZONE_DETAIL = 'ZONE_DETAIL',
  DEVICES = 'DEVICES',
  REPORTS = 'REPORTS',
  EVIDENCE_VALIDATION = 'EVIDENCE_VALIDATION',
  SETTINGS = 'SETTINGS',
}

export interface ZoneData {
  id: string;
  name: string;
  interventionPriority: number; // 0 to 100
  demoPriorityBand: 'Critical' | 'High' | 'Elevated' | 'Watch' | 'Stable';
  eggActivityChange: string; // e.g. "+37%"
  actionRequired: string;
  trigger?: string;
  syntheticEggActivity: number;
  temperature: number;
  humidity: number;
  rainfall: string; // e.g. "+22%"
  
  adultVision: {
    status: 'placeholder';
    label: string;
    owner: 'teammate';
  };
  
  eggVision: {
    status: 'placeholder';
    label: string;
    owner: 'teammate';
  };

  candidateAcousticTrigger?: string;
  
  trendData: number[]; // 7 values for Mon-Sun
  avg7DayTrend: number[]; // 7 values
  whyRising: {
    title: string;
    description: string;
  }[];
  provenance: {
    interventionPriority: 'stored-demo-output';
    eggActivity: 'synthetic-observation';
    temperature: 'simulated-node-input';
    humidity: 'simulated-node-input';
    rainfall: 'external-demo-input';
  };
}





export interface DeviceData {
  id: string;
  location: string;
  battery: number;
  solarStatus: 'Charging' | 'Stable' | 'Low Solar';
  loraSignal: 'Strong' | 'Medium' | 'Weak';
  lastSync: string;
  lastSeenMinutes: number;
  maintenanceState: 'Normal' | 'Maintenance Required';
  diagnostics: {
    power: string;
    solarCell: string;
    optics: string;
    moistureBridge: string;
    electrodeContact: string;
    escapeMesh: string;
    lastImageCapture: string;
  };
}

export type ExportFormat = 'pdf' | 'json';

export interface ReportLogEntry {
  id: string;
  timestamp: string;
  displayTime: string;
  tag: string;
  message: string;
  level: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
}

export interface RiskDistributionSummary {
  critical: number;
  high: number;
  elevated: number;
  watch: number;
}

export interface DeviceHealthSummary {
  total: number;
  lowBattery: number;
  strongSignal: number;
  mediumSignal: number;
  weakSignal: number;
  maintenance: number;
  offline: number;
}

export interface InterventionSummary {
  total: number;
  active: number;
  awaitingVerification: number;
  verified: number;
  noEffect: number;
  escalated: number;
}

export interface DashboardExportPayload {
  generatedAt: string;
  selectedDateRange: string;
  locationLabel: string;
  zones: ZoneData[];
  devices: DeviceData[];
  interventions: InterventionMap;
  reportLogs: ReportLogEntry[];
  summaries: {
    riskDistribution: RiskDistributionSummary;
    deviceHealth: DeviceHealthSummary;
    interventions: InterventionSummary;
    };
}

export interface PilotNodePlacement {
  deviceId: string;
  zoneId: string;
  metricZoneId: string;
  sublocation: string;
  latitude: number;
  longitude: number;
  primaryGatewayId: string;
}

export interface ProposedGateway {
  id: string;
  latitude: number;
  longitude: number;
  stage: 'Proposed' | 'Future';
  illustrativeServiceRadiusMeters?: number;
}

export interface PilotNodeViewModel {
  deviceId: string;
  parentZoneId: string;
  parentZoneName: string;
  sublocation: string;
  latitude: number;
  longitude: number;
  riskProfile: ZoneData;
  device: DeviceData | null;
  gateway: ProposedGateway | null;
  signalQuality: DeviceData['loraSignal'] | 'Not assessed';
  interventionPriority: number;
}

export type MaturityStatus =
  | 'Implemented in Mock UI'
  | 'Simulated'
  | 'Planned'
  | 'Not Started'
  | 'Requires Validation';

export type ImageQualityStatus =
  | 'Good'
  | 'Acceptable'
  | 'Poor'
  | 'Unusable';

export interface EdgeAIEvidenceRecord {
  deviceId: string;
  frameId: string;
  capturedAt: string;
  dataSource: 'Simulated';
  imageQuality: ImageQualityStatus;
  estimatedEggCount: number;
  manualReferenceCount: number | null;
  matchScore: number | null;
  matchScoreStatus: 'Not Calibrated' | 'Unavailable';
  modelStatus: 'Not Trained' | 'Prototype' | 'Validated';
  inferenceTimeMs: number | null;
  firmwareStatus: 'Concept Only' | 'Prototype';
  validationStatus: 'Not Started' | 'In Progress' | 'Completed';
}

export type ContributionLevel = 'High' | 'Moderate' | 'Low' | 'None';

export interface RiskContribution {
  input: string;
  currentCondition: string;
  contribution: ContributionLevel;
  included: boolean;
  note?: string;
}

export interface RiskExplanation {
  zoneId: string;
  scenarioIndex: number;
  riskBand: ZoneData['demoPriorityBand'];
  modelVersion: string;
  calculationType: 'Stored Mock Scenario';
  dataCompleteness: 'Partial' | 'Complete';
  humanReviewStatus: 'Not Reviewed' | 'Reviewed';
  uncertainty: 'High' | 'Moderate' | 'Low';
  lastCalculatedAt: string;
  missingInputs: string[];
  contributions: RiskContribution[];
}

export type ValidationStatus =
  | 'Not Started'
  | 'Planned'
  | 'In Progress'
  | 'Evidence Available';

export type EvidenceType =
  | 'Provisional Team Target'
  | 'Design Target'
  | 'Simulated Output'
  | 'Prototype Result'
  | 'Field-Validated Result'
  | 'Literature Rationale';

export interface ValidationMetric {
  id: string;
  category: string;
  name: string;
  definition: string;
  currentValue: string | null;
  target: string | null;
  status: ValidationStatus;
  evidenceType: EvidenceType;
  owner?: string;
  plannedPhase:
    | 'Lab MVP'
    | 'Connectivity Test'
    | 'Pilot'
    | 'Post-Pilot';
  rationale?: string;
  sourceLabel?: string;
  sourceUrl?: string;
}

export type InterventionStatus =
  | 'New Alert'
  | 'Reviewed'
  | 'Assigned'
  | 'On Site'
  | 'Action Completed'
  | 'Awaiting Verification'
  | 'Activity decreased'
  | 'Little/no change' | 'Activity increased' | 'Not comparable' | 'Inconclusive'
  | 'Escalated';

export type InterventionActionType =
  | 'Source Reduction'
  | 'Drain Inspection'
  | 'Container Removal'
  | 'Larvicide Assessment'
  | 'Resident Notification'
  | 'Targeted Fogging Assessment'
  | 'Other';

export interface InterventionTimelineEvent {
  id: string;
  status: InterventionStatus;
  timestamp: string;
  actor: string;
  note?: string;
}

export interface InterventionRecord {
  id: string;
  zoneId: string;
  status: InterventionStatus;

  createdAt: string;
  reviewerName?: string;
  reviewNote?: string;
  reviewedAt?: string;
  assignedAt?: string;
  onSiteAt?: string;
  actionCompletedAt?: string;
  verificationDueAt?: string;
  closedAt?: string;

  assignedTeam?: string;
  dueDate?: string;
  responseSla?: string;
  actionType?: InterventionActionType;

  findings?: string;
  actionsPerformed?: string;
  inspectionNote?: string;
  arrivalTimestamp?: string;
  simulatedLocationConfirmation?: boolean;
  verificationOwner?: string;
  breedingSitesFound?: number;
  breedingSitesRemoved?: number;
  larvicideAssessed?: boolean;
  residentNotification?: boolean;
  evidenceFilename?: string;
  evidencePhotoName?: string;
  completionNotes?: string;
  supervisorApproval?: string;
  followUpDate?: string;

  timeline: InterventionTimelineEvent[];
}

export type VerificationOutcome =
  | 'Pending'
  | 'Activity decreased'
  | 'Little/no change' | 'Activity increased' | 'Not comparable' | 'Inconclusive'
  | 'Escalated';

export interface ObservationSnapshot {
  recordedAt: string;
  dataSource: 'Simulated' | 'Manual Entry';
  syntheticEggActivity: number | null;
  eggActivityChange: string | null;
  scenarioIndex: number | null;
  riskBand: ZoneData['demoPriorityBand'] | null;
}

export interface InterventionVerification {
  interventionId: string;
  followUpDate: string;
  inspectionCompletedAt?: string;
  inspector?: string;

  before: ObservationSnapshot;
  after?: ObservationSnapshot;

  percentageEggChange?: number;
  inspectionResult?: string;
  evidencePhotoName?: string;
  officerFeedback?: string;
  communityResponse?: string;

  outcome: VerificationOutcome;
  outcomeNote?: string;
}

export interface DeviceMonitoringRecord {
  deviceId: string;
  dataSource: 'Simulated';

  connectivity: {
    gatewayId: string;
    lastPacketAt: string;
    packetDeliveryPct: number | null;
    retryRatePct: number | null;
    offlineDurationMinutes: number;
    queuedPackets: number;
    signalQuality: 'Strong' | 'Medium' | 'Weak';
  };

  power: {
    batteryPct: number;
    solarInputStatus: 'Good' | 'Low' | 'Unavailable';
    solarInputWatts: number | null;
    estimatedDailyEnergyWh: number | null;
    estimatedAutonomyHours: number | null;
    validationStatus: 'Not Validated';
  };

  imaging: {
    focusQuality: 'Good' | 'Acceptable' | 'Poor';
    condensation: 'Clear' | 'Possible' | 'Detected';
    lastValidImageAt: string;
    usableImageRatePct: number | null;
    lensStatus: 'Clear' | 'Needs Inspection';
  };

  maintenance: {
    waterLevel: 'Adequate' | 'Low' | 'Unknown';
    infusionAgeDays: number | null;
    substrateCondition:
      | 'Good'
      | 'Replace Soon'
      | 'Replacement Required'
      | 'Unknown';
    lastCleaningAt: string | null;
    nextServiceAt: string | null;
    ticketStatus:
      | 'None'
      | 'Open'
      | 'Scheduled'
      | 'Resolved';
  };

  biologicalSafety: {
    escapeBarrier: 'Planned' | 'Concept Check';
    adultEscapePrevention: 'Not Validated';
    experimentalEggControl:
      | 'Not Installed'
      | 'Planned Lab Test'
      | 'Disabled';
  };
}

export type InterventionMap = Record<string, InterventionRecord>;
export type InterventionVerificationMap = Record<string, InterventionVerification>;

export interface InterventionTransitionPayload {
  reviewerName?: string;
  reviewNote?: string;
  assignedTeam?: string;
  actionType?: InterventionActionType;
  dueDate?: string;
  responseSla?: string;
  arrivalTimestamp?: string;
  simulatedLocationConfirmation?: boolean;
  inspectionNote?: string;
  findings?: string;
  actionsPerformed?: string;
  completionNotes?: string;
  followUpDate?: string;
  verificationOutcome?: VerificationOutcome;
  verificationOwner?: string;
  evidenceFilename?: string;
}
