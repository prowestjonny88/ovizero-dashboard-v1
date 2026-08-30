import { ZoneData, DeviceData, PilotNodePlacement, ProposedGateway } from './types';

export const ZONES: ZoneData[] = [
  {
    id: 'ppr-seri-anggerik',
    name: 'PPR Seri Anggerik',
    risk: 91,
    status: 'Critical',
    eggVelocity: '+48%',
    actionRequired: 'Source reduction within 48h',
    trigger: 'Humidity spike + egg count rise',
    aedesConfidence: 94,
    wingbeatMatch: 497,
    eggCount: 127,
    species: 'Illustrative candidate signal — not classified',
    temperature: 32.1,
    humidity: 84,
    rainfall: '+28%',
    hatchingRate: 'High',
    trendData: [64, 72, 81, 93, 105, 119, 127],
    avg7DayTrend: [60, 65, 71, 78, 86, 95, 104],
    whyRising: [
      {
        title: 'Rapid Egg Accumulation',
        description: 'Simulated data reflects a +48% increase in egg count over the last 72 hours, deviating from historical baselines.'
      },
      {
        title: 'Illustrative Acoustic Match',
        description: 'Simulated signal pattern is consistent with an Aedes candidate wingbeat frequency, requiring future field validation.'
      },
      {
        title: 'Optimal Incubation Climate',
        description: 'Sustained high humidity following localized rainfall creates a proposed site-risk assumption for rapid larval development.'
      }
    ],
    predictions: {
      next3Days: 'Elevated',
      next7Days: 'High',
      adultEmergence: '6-9 days',
      actionWindow: '48 hours'
    }
  },
  {
    id: 'block-c-taman-muda',
    name: 'Block C, Taman Muda',
    risk: 87,
    status: 'High',
    eggVelocity: '+39%',
    actionRequired: 'Drain inspection',
    trigger: 'Temperature rise + stagnant pools',
    aedesConfidence: 96,
    wingbeatMatch: 492,
    eggCount: 102,
    species: 'Illustrative candidate signal — not classified',
    temperature: 31.9,
    humidity: 81,
    rainfall: '+15%',
    hatchingRate: 'High',
    trendData: [55, 62, 70, 78, 85, 94, 102],
    avg7DayTrend: [52, 58, 63, 69, 75, 82, 89],
    whyRising: [
      {
        title: 'Blockage and Pooling',
        description: 'Simulated urban layout suggests structural blockages in drainage Block C, encouraging continuous stagnant water pools.'
      },
      {
        title: 'Illustrative Acoustic Match',
        description: 'Simulated candidate profile indicates acoustic matches for female Aedes wingbeats above the action threshold.'
      },
      {
        title: 'Hatching Acceleration',
        description: 'High day-to-night heat retention in high-density asphalt zones proposes a larval development rate acceleration.'
      }
    ],
    predictions: {
      next3Days: 'Elevated',
      next7Days: 'High',
      adultEmergence: '7-10 days',
      actionWindow: '72 hours'
    }
  },
  {
    id: 'market-zone-4',
    name: 'Market Zone 4',
    risk: 82,
    status: 'High',
    eggVelocity: '+31%',
    actionRequired: 'Community alert',
    trigger: 'Humidity spike + egg count rise',
    aedesConfidence: 91,
    wingbeatMatch: 495,
    eggCount: 88,
    species: 'Illustrative candidate signal — not classified',
    temperature: 31.5,
    humidity: 83,
    rainfall: '+20%',
    hatchingRate: 'Elevated',
    trendData: [45, 52, 59, 68, 74, 82, 88],
    avg7DayTrend: [40, 46, 51, 57, 63, 69, 75],
    whyRising: [
      {
        title: 'Waste Management Spillage',
        description: 'Proposed site-risk assumption of market water discharge points accumulating stagnant runoffs.'
      },
      {
        title: 'Illustrative Acoustic Match',
        description: 'Simulated candidate profile shows patterns matching Aedes albopictus breeding activity.'
      },
      {
        title: 'Sustained Relative Humidity',
        description: 'Moist canopies around market storage bays keep simulated ambient humidity extremely high, protecting egg viability.'
      }
    ],
    predictions: {
      next3Days: 'Stable',
      next7Days: 'Elevated',
      adultEmergence: '8-11 days',
      actionWindow: '72 hours'
    }
  },
  {
    id: 'flat-sri-murni',
    name: 'Flat Sri Murni',
    risk: 74,
    status: 'Elevated',
    eggVelocity: '+24%',
    actionRequired: 'Inspect waste collection',
    trigger: 'Elevated water bridge moisture',
    aedesConfidence: 89,
    wingbeatMatch: 489,
    eggCount: 69,
    species: 'Illustrative candidate signal — not classified',
    temperature: 31.2,
    humidity: 79,
    rainfall: '+10%',
    hatchingRate: 'Elevated',
    trendData: [38, 42, 49, 53, 58, 64, 69],
    avg7DayTrend: [35, 39, 43, 47, 51, 56, 61],
    whyRising: [
      {
        title: 'Trash Chute Stagnancy',
        description: 'Simulated environment indicates inadequate trash collection drainage leaving minor pools of nutrient-rich water.'
      },
      {
        title: 'Low Battery Node Warning',
        description: 'Simulated OZ-077 battery drops to 22%, causing a theoretical delay in diagnostics. Physical inspection proposed.'
      },
      {
        title: 'Climate Micro-climate Shift',
        description: 'Elevated humidity in ground floor crevices is proposed as encouraging mosquito resting spots.'
      }
    ],
    predictions: {
      next3Days: 'Stable',
      next7Days: 'Elevated',
      adultEmergence: '9-12 days',
      actionWindow: '96 hours'
    }
  },
  {
    id: 'school-zone-2',
    name: 'School Zone 2',
    risk: 63,
    status: 'Watch',
    eggVelocity: '+15%',
    actionRequired: 'Container cleanup sweep',
    trigger: 'Localized pooling from school garden',
    aedesConfidence: 87,
    wingbeatMatch: 485,
    eggCount: 41,
    species: 'Illustrative candidate signal — not classified',
    temperature: 30.8,
    humidity: 77,
    rainfall: '+5%',
    hatchingRate: 'Watch',
    trendData: [24, 28, 30, 33, 36, 39, 41],
    avg7DayTrend: [22, 25, 27, 29, 32, 35, 38],
    whyRising: [
      {
        title: 'Ornamental Pond Seep',
        description: 'Simulated school courtyard garden features an slow-dripping ornamental structure with minor peripheral pools.'
      },
      {
        title: 'Illustrative Egg Count',
        description: 'Simulated larval count indicates mid-range clustering inside drainage inlets.'
      },
      {
        title: 'Illustrative Acoustic Match',
        description: 'Isolated candidate signals indicate an early-stage breeding network forming theoretically near playgrounds.'
      }
    ],
    predictions: {
      next3Days: 'Stable',
      next7Days: 'Watch',
      adultEmergence: '10-14 days',
      actionWindow: '120 hours'
    }
  }
];

