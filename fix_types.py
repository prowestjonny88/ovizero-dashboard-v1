import re

with open("src/types.ts", "r") as f:
    types = f.read()
types = types.replace("zones: Partial<ZoneData>[];", "zones: ZoneData[];")
with open("src/types.ts", "w") as f:
    f.write(types)

with open("src/utils/dashboard.ts", "r") as f:
    dash = f.read()
dash = dash.replace("    zones: zones.map(z => ({", "    zones: (zones.map(z => ({")
dash = dash.replace("provenance: z.provenance\n    })),", "provenance: z.provenance\n    })) as unknown) as ZoneData[],")
with open("src/utils/dashboard.ts", "w") as f:
    f.write(dash)
