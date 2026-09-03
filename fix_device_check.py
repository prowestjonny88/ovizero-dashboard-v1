import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace("Device check complete · no live device connected.", "Device check complete.")

with open('src/App.tsx', 'w') as f:
    f.write(content)

with open('src/components/DeviceFleet.tsx', 'r') as f:
    content = f.read()

content = content.replace('<p className="text-emerald-700/80 mt-0.5">No live device is connected.</p>', '')

with open('src/components/DeviceFleet.tsx', 'w') as f:
    f.write(content)

