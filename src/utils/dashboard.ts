import { PilotNodeViewModel, PilotNodePlacement, ProposedGateway } from '../types';
import { PILOT_NODES } from '../data';

import { 
  ZoneData, 
  DeviceData, 
  InterventionMap, 
  RiskDistributionSummary, 
  DeviceHealthSummary, 
  InterventionSummary, 
  InterventionRecord,
  DashboardExportPayload,
  ReportLogEntry
} from '../types';

export const DEMO_SNAPSHOT_AT = '2026-08-05T08:36:00+08:00';

export const DEMO_CONFIG = {
  nodeCount: 5,
  gatewayCount: 1,
};

export const getDeviceForMetricZone = (
  zoneId: string,
  placements: import('../types').PilotNodePlacement[],
  devices: import('../types').DeviceData[]
): import('../types').DeviceData | null => {
  const placement =
    placements.find(p => p.metricZoneId === zoneId) ??
    placements.find(p => p.zoneId === zoneId);

  return placement
    ? devices.find(d => d.id === placement.deviceId) ?? null
    : null;
};

export const getPilotDisplayLocationForMetricZone = (
  metricZoneId: string,
  placements: import('../types').PilotNodePlacement[],
  zones: import('../types').ZoneData[]
): { parentZone: string; sublocation: string; deviceId: string } | null => {
  const placement = placements.find(p => p.metricZoneId === metricZoneId);
  if (!placement) return null;
  const parentZone = zones.find(z => z.id === placement.zoneId);
  return {
    parentZone: parentZone ? parentZone.name : 'Unknown Zone',
    sublocation: placement.sublocation,
    deviceId: placement.deviceId
  };
};

export const getPilotDisplayLocationForDevice = (
  deviceId: string,
  placements: import('../types').PilotNodePlacement[]
): string | null => {
  const placement = placements.find(p => p.deviceId === deviceId);
  return placement ? `Illustrative scenario · ${placement.sublocation}` : null;
};

export interface ZoneNodeMeta {
  zoneId: string;
  nodeId: string;
  lat: string;
  lng: string;
  gateway: string;
  x: number;
  y: number;
}

export const ZONE_NODE_META: ZoneNodeMeta[] = [
  { zoneId: 'north-residential-block', lat: "3°08'52\"N", lng: "101°41'12\"E", nodeId: 'OZ-041', gateway: 'GW-01', x: 30, y: 25 },
  { zoneId: 'drain-corridor', lat: "3°08'41\"N", lng: "101°41'58\"E", nodeId: 'OZ-052', gateway: 'GW-01', x: 75, y: 30 },
  { zoneId: 'community-courtyard', lat: "3°08'09\"N", lng: "101°41'02\"E", nodeId: 'OZ-018', gateway: 'GW-01', x: 22, y: 58 },
  { zoneId: 'playground-area', lat: "3°07'55\"N", lng: "101°41'42\"E", nodeId: 'OZ-077', gateway: 'GW-01', x: 65, y: 65 },
  { zoneId: 'community-hall', lat: "3°07'22\"N", lng: "101°41'15\"E", nodeId: 'OZ-099', gateway: 'GW-01', x: 42, y: 85 },
];

export const ZONE_NODE_MAP: Record<string, ZoneNodeMeta> = ZONE_NODE_META.reduce((acc, curr) => {
  acc[curr.zoneId] = curr;
  return acc;
}, {} as Record<string, ZoneNodeMeta>);


export const getTopPriorityZones = (zones: ZoneData[], limit: number): ZoneData[] => {
  return [...zones].sort((a, b) => b.interventionPriority - a.interventionPriority).slice(0, limit);
};

export const getRiskDistribution = (zones: ZoneData[]): RiskDistributionSummary => {
  return {
    critical: zones.filter(z => z.demoPriorityBand === 'Critical').length,
    high: zones.filter(z => z.demoPriorityBand === 'High').length,
    elevated: zones.filter(z => z.demoPriorityBand === 'Elevated').length,
    watch: zones.filter(z => z.demoPriorityBand === 'Watch' || z.demoPriorityBand === 'Stable').length,
  };
};

export const getDeviceHealthSummary = (devices: DeviceData[]): DeviceHealthSummary => {
  return {
    total: devices.length,
    lowBattery: devices.filter(d => d.battery < 25).length,
    strongSignal: devices.filter(d => d.loraSignal === 'Strong').length,
    mediumSignal: devices.filter(d => d.loraSignal === 'Medium').length,
    weakSignal: devices.filter(d => d.loraSignal === 'Weak').length,
    maintenance: devices.filter(d => d.maintenanceState === 'Maintenance Required').length,
    offline: devices.filter(d => d.lastSeenMinutes > 1440).length,
  };
};

