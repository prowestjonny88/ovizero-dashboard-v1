import re

with open('src/components/evidence/EdgeAIEvidencePanel.tsx', 'r') as f:
    content = f.read()

new_acoustic = '''          {/* Proposed Capture Trigger */}
          <div className="mt-4 pt-4 border-t border-zinc-200">
            <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-wider mb-2">PROPOSED CAPTURE TRIGGER</h4>
            <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200 text-xs text-zinc-700 space-y-2">
              <div className="flex justify-between border-b border-zinc-100 pb-2">
                <span className="font-medium text-zinc-500">Trigger source</span>
                <span className="font-mono text-zinc-800">Simulated wingbeat event</span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 pb-2">
                <span className="font-medium text-zinc-500">Illustrative frequency</span>
                <span className="font-mono text-zinc-800">{device.wingbeatMatch || '492 Hz'}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 pb-2">
                <span className="font-medium text-zinc-500">Classifier status</span>
                <span className="font-mono text-zinc-800">Not trained</span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 pb-2">
                <span className="font-medium text-zinc-500">Trigger threshold</span>
                <span className="font-mono text-zinc-800">Not calibrated</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-zinc-500">Hardware trigger</span>
                <span className="font-mono text-zinc-800">Not implemented</span>
              </div>
            </div>
          </div>'''

content = re.sub(r'\{\/\* Optional Acoustic Section \*\/\}.*?<\/details>\s*<\/div>', new_acoustic, content, flags=re.DOTALL)

with open('src/components/evidence/EdgeAIEvidencePanel.tsx', 'w') as f:
    f.write(content)
