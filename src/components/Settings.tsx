import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Cpu, 
  Settings as SettingsIcon, 
  Shield, 
  Map, 
  Sliders, 
  Database, 
  Key, 
  RefreshCw, 
  Radio, 
  Eye, 
  Layers, 
  Wifi, 
  Check, 
  Lock, 
  Server, 
  CloudLightning,
  AlertTriangle,
  FlameKindling
} from 'lucide-react';

export default function Settings() {
  // Local state for some toggle visuals to make it feel highly interactive and real
  const [toggleState, setToggleState] = useState({
    adultEscape: true,
    moistureBridge: true,
    electrodeContact: true,
    riskOverlay: true,
    nodePins: true,
    alertHalo: true,
    demoCoordinates: true,
  });

  const handleToggle = (key: keyof typeof toggleState) => {
    setToggleState(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Check if API key is configured
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';
  const isApiConnected = !!apiKey;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="p-6 max-w-6xl mx-auto space-y-8"
      id="settings-page-container"
    >
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200/60 pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#1b7f47] bg-[#e8f4ed] px-2.5 py-1 rounded-full">
            SYSTEM CONFIGURE
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-[#052e1a] mt-2">
            System Settings
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Preview local mock-interface options and proposed system settings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#1b7f47] animate-pulse" />
          <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-zinc-500">
            Node Registry Demo
          </span>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-sm mb-6">
        <p className="font-bold mb-1">Local mock UI preview — session-only</p>
        <p>These settings do not command physical devices or modify the submitted Risk Map.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: System Profile & API Status (Spans 5 cols on large screens) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* API Status Card */}
          <div className="bg-white border border-zinc-200/50 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-200/40 text-[#052e1a]">
                <Key className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-800">
                  API Credentials
                </h3>
                <p className="text-[10px] text-zinc-400">Map rendering configuration status</p>
              </div>
            </div>
            <div className="pt-2">
              {isApiConnected ? (
                <div className="flex flex-col gap-3 p-3.5 bg-[#e8f4ed] border border-[#cad5ce]/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#1b7f47]" />
                    <span className="text-[11px] font-bold text-[#052e1a]">
                      Google Maps API key configured
                    </span>
                  </div>
                  <p className="text-[10px] text-[#42534a] leading-relaxed">
                    Google Maps basemap enabled. OviZero pilot device and gateway coordinates shown on the map are illustrative demo placements.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 p-3.5 bg-[#fff1f0] border border-[#f3b3ad] rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#b42318]" />
                    <span className="text-[11px] font-bold text-[#b42318]">
                      Google Maps API: Environment variable required
                    </span>
                  </div>
                  <p className="text-[10px] text-[#b42318]/80 leading-relaxed">
                    Offline schematic fallback active.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* System Profile Card */}
          <div className="bg-white border border-zinc-200/50 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-200/40 text-[#052e1a]">
                <Server className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-800">
                  System Profile
                </h3>
                <p className="text-[10px] text-zinc-400">Regional deployment specifications</p>
              </div>
            </div>
            <div className="divide-y divide-zinc-100 text-xs">
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-zinc-500">Deployment</span>
                <span className="font-semibold text-zinc-800 text-right">Illustrative PPR Seri Anggerik Pilot</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-zinc-500">Mock Data</span>
                <span className="font-semibold text-zinc-800 text-right flex items-center gap-1.5">
                  <span className="text-[#1b7f47] font-mono">5</span>
                  <span className="text-zinc-400">mock device records</span>
                </span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-zinc-500">LoRaWAN Region</span>
                <span className="font-semibold text-zinc-800 text-right font-mono">AS923</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-zinc-500">Mock refresh cadence</span>
                <span className="font-semibold text-zinc-800 text-right">Every 15 min</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-zinc-500">AI Mode</span>
                <span className="font-semibold text-zinc-800 text-right bg-[#e8f4ed] text-[#052e1a] px-1.5 py-0.5 rounded text-[10px]">
                  Stored mock scenario logic
                </span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-zinc-500">Map Mode</span>
                <span className="font-semibold text-[#052e1a] text-right font-mono text-[10px]">
                  Dual View, Schematic + Google GIS
                </span>
              </div>
            </div>
          </div>

          {/* Data Safety Card */}
          <div className="bg-white border border-zinc-200/50 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-200/40 text-[#052e1a]">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-800">
                  Data Safety & Compliance
                </h3>
                <p className="text-[10px] text-zinc-400">Compliance assessment not started</p>
              </div>
            </div>
            <div className="divide-y divide-zinc-100 text-xs">
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-zinc-500">Patient Data</span>
                <span className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Not collected
                </span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-zinc-500">Virus Detection</span>
                <span className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Not performed
                </span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-zinc-500">Location Mode</span>
                <span className="font-semibold text-zinc-800">Demo coordinates</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-zinc-500">Data Retention</span>
                <span className="font-semibold text-zinc-800">Session/local mock data</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-zinc-500">Export Formats</span>
                <span className="font-semibold text-[#052e1a] bg-[#e8f4ed] px-2 py-0.5 rounded text-[10px]">
                  PDF + JSON
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sensor Logic & Map Settings (Spans 7 cols on large screens) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Experimental Egg-Control Module Card */}
          <div className="bg-white border border-zinc-200/50 rounded-xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-200/40 text-amber-700">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-zinc-900">
                  Experimental Egg-Control Module
                </h3>
                <p className="text-[10px] text-zinc-400">Concept evaluation phase</p>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200/50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between items-center pb-2 border-b border-amber-200/50">
                <span className="text-xs font-bold text-amber-900">Status</span>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Disabled</span>
              </div>
              <div className="text-xs text-amber-800 flex flex-col gap-1.5 pt-1">
                <span>• Planned laboratory test</span>
                <span>• Safety not confirmed</span>
                <span>• Egg mortality not confirmed</span>
                <span>• Mechanical containment required</span>
              </div>
            </div>
          </div>

          {/* Sensor Logic Card */}
          <div className="bg-white border border-zinc-200/50 rounded-xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-200/40 text-[#052e1a]">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-zinc-900">
                  Proposed Sensor Logic & Mock Telemetry
                </h3>
                <p className="text-[10px] text-zinc-400">Simulated hardware parameters and simulated wingbeat registers</p>
              </div>
            </div>
            <div className="space-y-4">
              
              {/* Row 1: Readonly variables */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-zinc-50/50 border border-zinc-200/20 p-3 rounded-lg">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                    CAMERA CAPTURE TRIGGER
                  </span>
                  <span className="font-semibold text-[#052e1a] text-xs mt-1 block">
                    Wingbeat-triggered · proposed
                  </span>
                  <span className="text-[9px] text-zinc-400 block mt-0.5">Camera wakes only after the simulated acoustic trigger passes.<br/><br/>Hardware status: Not built<br/>Trigger logic: Not validated</span>
                </div>

                <div className="bg-zinc-50/50 border border-zinc-200/20 p-3 rounded-lg">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                    WINGBEAT TRIGGER
                  </span>
                  <span className="font-mono text-xs font-semibold text-[#052e1a] mt-1 block">
                    480–511 Hz · illustrative source range
                  </span>
                  <span className="text-[9px] text-zinc-400 block mt-0.5">Proposed low-power microphone trigger for waking the camera.<br/>No OviZero acoustic classifier has been trained or validated.</span>
                </div>
              </div>

              {/* Toggles */}
              <div className="divide-y divide-zinc-100">
                <div className="py-3 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-xs text-zinc-800">Illustrative Data Engine (Session-only)</h4>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Enable simulated payload generation for demonstrations.</p>
                  </div>
                  <button 
                    onClick={() => handleToggle('adultEscape')}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      toggleState.adultEscape ? 'bg-[#1b7f47]' : 'bg-zinc-200'
                    }`}
                  >
                    <span 
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        toggleState.adultEscape ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="py-3 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-xs text-zinc-800">Simulated Moisture Bridge Check (Session-only)</h4>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Simulates soil & substrate humidity data to test false positive prevention.</p>
                  </div>
                  <button 
                    onClick={() => handleToggle('moistureBridge')}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      toggleState.moistureBridge ? 'bg-[#1b7f47]' : 'bg-zinc-200'
                    }`}
                  >
                    <span 
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        toggleState.moistureBridge ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="py-3 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-xs text-zinc-800">Simulated Electrode Contact Check (Session-only)</h4>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Simulates automated resistance monitoring on egg-counting circuit grids.</p>
                  </div>
                  <button 
                    onClick={() => handleToggle('electrodeContact')}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      toggleState.electrodeContact ? 'bg-[#1b7f47]' : 'bg-zinc-200'
                    }`}
                  >
                    <span 
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        toggleState.electrodeContact ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Map Settings Card */}
          <div className="bg-white border border-zinc-200/50 rounded-xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-zinc-50 rounded-lg border border-zinc-200/40 text-[#052e1a]">
                <Map className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-zinc-900">
                  GIS & Map Layer Settings
                </h3>
                <p className="text-[10px] text-zinc-400">Simulated Google maps parameters, simulated vector fallback styles, and coordinate offsets</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-zinc-50/50 border border-zinc-200/20 p-3 rounded-lg">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                    Default View
                  </span>
                  <span className="font-semibold text-[#052e1a] text-xs mt-1 block">
                    Google Maps
                  </span>
                  <span className="text-[9px] text-zinc-400 block mt-0.5">Simulated primary rendering interface</span>
                </div>

                <div className="bg-zinc-50/50 border border-zinc-200/20 p-3 rounded-lg">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                    Fallback View
                  </span>
                  <span className="font-semibold text-zinc-600 text-xs mt-1 block">
                    Schematic
                  </span>
                  <span className="text-[9px] text-zinc-400 block mt-0.5">Used if API key auth fails</span>
                </div>
              </div>

              <div className="divide-y divide-zinc-100">
                <div className="py-3 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-xs text-zinc-800">Risk Overlay (Preview only)</h4>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Preview illustrative risk-band overlays in the local mock interface.</p>
                  </div>
                  <button 
                    onClick={() => handleToggle('riskOverlay')}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      toggleState.riskOverlay ? 'bg-[#1b7f47]' : 'bg-zinc-200'
                    }`}
                  >
                    <span 
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        toggleState.riskOverlay ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="py-3 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-xs text-zinc-800">Node Pins (Preview only)</h4>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Preview illustrative proposed device placements.</p>
                  </div>
                  <button 
                    onClick={() => handleToggle('nodePins')}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      toggleState.nodePins ? 'bg-[#1b7f47]' : 'bg-zinc-200'
                    }`}
                  >
                    <span 
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        toggleState.nodePins ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="py-3 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-xs text-zinc-800">Critical Alert Halo (Preview only)</h4>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Preview a crimson halo around mock profiles currently classified in the Critical risk band.</p>
                  </div>
                  <button 
                    onClick={() => handleToggle('alertHalo')}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      toggleState.alertHalo ? 'bg-[#1b7f47]' : 'bg-zinc-200'
                    }`}
                  >
                    <span 
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        toggleState.alertHalo ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="py-3 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-xs text-zinc-800">Demo Coordinates (Preview only)</h4>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Illustrative PPR Seri Anggerik pilot coordinates</p>
                  </div>
                  <button 
                    onClick={() => handleToggle('demoCoordinates')}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      toggleState.demoCoordinates ? 'bg-[#1b7f47]' : 'bg-zinc-200'
                    }`}
                  >
                    <span 
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        toggleState.demoCoordinates ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </motion.div>
  );
}
