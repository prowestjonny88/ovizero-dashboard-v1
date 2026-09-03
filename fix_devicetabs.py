import re

with open('src/components/devices/DeviceMonitoringTabs.tsx', 'r') as f:
    content = f.read()

content = content.replace("Not validated", "Pending")
content = content.replace("Validation pending", "Pending")

with open('src/components/devices/DeviceMonitoringTabs.tsx', 'w') as f:
    f.write(content)
