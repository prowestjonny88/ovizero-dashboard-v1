import React from 'react';
import { MapPin } from 'lucide-react';
import { AppScreen, ExportFormat } from '../types';
import ExportMenu from './ExportMenu';

interface HeaderProps {
  currentScreen: string;
  activeZoneName: string;
  onExport: (format: ExportFormat) => Promise<void> | void;
  exportingFormat: ExportFormat | null;
  
  
}


const PERIOD_DRIVEN_SCREENS = new Set<AppScreen>([
  AppScreen.COMMAND_CENTER,
  AppScreen.PRIORITY_ZONES,
  AppScreen.ZONE_DETAIL,
  AppScreen.REPORTS,
]);

export default function Header({ 
  currentScreen, 
  activeZoneName, 
  onExport, 
  exportingFormat,
  
   
}: HeaderProps) {
  
  // Dynamic header title based on current screen
  const getHeaderTitle = () => {
    switch (currentScreen) {
      case AppScreen.COMMAND_CENTER:
      case AppScreen.RISK_MAP:
        return null; // Utility-only header for these screens
      case AppScreen.PRIORITY_ZONES:
        return 'Field Actions';
      case AppScreen.ZONE_DETAIL:
        return `${activeZoneName || 'Location'} · Field Action`;
      case AppScreen.DEVICES:
        return 'Devices';
      case AppScreen.REPORTS:
        return 'Analytical Reports';
      case AppScreen.SETTINGS:
        return 'System Configuration';
      case AppScreen.EVIDENCE_VALIDATION:
        return 'Evidence & Validation';
      default:
        return 'OviZero';
    }
  };

  const titleText = getHeaderTitle();

  return (
    <header className="h-16 border-b border-zinc-200/50 bg-white/85 backdrop-blur-md flex items-center justify-between px-4 pl-14 lg:px-8 sticky top-0 z-20">
      {/* Title and Location */}
      <div className="flex items-center gap-4">
        {titleText && (
          <>
            <h2 className="text-sm font-bold uppercase tracking-wider text-black">{titleText}</h2>
            <div className="h-3 w-px bg-zinc-200 hidden sm:block"></div>
          </>
        )}
        <div className="flex items-center gap-1.5 text-zinc-500 font-mono">
          <MapPin className="w-3.5 h-3.5 text-[#1b7f47]" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-700 hidden sm:inline">Residential-community scenario</span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-700 sm:hidden">Scenario</span>
        </div>
      </div>

      {/* Date Selectors & Export */}
      <div className="flex items-center gap-4">
        {/* Date Selector Pills */}
        {PERIOD_DRIVEN_SCREENS.has(currentScreen as AppScreen) && (
          <div className="flex items-center bg-zinc-50 p-0.5 rounded-lg border border-zinc-200/40">
            <span className="px-3 py-1.5 text-[11px] font-bold rounded-md uppercase tracking-wider bg-white text-black border border-zinc-200/30 shadow-xs">
              7D
            </span>
          </div>
        )}

        {/* Quick Utility Icons */}

        {/* Export Button */}
        <ExportMenu onExport={onExport} exportingFormat={exportingFormat} />
      </div>
    </header>
  );
}
