import re
import os

def replace_in_file(filepath):
    if not os.path.exists(filepath):
        return
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Replace the "PPR Seri Anggerik · sublocation" pattern
    content = re.sub(r"PPR Seri Anggerik · ", "Illustrative scenario · ", content)
    content = content.replace("PPR Seri Anggerik", "Illustrative residential-community scenario")
    content = content.replace("Illustrative Illustrative residential-community scenario Pilot", "Illustrative residential-community scenario")
    content = content.replace("Illustrative Illustrative residential-community scenario pilot", "Illustrative residential-community scenario")

    with open(filepath, 'w') as f:
        f.write(content)

replace_in_file('src/components/Header.tsx')
replace_in_file('src/components/CommandCenter.tsx')
replace_in_file('src/components/Settings.tsx')
replace_in_file('src/components/DeviceFleet.tsx')
replace_in_file('src/components/ZoneDetail.tsx')
replace_in_file('src/utils/dashboard.ts')
replace_in_file('src/App.tsx')

print("done")