export const DEVICES: DeviceData[] = [
  {
    id: 'OZ-041',
    location: 'PPR Seri Anggerik',
    riskScore: 91,
    battery: 86,
    solarStatus: 'Charging',
    loraSignal: 'Strong',
    lastSync: '4 min ago',
    lastSeenMinutes: 4,
    eggCount: 127,
    aedesConfidence: 94,
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
    location: 'PPR Seri Anggerik',
    riskScore: 87,
    battery: 73,
    solarStatus: 'Charging',
    loraSignal: 'Strong',
    lastSync: '8 min ago',
    lastSeenMinutes: 8,
    eggCount: 102,
    aedesConfidence: 96,
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
    location: 'PPR Seri Anggerik',
    riskScore: 82,
    battery: 61,
    solarStatus: 'Stable',
    loraSignal: 'Medium',
    lastSync: '12 min ago',
    lastSeenMinutes: 12,
    eggCount: 88,
    aedesConfidence: 91,
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
    location: 'PPR Seri Anggerik',
    riskScore: 74,
    battery: 22,
    solarStatus: 'Low Solar',
    loraSignal: 'Weak',
    lastSync: '31 min ago',
    lastSeenMinutes: 31,
    eggCount: 69,
    aedesConfidence: 89,
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
    location: 'PPR Seri Anggerik',
    riskScore: 63,
    battery: 92,
    solarStatus: 'Charging',
    loraSignal: 'Strong',
    lastSync: '6 min ago',
    lastSeenMinutes: 6,
    eggCount: 41,
    aedesConfidence: 87,
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
  { deviceId: 'OZ-041', zoneId: 'ppr-seri-anggerik', metricZoneId: 'ppr-seri-anggerik', sublocation: 'North residential block', latitude: 3.0845, longitude: 101.7380, primaryGatewayId: 'GW-01' },
  { deviceId: 'OZ-018', zoneId: 'ppr-seri-anggerik', metricZoneId: 'market-zone-4', sublocation: 'Courtyard', latitude: 3.0838, longitude: 101.7370, primaryGatewayId: 'GW-01' },
  { deviceId: 'OZ-052', zoneId: 'ppr-seri-anggerik', metricZoneId: 'block-c-taman-muda', sublocation: 'Drain corridor', latitude: 3.0837, longitude: 101.7390, primaryGatewayId: 'GW-01' },
  { deviceId: 'OZ-099', zoneId: 'ppr-seri-anggerik', metricZoneId: 'school-zone-2', sublocation: 'Community hall', latitude: 3.0830, longitude: 101.7375, primaryGatewayId: 'GW-01' },
  { deviceId: 'OZ-077', zoneId: 'ppr-seri-anggerik', metricZoneId: 'flat-sri-murni', sublocation: 'Playground', latitude: 3.0828, longitude: 101.7388, primaryGatewayId: 'GW-01' }
];

export const PROPOSED_GATEWAYS: ProposedGateway[] = [
  { id: 'GW-01', latitude: 3.0850, longitude: 101.7395, stage: 'Proposed', illustrativeServiceRadiusMeters: 300 },
];
