import re

code_to_insert = """
          {/* Bottom Row: Climate & Risk Horizon Prediction panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Climate panel */}
            <div className="bg-white rounded-xl border border-zinc-200/55 p-6 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
              <h3 className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-6">
                Environmental Telemetry
              </h3>
              
              <div className="grid grid-cols-2 gap-6 text-xs">
                <div className="border-b border-zinc-100 pb-3">
                  <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                    Temperature
                  </span>
                  <span className="text-sm font-bold text-zinc-950 font-geist">{zone.temperature}°C</span>
                </div>
                <div className="border-b border-zinc-100 pb-3">
                  <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                    Humidity
                  </span>
                  <span className="text-sm font-bold text-zinc-950 font-geist">{zone.humidity}%</span>
                </div>
                <div>
                  <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                    Rainfall (48h)
                  </span>
                  <span className="text-sm font-bold text-zinc-950 font-geist">{zone.rainfall}</span>
                </div>
                <div>
                  <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                    Estimated Hatching Acceleration
                  </span>
                  <span className="text-sm font-bold text-zinc-950 uppercase tracking-wide">
                    {zone.hatchingRate}
                  </span>
                </div>
              </div>
            </div>

            {/* Predictive Horizon panel */}
            <div className="bg-white rounded-xl border border-zinc-200/55 p-6 flex flex-col justify-between shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
              <div>
                <h3 className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-6">
                  Illustrative Scenario Outlook
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-100 text-center">
                    <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                      Next 3 Days
                    </span>
                    <span className="text-xs font-bold text-zinc-950 font-mono">{zone.predictions.next3Days}</span>
                  </div>
                  <div className="bg-zinc-100 p-3 rounded-lg border border-zinc-200/30 text-center">
                    <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                      Next 7 Days
                    </span>
                    <span className="text-xs font-bold text-zinc-950 font-mono">{zone.predictions.next7Days}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2.5 pt-4 border-t border-zinc-100 mt-4 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-zinc-500">Illustrative biological timing assumption:</span>
                  <strong className="text-zinc-950 font-bold">{zone.predictions.adultEmergence}</strong>
                </div>
                <div className="flex justify-between items-center border-t border-zinc-100 pt-2.5">
                  <span className="font-bold text-zinc-950">Intervention window target:</span>
                  <strong className="text-zinc-950 font-bold flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-zinc-950" /> {zone.predictions.actionWindow}
                  </strong>
                </div>
                
                <p className="text-[10px] text-zinc-400 mt-2 italic border-t border-zinc-100 pt-2">
                  Not validated against field outcomes.
                </p>
              </div>
            </div>
          </div>
        </div>
"""

with open('src/components/ZoneDetail.tsx', 'r') as f:
    content = f.read()

content = content.replace("          {/* Bottom Row", code_to_insert)

with open('src/components/ZoneDetail.tsx', 'w') as f:
    f.write(content)
