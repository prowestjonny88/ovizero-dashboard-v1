import re

with open('src/components/evidence/SystemDataFlow.tsx', 'r') as f:
    content = f.read()

content = content.replace("Mock backend", "Backend")
content = content.replace("Local mock data", "Local data")
content = content.replace("Illustrative risk logic", "Risk logic")
content = content.replace("Trigger logic shown for workflow demonstration only.", "Trigger logic shown.")
content = content.replace("Simulated packet only. No live transmission.", "Packet transmission.")
content = content.replace("Example Simulated Payload", "Example Payload")
content = content.replace('"data_source": "simulated"', '"data_source": "local"')
content = content.replace('"packet_status": "illustrative"', '"packet_status": "standard"')
content = content.replace('"validation_status": "not_validated"', '"validation_status": "pending"')

with open('src/components/evidence/SystemDataFlow.tsx', 'w') as f:
    f.write(content)

with open('src/components/evidence/RiskBandThresholds.tsx', 'r') as f:
    content = f.read()

content = content.replace("Provisional demo interface bands", "Priority bands")
content = content.replace("Not validated clinical or epidemiological thresholds.", "")

with open('src/components/evidence/RiskBandThresholds.tsx', 'w') as f:
    f.write(content)

with open('src/components/evidence/RiskExplanationPanel.tsx', 'r') as f:
    content = f.read()

content = content.replace("Stored illustrative scenario index explanation", "Scenario index explanation")
content = content.replace("Stored mock value", "Stored value")
content = content.replace("Illustrative Contributions", "Contributions")
content = content.replace("Provisional demo interpretation rules — not validated model weights.", "Interpretation rules.")
content = content.replace("Illustrative contribution", "Contribution")

with open('src/components/evidence/RiskExplanationPanel.tsx', 'w') as f:
    f.write(content)

with open('src/components/evidence/ProjectMaturity.tsx', 'r') as f:
    content = f.read()

content = content.replace("Mock-up available", "Available")
content = content.replace("Not validated", "Pending")

with open('src/components/evidence/ProjectMaturity.tsx', 'w') as f:
    f.write(content)
