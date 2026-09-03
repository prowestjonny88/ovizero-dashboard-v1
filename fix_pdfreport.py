import re

with open('src/utils/pdfReport.ts', 'r') as f:
    content = f.read()

content = content.replace("doc.text('No validated factor weights', rightX, currentY + 70);", "")

with open('src/utils/pdfReport.ts', 'w') as f:
    f.write(content)

