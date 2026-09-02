import re

with open("src/components/CommandCenter.tsx", "r") as f:
    content = f.read()

old_content = """        {/* Right Column: Why this location is prioritised */}
        <div className="w-full md:w-2/5 bg-zinc-50/50 p-8 md:p-10 border-t md:border-t-0 md:border-l border-zinc-200/60 flex flex-col justify-center">
          <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-6">
            Why this location is prioritised
          </h3>
          
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                Egg Activity
              </span>
              <div className="text-xl font-bold font-mono text-zinc-900">
                {peakZone.eggActivityChange}
              </div>
              <p className="text-[10px] text-zinc-400 font-medium mt-0.5">
                7-day synthetic change
              </p>
            </div>
            
            <div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                Local Conditions
              </span>
              <div className="text-xl font-bold font-mono text-zinc-900">
                {peakZone.temperature}°C · {peakZone.humidity}% RH
              </div>
              <p className="text-[10px] text-zinc-400 font-medium mt-0.5">
                Simulated node context
              </p>
            </div>
            
            <div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                Rainfall Context
              </span>
              <div className="text-xl font-bold font-mono text-zinc-900">
                {peakZone.rainfall}
              </div>
              <p className="text-[10px] text-zinc-400 font-medium mt-0.5">
                External demo input
              </p>
            </div>
          </div>
        </div>"""

new_content = """        {/* Right Column: Priority-Drivers Panel */}
        <div className="w-full md:w-2/5 bg-zinc-50/50 p-8 md:p-10 border-t md:border-t-0 md:border-l border-zinc-200/60 flex flex-col justify-center">
          <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-6">
            WHAT SHAPED THIS DEMO PRIORITY
          </h3>
          
          <div className="space-y-5">
            {/* 1. Egg activity */}
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs font-bold text-zinc-700">Egg activity</span>
                <span className="text-xs font-mono font-bold text-zinc-900">{peakZone.eggActivityChange}</span>
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider w-16">High</span>
                <div className="flex-1 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                  <div className="h-full bg-zinc-500 rounded-full w-[80%]"></div>
                </div>
              </div>
              <p className="text-[9px] text-zinc-400 font-medium">Synthetic observation</p>
            </div>
            
            {/* 2. Local microclimate */}
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs font-bold text-zinc-700">Local microclimate</span>
                <span className="text-xs font-mono font-bold text-zinc-900">{peakZone.temperature}°C · {peakZone.humidity}% RH</span>
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider w-16">High</span>
                <div className="flex-1 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                  <div className="h-full bg-zinc-500 rounded-full w-[75%]"></div>
                </div>
              </div>
              <p className="text-[9px] text-zinc-400 font-medium">Simulated node context</p>
            </div>
            
            {/* 3. Rainfall context */}
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs font-bold text-zinc-700">Rainfall context</span>
                <span className="text-xs font-mono font-bold text-zinc-900">{peakZone.rainfall}</span>
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider w-16">Moderate</span>
                <div className="flex-1 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                  <div className="h-full bg-zinc-400 rounded-full w-[55%]"></div>
                </div>
              </div>
              <p className="text-[9px] text-zinc-400 font-medium">External demo input</p>
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t border-zinc-200/60">
            <p className="text-[9px] text-zinc-400 font-mono text-center">
              Illustrative factors only · no validated weights
            </p>
          </div>
        </div>"""

content = content.replace(old_content, new_content)

with open("src/components/CommandCenter.tsx", "w") as f:
    f.write(content)

