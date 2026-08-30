import re

with open('src/types.ts', 'r') as f:
    content = f.read()

# Remove the incorrectly added one around line 23
# The content in ZoneData:
#   eggCount: number;
#   wingbeatMatch?: number;
content = content.replace("  eggCount: number;\n  wingbeatMatch?: number;", "  eggCount: number;")

# Add to DeviceData specifically
# Let's find DeviceData
parts = content.split("export interface DeviceData {")
if len(parts) == 2:
    device_part = parts[1]
    device_part = device_part.replace("  lastSeenMinutes: number;", "  lastSeenMinutes: number;\n  wingbeatMatch?: number;")
    content = parts[0] + "export interface DeviceData {" + device_part

with open('src/types.ts', 'w') as f:
    f.write(content)