export const parseEggVelocity = (value: string): number => {
  return parseInt(value.replace(/[^0-9-]/g, '')) || 0;
};

export const getTrendBucket = (value: string): 'Rapid' | 'Moderate' | 'Stable' => {
  const num = parseEggVelocity(value);
  if (num >= 25) return 'Rapid';
  if (num >= 10) return 'Moderate';
  return 'Stable';
};



export const getInterventionForZone = (zoneId: string, interventions: InterventionMap): InterventionRecord | null => {
  return interventions[zoneId] || null;
};

export const getInterventionSummary = (interventions: InterventionMap): InterventionSummary => {
  const vals = Object.values(interventions);
  const activeStatuses = ['New Alert', 'Reviewed', 'Assigned', 'On Site', 'Action Completed'];
  return {
    total: vals.length,
    active: vals.filter(i => activeStatuses.includes(i.status)).length,
    awaitingVerification: vals.filter(i => i.status === 'Awaiting Verification').length,
    verified: vals.filter(i => i.status === 'Activity decreased').length,
    noEffect: vals.filter(i => i.status === 'Little/no change').length,
    escalated: vals.filter(i => i.status === 'Escalated').length,
  };
};


export const formatLogDisplayTime = (timestamp: string): string => {
  const d = new Date(timestamp);
  const now = new Date();
  
  const isToday = d.getDate() === now.getDate() && 
                  d.getMonth() === now.getMonth() && 
                  d.getFullYear() === now.getFullYear();
  
  if (isToday) {
    return `Today, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + 
         ', ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const buildReportLogs = (
  
  zones: ZoneData[],
  interventions: InterventionMap,
  
): ReportLogEntry[] => {

  const interventionLogs: ReportLogEntry[] = [];
  Object.entries(interventions).forEach(([zoneId, inv]) => {
    const zone = zones.find(z => z.id === zoneId);
    let displayName = zone?.name || zoneId;
    if (zone) {
      const loc = getPilotDisplayLocationForMetricZone(zone.id, PILOT_NODES, zones);
      if (loc) {
        displayName = `${loc.parentZone} · ${loc.sublocation}`;
      }
    }
    
    let message = '';
    let timestamp = inv.createdAt;
    let level: 'SUCCESS' | 'WARNING' | 'INFO' | 'ERROR' = 'INFO';
    
    switch (inv.status) {
      case 'New Alert':
        message = `Simulated intervention alert created for ${displayName}.`;
        timestamp = inv.createdAt;
        break;
      case 'Reviewed':
        message = `Simulated intervention alert reviewed by ${inv.reviewerName || 'Reviewer'}.`;
        timestamp = inv.reviewedAt || inv.createdAt;
        break;
      case 'Assigned':
        message = `Simulated task assigned to ${inv.assignedTeam || 'Vector Control Team'} for ${displayName}.`;
        timestamp = inv.assignedAt || inv.createdAt;
        break;
      case 'On Site':
        message = `Simulated field-team status updated to On Site for ${displayName}.`;
        timestamp = inv.onSiteAt || inv.assignedAt || inv.createdAt;
        break;
      case 'Action Completed':
        message = `Simulated action record marked Action Completed for ${displayName}; follow-up verification is still required.`;
        timestamp = inv.actionCompletedAt || inv.assignedAt || inv.createdAt;
        break;
      case 'Awaiting Verification':
        message = `Simulated action record is awaiting follow-up verification.`;
        timestamp = inv.actionCompletedAt || inv.assignedAt || inv.createdAt;
        break;
      case 'Activity decreased':
        message = `Simulated follow-up outcome recorded: Activity decreased.`;
        timestamp = inv.closedAt || inv.createdAt;
        level = 'SUCCESS';
        break;
      case 'Little/no change':
        message = `Simulated follow-up outcome recorded: Little/no change.`;
        timestamp = inv.closedAt || inv.createdAt;
        level = 'WARNING';
        break;
      case 'Escalated':
        message = `Simulated follow-up outcome recorded: Escalated.`;
        timestamp = inv.closedAt || inv.createdAt;
        level = 'ERROR';
        break;
    }
    
    if (message) {
      interventionLogs.push({
        id: `inv-${inv.status.replace(/\s+/g, '-').toLowerCase()}-${zoneId}`,
        timestamp: timestamp,
        displayTime: formatLogDisplayTime(timestamp),
        tag: 'INTERVENTION',
        message: message,
        level: level
      });
    }
  });

  let staticLogs: ReportLogEntry[] = [];
  const snapshotDate = new Date(DEMO_SNAPSHOT_AT);
  
  const getDemoPastISO = (days: number, hours: number) => {
    return new Date(snapshotDate.getTime() - days * 86400000 - hours * 3600000).toISOString();
  };

  if (true) {
    staticLogs = [
      { id: 'log-7d-1', timestamp: getDemoPastISO(0, 4), displayTime: '', tag: 'UI MOCK', message: 'Mock OZ-041 profile loaded with an illustrative egg-count value of 127.', level: 'INFO' },
      { id: 'log-7d-2', timestamp: getDemoPastISO(2, 6), displayTime: '', tag: 'UI MOCK', message: 'OZ-077 simulated maintenance scenario flags low battery and weak signal.', level: 'WARNING' },
      { id: 'log-7d-3', timestamp: getDemoPastISO(3, 8), displayTime: '', tag: 'UI MOCK', message: 'Proposed LoRaWAN packet schema displayed for demonstration.', level: 'INFO' },
      { id: 'log-7d-4', timestamp: getDemoPastISO(4, 1), displayTime: '', tag: 'UI MOCK', message: 'Illustrative acoustic candidate value displayed; classifier not trained.', level: 'INFO' },
      { id: 'log-7d-5', timestamp: getDemoPastISO(5, 2), displayTime: '', tag: 'UI MOCK', message: 'Simulated intervention record created in the current session.', level: 'INFO' }
    ];
    staticLogs = [
    ];
  } else {
    staticLogs = [
    ];
  }

  staticLogs = staticLogs.map(log => ({ ...log, displayTime: formatLogDisplayTime(log.timestamp) }));

  return [...interventionLogs, ...staticLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const buildDashboardExportPayload = (
  
  zones: ZoneData[],
  devices: DeviceData[],
  interventions: InterventionMap,
  locationLabel = 'Illustrative residential-community scenario'
): DashboardExportPayload => {
  return {
    generatedAt: new Date().toISOString(),
    
    locationLabel,
    zones,
    devices,
    interventions,
    reportLogs: buildReportLogs( zones, interventions),
    summaries: {
      riskDistribution: getRiskDistribution(zones),
      deviceHealth: getDeviceHealthSummary(devices),
      interventions: getInterventionSummary(interventions)
    }
  };
};


export const buildPilotNodeViewModels = (
  pilotNodes: PilotNodePlacement[],
  zones: ZoneData[],
  devices: DeviceData[],
  gateways: ProposedGateway[]
): PilotNodeViewModel[] => {
  return pilotNodes.map(node => {
    const parentZone = zones.find(z => z.id === node.zoneId);
    const riskProfile = zones.find(z => z.id === node.metricZoneId);
    const device = devices.find(d => d.id === node.deviceId) ?? null;
    const gateway = gateways.find(g => g.id === node.primaryGatewayId) ?? null;

    return {
      deviceId: node.deviceId,
      parentZoneId: parentZone?.id ?? 'unknown-zone',
      parentZoneName: parentZone?.name ?? 'Unknown Zone',
      sublocation: node.sublocation,
      latitude: node.latitude,
      longitude: node.longitude,
      riskProfile: riskProfile!,
      device,
      gateway,
      signalQuality: device ? device.loraSignal : 'Not assessed',
      interventionPriority: riskProfile?.interventionPriority ?? 0
    } as PilotNodeViewModel;
  }).filter(vm => vm.riskProfile !== undefined);
};

export const getRiskColor = (status: string) => {
  switch (status) {
    case 'Critical': return '#fee2e2';
    case 'High': return '#ffedd5';
    case 'Elevated': return '#fef3c7';
    case 'Watch':
    case 'Stable': return '#dcfce7';
    default: return '#f3f4f6';
  }
};

export const getRiskBorderColor = (status: string) => {
  switch (status) {
    case 'Critical': return '#dc2626';
    case 'High': return '#ea580c';
    case 'Elevated': return '#d97706';
    case 'Watch':
    case 'Stable': return '#16a34a';
    default: return '#9ca3af';
  }
};
