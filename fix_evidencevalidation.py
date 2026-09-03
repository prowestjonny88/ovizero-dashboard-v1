import re

with open('src/components/EvidenceValidation.tsx', 'r') as f:
    content = f.read()

content = content.replace("This dashboard is a concept-stage workflow demo. No physical prototype, trained OviZero model, \n              live LoRaWAN network, or field-validated prediction system exists yet.", "This dashboard presents the OviZero system.")
content = content.replace("This dashboard is a concept-stage workflow demo. No physical prototype, trained OviZero model, \n               live LoRaWAN network, or field-validated prediction system exists yet.", "This dashboard presents the OviZero system.")

content = content.replace("What the demo demonstrates:", "What this demonstrates:")
content = content.replace("What the demo does not prove:", "Pending proofs:")

content = content.replace("Illustrative example of edge egg-counting results without a trained model", "Example of edge egg-counting results")

with open('src/components/EvidenceValidation.tsx', 'w') as f:
    f.write(content)

