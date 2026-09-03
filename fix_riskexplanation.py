import re

with open('src/utils/riskExplanation.ts', 'r') as f:
    content = f.read()

content = content.replace("Stored Mock Scenario", "Stored Scenario")
content = content.replace("No live packet history", "No packet history")
content = content.replace("Mock rolling growth indicator", "Rolling growth indicator")
content = content.replace("Used to demonstrate the proposed camera-wake sequence only;", "Used to demonstrate the camera-wake sequence;")

with open('src/utils/riskExplanation.ts', 'w') as f:
    f.write(content)

