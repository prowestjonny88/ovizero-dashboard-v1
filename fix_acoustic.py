import re

with open('src/data.ts', 'r') as f:
    content = f.read()

content = re.sub(r"'\d{3} Hz \(Simulated\)'", "'Candidate acoustic trigger — simulated'", content)
content = re.sub(r"\s*aedesConfidence:\s*\d+,", "", content)
content = re.sub(r"'Optimal Incubation Climate'", "'Climate Threshold Reached'", content)
content = re.sub(r"'Humidity spike \+ egg count rise'", "'Correlated activity rise'", content)

with open('src/data.ts', 'w') as f:
    f.write(content)

print("done")
