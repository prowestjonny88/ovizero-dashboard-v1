import json
import re

content = """import { ZoneData, DeviceData, PilotNodePlacement, ProposedGateway } from './types';

export const ZONES: ZoneData[] = [
  {
    id: 'north-residential-block',
    name: 'North residential block',
    interventionPriority: 91,
    demoPriorityBand: 'Critical',
    eggActivityChange: '+37%',
    actionRequired: 'Review nearby breeding sources and assign a field assessment.',
    trigger: 'Humidity spike + egg count rise',
    syntheticEggActivity: 127,
    temperature: 32.1,
    humidity: 84,
    rainfall: '+28%',
    adultVision: {
      status: 'placeholder',
      label: 'Integration pending',
      owner: 'teammate'
    },
    eggVision: {
      status: 'placeholder',
      label: 'Integration pending',
      owner: 'teammate'
    },
    candidateAcousticTrigger: '497 Hz (Simulated)',
    trendData: [64, 72, 81, 93, 105, 119, 127],
    avg7DayTrend: [60, 65, 71, 78, 86, 95, 104],
    whyRising: [
      {
        title: 'Rapid Egg Accumulation',
        description: 'Simulated data reflects a +37% increase in synthetic egg activity over the last 7 days.'
      },
      {
        title: 'Illustrative Acoustic Match',
        description: 'Simulated signal pattern is consistent with a candidate wingbeat frequency, requiring future field validation.'
      },
      {
        title: 'Optimal Incubation Climate',
        description: 'Sustained high humidity following localized rainfall creates a proposed site-risk assumption for rapid larval development.'
      }
    ],
    predictions: {
      next3Days: 'Elevated',
      next7Days: 'High'
    },
    provenance: {
      interventionPriority: 'stored-demo-output',
      eggActivity: 'synthetic-observation',
      temperature: 'simulated-node-input',
      humidity: 'simulated-node-input',
      rainfall: 'external-demo-input'
    }
  },
  {
    id: 'drain-corridor',
    name: 'Drain corridor',
    interventionPriority: 87,
    demoPriorityBand: 'High',
    eggActivityChange: '+28%',
    actionRequired: 'Review nearby breeding sources and assign a field assessment.',
    syntheticEggActivity: 102,
    temperature: 31.8,
    humidity: 86,
    rainfall: '+15%',
    adultVision: {
      status: 'placeholder',
      label: 'Integration pending',
      owner: 'teammate'
    },
    eggVision: {
      status: 'placeholder',
      label: 'Integration pending',
      owner: 'teammate'
    },
    candidateAcousticTrigger: '492 Hz (Simulated)',
    trendData: [55, 62, 70, 78, 85, 94, 102],
    avg7DayTrend: [52, 58, 63, 69, 75, 82, 89],
    whyRising: [
      {
        title: 'Blockage and Pooling',
        description: 'Simulated urban layout suggests structural blockages encouraging continuous stagnant water pools.'
      }
    ],
    predictions: {
      next3Days: 'Elevated',
      next7Days: 'High'
    },
    provenance: {
      interventionPriority: 'stored-demo-output',
      eggActivity: 'synthetic-observation',
      temperature: 'simulated-node-input',
      humidity: 'simulated-node-input',
      rainfall: 'external-demo-input'
    }
  },
  {
    id: 'community-courtyard',
    name: 'Community courtyard',
    interventionPriority: 82,
    demoPriorityBand: 'High',
    eggActivityChange: '+21%',
    actionRequired: 'Review nearby breeding sources and assign a field assessment.',
    syntheticEggActivity: 88,
    temperature: 31.5,
    humidity: 83,
    rainfall: '+20%',
    adultVision: {
      status: 'placeholder',
      label: 'Integration pending',
      owner: 'teammate'
    },
    eggVision: {
      status: 'placeholder',
      label: 'Integration pending',
      owner: 'teammate'
    },
    candidateAcousticTrigger: '495 Hz (Simulated)',
    trendData: [45, 52, 59, 68, 74, 82, 88],
    avg7DayTrend: [40, 46, 51, 57, 63, 69, 75],
    whyRising: [
      {
        title: 'Waste Management Spillage',
        description: 'Proposed site-risk assumption of market water discharge points accumulating stagnant runoffs.'
      }
    ],
    predictions: {
      next3Days: 'Stable',
      next7Days: 'Elevated'
    },
    provenance: {
      interventionPriority: 'stored-demo-output',
      eggActivity: 'synthetic-observation',
      temperature: 'simulated-node-input',
      humidity: 'simulated-node-input',
      rainfall: 'external-demo-input'
    }
  },
  {
    id: 'playground-area',
    name: 'Playground area',
    interventionPriority: 74,
    demoPriorityBand: 'Elevated',
    eggActivityChange: '+14%',
    actionRequired: 'Review nearby breeding sources and assign a field assessment.',
    syntheticEggActivity: 69,
    temperature: 31.2,
    humidity: 79,
    rainfall: '+10%',
    adultVision: {
      status: 'placeholder',
      label: 'Integration pending',
      owner: 'teammate'
    },
    eggVision: {
      status: 'placeholder',
      label: 'Integration pending',
      owner: 'teammate'
    },
    candidateAcousticTrigger: '489 Hz (Simulated)',
    trendData: [38, 42, 49, 53, 58, 64, 69],
    avg7DayTrend: [35, 39, 43, 47, 51, 56, 61],
    whyRising: [
      {
        title: 'Low Battery Node Warning',
        description: 'Simulated OZ-077 battery drops to 22%, causing a theoretical delay in diagnostics. Physical inspection proposed.'
      }
    ],
    predictions: {
      next3Days: 'Stable',
      next7Days: 'Elevated'
    },
    provenance: {
      interventionPriority: 'stored-demo-output',
      eggActivity: 'synthetic-observation',
      temperature: 'simulated-node-input',
      humidity: 'simulated-node-input',
      rainfall: 'external-demo-input'
    }
  },
  {
    id: 'community-hall',
    name: 'Community hall',
    interventionPriority: 63,
    demoPriorityBand: 'Watch',
    eggActivityChange: '+5%',
    actionRequired: 'Review nearby breeding sources and assign a field assessment.',
    syntheticEggActivity: 41,
    temperature: 30.8,
    humidity: 77,
    rainfall: '+5%',
    adultVision: {
      status: 'placeholder',
      label: 'Integration pending',
      owner: 'teammate'
    },
    eggVision: {
      status: 'placeholder',
      label: 'Integration pending',
      owner: 'teammate'
    },
    candidateAcousticTrigger: '485 Hz (Simulated)',
    trendData: [24, 28, 30, 33, 36, 39, 41],
    avg7DayTrend: [22, 25, 27, 29, 32, 35, 38],
    whyRising: [
      {
        title: 'Ornamental Pond Seep',
        description: 'Simulated school courtyard garden features an slow-dripping ornamental structure with minor peripheral pools.'
      }
    ],
    predictions: {
      next3Days: 'Stable',
      next7Days: 'Watch'
    },
    provenance: {
      interventionPriority: 'stored-demo-output',
      eggActivity: 'synthetic-observation',
      temperature: 'simulated-node-input',
      humidity: 'simulated-node-input',
      rainfall: 'external-demo-input'
    }
  }
];

export const DEVICES: DeviceData[] = [
  {
    id: 'OZ-041',
    location: 'North residential block',
    battery: 86,
    solarStatus: 'Charging',
    loraSignal: 'Strong',
    lastSync: '4 min ago',
    lastSeenMinutes: 4,
    maintenanceState: 'Normal',
    diagnostics: {
      power: '86% / Charging',
      solarCell: 'Active',
      optics: 'Active',
      moistureBridge: 'OK',
      electrodeContact: 'OK',
      escapeMesh: 'Intact',
      lastImageCapture: 'Trigger-based'
    }
  },
  {
    id: 'OZ-052',
    location: 'Drain corridor',
    battery: 73,
    solarStatus: 'Charging',
    loraSignal: 'Strong',
    lastSync: '8 min ago',
    lastSeenMinutes: 8,
    maintenanceState: 'Normal',
    diagnostics: {
      power: '73% / Charging',
      solarCell: 'Active',
      optics: 'Active',
      moistureBridge: 'OK',
      electrodeContact: 'OK',
      escapeMesh: 'Intact',
      lastImageCapture: 'Trigger-based'
    }
  },
  {
    id: 'OZ-018',
    location: 'Community courtyard',
    battery: 61,
    solarStatus: 'Stable',
    loraSignal: 'Medium',
    lastSync: '12 min ago',
    lastSeenMinutes: 12,
    maintenanceState: 'Normal',
    diagnostics: {
      power: '61% / Stable',
      solarCell: 'Active',
      optics: 'Active',
      moistureBridge: 'OK',
      electrodeContact: 'OK',
      escapeMesh: 'Intact',
      lastImageCapture: 'Trigger-based'
    }
  },
  {
    id: 'OZ-077',
    location: 'Playground area',
    battery: 22,
    solarStatus: 'Low Solar',
    loraSignal: 'Weak',
    lastSync: '31 min ago',
    lastSeenMinutes: 31,
    maintenanceState: 'Maintenance Required',
    diagnostics: {
      power: '22% / Low Battery',
      solarCell: 'Low Input',
      optics: 'Active',
      moistureBridge: 'OK',
      electrodeContact: 'Attention Required',
      escapeMesh: 'Intact',
      lastImageCapture: 'Trigger-based'
    }
  },
  {
    id: 'OZ-099',
    location: 'Community hall',
    battery: 92,
    solarStatus: 'Charging',
    loraSignal: 'Strong',
    lastSync: '6 min ago',
    lastSeenMinutes: 6,
    maintenanceState: 'Normal',
    diagnostics: {
      power: '92% / Charging',
      solarCell: 'Active',
      optics: 'Active',
      moistureBridge: 'OK',
      electrodeContact: 'OK',
      escapeMesh: 'Intact',
      lastImageCapture: 'Trigger-based'
    }
  }
];

export const PILOT_NODES: PilotNodePlacement[] = [
  { deviceId: 'OZ-041', zoneId: 'north-residential-block', metricZoneId: 'north-residential-block', sublocation: 'North residential block', latitude: 3.0845, longitude: 101.7380, primaryGatewayId: 'GW-01' },
  { deviceId: 'OZ-052', zoneId: 'drain-corridor', metricZoneId: 'drain-corridor', sublocation: 'Drain corridor', latitude: 3.0837, longitude: 101.7390, primaryGatewayId: 'GW-01' },
  { deviceId: 'OZ-018', zoneId: 'community-courtyard', metricZoneId: 'community-courtyard', sublocation: 'Community courtyard', latitude: 3.0838, longitude: 101.7370, primaryGatewayId: 'GW-01' },
  { deviceId: 'OZ-077', zoneId: 'playground-area', metricZoneId: 'playground-area', sublocation: 'Playground area', latitude: 3.0828, longitude: 101.7388, primaryGatewayId: 'GW-01' },
  { deviceId: 'OZ-099', zoneId: 'community-hall', metricZoneId: 'community-hall', sublocation: 'Community hall', latitude: 3.0830, longitude: 101.7375, primaryGatewayId: 'GW-01' }
];

export const PROPOSED_GATEWAYS: ProposedGateway[] = [
  { id: 'GW-01', latitude: 3.0850, longitude: 101.7395, stage: 'Proposed' },
];
"""
with open('src/data.ts', 'w') as f:
    f.write(content)

print("rewrote data.ts")
