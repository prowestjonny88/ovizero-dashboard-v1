import re

with open('src/utils/interventionWorkflow.ts', 'r') as f:
    content = f.read()

new_allowed = """export const ALLOWED_INTERVENTION_TRANSITIONS: Record<InterventionStatus, InterventionStatus[]> = {
  'New Alert': ['Reviewed'],
  'Reviewed': ['Assigned'],
  'Assigned': ['On Site'],
  'On Site': ['Action Completed'],
  'Action Completed': ['Awaiting Verification'],
  'Awaiting Verification': [
    'Activity decreased',
    'Little/no change',
    'Activity increased',
    'Not comparable',
    'Inconclusive',
    'Escalated'
  ],
  'Little/no change': ['Escalated'],
  'Activity decreased': [],
  'Escalated': [],
  'Activity increased': [],
  'Not comparable': [],
  'Inconclusive': [],
};"""

content = re.sub(r'export const ALLOWED_INTERVENTION_TRANSITIONS.*?};', new_allowed, content, flags=re.DOTALL)

with open('src/utils/interventionWorkflow.ts', 'w') as f:
    f.write(content)

