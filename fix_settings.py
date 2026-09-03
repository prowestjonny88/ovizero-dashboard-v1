import re

with open('src/components/Settings.tsx', 'r') as f:
    content = f.read()

content = content.replace("Preview local mock-interface options", "Local interface options")
content = content.replace("Node Registry Demo", "Node Registry")
content = content.replace("Local mock UI preview", "Local UI preview")
content = content.replace("are illustrative demo placements.", "are shown.")
content = content.replace("Illustrative residential-community scenario", "Residential-community scenario")
content = content.replace("Mock Data", "Data")
content = content.replace("mock device records", "device records")
content = content.replace("Mock refresh cadence", "Refresh cadence")
content = content.replace("Stored mock scenario logic", "Stored scenario logic")
content = content.replace(">Demo coordinates<", ">Coordinates<")
content = content.replace("Session/local mock data", "Session/local data")
content = content.replace("Mock Telemetry", "Telemetry")
content = content.replace("Simulated hardware parameters and simulated wingbeat registers", "Hardware parameters and wingbeat registers")
content = content.replace("simulated acoustic trigger passes.<br/><br/>Hardware status: Not built<br/>Trigger logic: Not validated", "acoustic trigger passes.")
content = content.replace("illustrative source range", "source range")
content = content.replace("camera.<br/>No OviZero acoustic classifier has been trained or validated.", "camera.")
content = content.replace("Illustrative Data Engine", "Data Engine")
content = content.replace("Enable simulated payload generation for demonstrations.", "Enable payload generation.")
content = content.replace("Simulated Moisture Bridge Check", "Moisture Bridge Check")
content = content.replace("Simulated Electrode Contact Check", "Electrode Contact Check")
content = content.replace("Simulated Google maps parameters, simulated vector fallback styles", "Google maps parameters, vector fallback styles")
content = content.replace("Simulated primary rendering interface", "Primary rendering interface")
content = content.replace(" (Preview only)", "")
content = content.replace("Preview illustrative risk-band overlays in the local mock interface.", "Preview risk-band overlays in the local interface.")
content = content.replace("Preview illustrative proposed device placements.", "Preview proposed device placements.")
content = content.replace("around mock profiles currently", "around profiles currently")

with open('src/components/Settings.tsx', 'w') as f:
    f.write(content)

