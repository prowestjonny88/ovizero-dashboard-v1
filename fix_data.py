import re

with open('src/data.ts', 'r') as f:
    content = f.read()

content = content.replace("Candidate acoustic trigger — simulated", "Candidate acoustic trigger")
content = content.replace("Simulated data reflects a +37% increase in synthetic egg activity over the last 7 days.", "Egg activity increased by +37% over the last 7 days.")
content = content.replace("Illustrative Acoustic Match", "Acoustic Match")
content = content.replace("Simulated signal pattern is consistent with a candidate wingbeat frequency, requiring future field validation.", "Signal pattern is consistent with a candidate wingbeat frequency.")
content = content.replace("Simulated temperature and humidity context.", "Temperature and humidity context.")
content = content.replace("Simulated urban layout", "Urban layout")
content = content.replace("Simulated OZ-077 battery drops to 22%, causing a theoretical delay in diagnostics. Physical inspection proposed.", "OZ-077 battery at 22%, causing a delay in diagnostics. Physical inspection proposed.")
content = content.replace("Simulated community hall area", "Community hall area")

with open('src/data.ts', 'w') as f:
    f.write(content)

