import re

with open('src/types.ts', 'r') as f:
    content = f.read()

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

content = re.sub(r'export interface ZoneData \{.*?\}(?=\n*export interface DeviceData)', new_zone_data, content, flags=re.DOTALL)

with open('src/types.ts', 'w') as f:
    f.write(content)

