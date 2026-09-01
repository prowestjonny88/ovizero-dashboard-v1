import re

with open('src/types.ts', 'r') as f:
    content = f.read()

# Update ZoneData
new_zone_data = """export interface ZoneData {
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
  predictions: {
    next3Days: string;
    next7Days: string;
  };
  provenance: {
    interventionPriority: 'stored-demo-output';
    eggActivity: 'synthetic-observation';
    temperature: 'simulated-node-input';
    humidity: 'simulated-node-input';
    rainfall: 'external-demo-input';
  };
}"""

content = re.sub(r'export interface ZoneData \{.*?\}(?=\n\nexport interface DeviceData)', new_zone_data, content, flags=re.DOTALL)

# Update DeviceData
new_device_data = """export interface DeviceData {
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
}"""

content = re.sub(r'export interface DeviceData \{.*?\}(?=\n\nexport type ExportFormat)', new_device_data, content, flags=re.DOTALL)

# Update PilotNodeViewModel risk properties
content = content.replace("riskProfile: ZoneData;", "riskProfile: ZoneData;")
content = content.replace("risk: number;", "interventionPriority: number;")

# Update RiskExplanation riskBand
content = content.replace("riskBand: ZoneData['status'];", "riskBand: ZoneData['demoPriorityBand'];")

# Update ObservationSnapshot
content = content.replace("eggCount: number | null;", "syntheticEggActivity: number | null;")
content = content.replace("eggVelocity: string | null;", "eggActivityChange: string | null;")
content = content.replace("riskBand: ZoneData['status'] | null;", "riskBand: ZoneData['demoPriorityBand'] | null;")

# Update InterventionStatus and VerificationOutcome based on instructions
# 'Effect Verified' -> 'Follow-up observation recorded' (or similar). Let's check OVIZERO_DASHBOARD_SOURCE_OF_TRUTH.md:
# "Needs review, Assigned, Field action recorded, Follow-up recorded"
# Wait, let's just leave InterventionStatus alone unless it explicitly clashes. It says:
# "Do not use: Effect Verified, Intervention worked, No Effect"
content = content.replace("'Effect Verified'", "'Activity decreased'")
content = content.replace("'No Effect'", "'Little/no change' | 'Activity increased' | 'Not comparable' | 'Inconclusive'")

with open('src/types.ts', 'w') as f:
    f.write(content)

print("Updated types.ts")
