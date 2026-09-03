import re

with open('src/components/CommandCenter.tsx', 'r') as f:
    content = f.read()

content = content.replace('<span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-6 block border-t border-zinc-200/50 pt-4">No validated factor weights</span>', '')
content = content.replace('<span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-6 block border-t border-zinc-200/50 pt-4 mb-2">No validated factor weights</span>', '')

# Remove standalone occurrences
content = re.sub(r'<span[^>]*>\s*No validated factor weights\s*</span>', '', content)
content = re.sub(r'<p[^>]*>\s*No validated factor weights\s*</p>', '', content)
content = content.replace("No validated factor weights", "")

with open('src/components/CommandCenter.tsx', 'w') as f:
    f.write(content)
