import re

with open('src/data.ts', 'r') as f:
    content = f.read()

content = content.replace("market water discharge points", "residential courtyard drainage issues")
content = content.replace("school courtyard garden features an", "community hall area features")

content = content.replace("'Climate Threshold Reached'", "'Local microclimate context'")
content = content.replace("'Correlated activity rise'", "'Simulated temperature and humidity provide contextual information alongside synthetic egg activity.'")

with open('src/data.ts', 'w') as f:
    f.write(content)
print("done")
