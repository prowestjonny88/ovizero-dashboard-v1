import re

with open('src/types.ts', 'r') as f:
    content = f.read()

# Replace InterventionActionType
new_action_type = """export type InterventionActionType =
  | 'Inspect breeding sources'
  | 'Drain inspection'
  | 'Container removal / source reduction'
  | 'Request larvicide assessment'
  | 'Request vector-control authority assessment'
  | 'Resident communication'
  | 'Other';"""

content = re.sub(r'export type InterventionActionType =[\s\S]*?\| \'Other\';', new_action_type, content)

with open('src/types.ts', 'w') as f:
    f.write(content)

