with open("src/utils/pdfReport.ts", "r") as f:
    pdf = f.read()

pdf = pdf.replace("import { DashboardExportPayload } from '../types';", "import { DashboardExportPayload } from '../types';\nimport { getInterventionDisplayStatus } from './interventionWorkflow';")

with open("src/utils/pdfReport.ts", "w") as f:
    f.write(pdf)
