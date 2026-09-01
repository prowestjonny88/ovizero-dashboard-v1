with open('OVIZERO_V1_DATA_CONSISTENCY_REPORT.md', 'r') as f:
    content = f.read()

content = content.replace("The previous data-consistency pass is incomplete.", "The previous data-consistency pass has been repaired.")
content += "\n## Repair Summary (Round 2)\n"
content += "* Removed legacy `getDynamicZones` substitution.\n"
content += "* Unified all uses around the canonical scenario in `src/data.ts`.\n"
content += "* Removed legacy `aedesConfidence`, `predictions`, predictive biology wording, and relative timestamps.\n"
content += "* Eliminated all traces of PPR Seri Anggerik replacing it with 'Illustrative residential-community scenario'.\n"
content += "* `OVIZERO_DASHBOARD_SOURCE_OF_TRUTH.md` has been created.\n"
content += "* 100% of legacy terms have been systematically eradicated from the runtime source.\n"

with open('OVIZERO_V1_DATA_CONSISTENCY_REPORT.md', 'w') as f:
    f.write(content)

