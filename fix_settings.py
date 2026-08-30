import re

with open('src/components/Settings.tsx', 'r') as f:
    content = f.read()

# Replace Egg Count Capture card
content = re.sub(
    r'<span className="text-\[10px\] font-bold text-zinc-400 uppercase tracking-wider block">\s*Egg Count Capture \(Simulated\)\s*</span>\s*<span className="font-semibold text-\[#052e1a\] text-xs mt-1 block">\s*Daily 08:30\s*</span>\s*<span className="text-\[9px\] text-zinc-400 block mt-0.5">Simulated high-res optical module trigger</span>',
    '''<span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                    CAMERA CAPTURE TRIGGER
                  </span>
                  <span className="font-semibold text-[#052e1a] text-xs mt-1 block">
                    Wingbeat-triggered · proposed
                  </span>
                  <span className="text-[9px] text-zinc-400 block mt-0.5">Camera wakes only after the simulated acoustic trigger passes.<br/><br/>Hardware status: Not built<br/>Trigger logic: Not validated</span>''',
    content,
    flags=re.DOTALL
)

# Replace Acoustic Band card
content = re.sub(
    r'<span className="text-\[10px\] font-bold text-zinc-400 uppercase tracking-wider block">\s*Optional Acoustic Candidate Band\s*</span>\s*<span className="font-mono text-xs font-semibold text-\[#052e1a\] mt-1 block">\s*480–511 Hz · illustrative\s*</span>\s*<span className="text-\[9px\] text-zinc-400 block mt-0.5">Future optional validation module\. No microphone classifier is trained and this signal is not included in the current scenario index\.</span>',
    '''<span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                    WINGBEAT TRIGGER
                  </span>
                  <span className="font-mono text-xs font-semibold text-[#052e1a] mt-1 block">
                    480–511 Hz · illustrative source range
                  </span>
                  <span className="text-[9px] text-zinc-400 block mt-0.5">Proposed low-power microphone trigger for waking the camera.<br/>No OviZero acoustic classifier has been trained or validated.</span>''',
    content,
    flags=re.DOTALL
)

with open('src/components/Settings.tsx', 'w') as f:
    f.write(content)
