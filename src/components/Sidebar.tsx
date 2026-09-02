import React from 'react';
import { AppScreen } from '../types';
import { 
  LayoutDashboard, 
  Map, 
  AlertTriangle, 
  Cpu, 
} from 'lucide-react';

interface SidebarProps {
  variant?: 'desktop' | 'drawer';
  currentScreen: AppScreen;
  onScreenChange: (screen: AppScreen) => void;
}

export default function Sidebar({ currentScreen, onScreenChange, variant = 'desktop' }: SidebarProps) {
  const menuItems = [
    {
      id: AppScreen.COMMAND_CENTER,
      label: 'Overview',
      icon: LayoutDashboard,
    },
    {
      id: AppScreen.RISK_MAP,
      label: 'Priority Map',
      icon: Map,
    },
    {
      id: AppScreen.PRIORITY_ZONES,
      label: 'Field Actions',
      icon: AlertTriangle,
    },
    {
      id: AppScreen.DEVICES,
      label: 'Devices',
      icon: Cpu,
    }
  ];

  return (
    <aside id="ovizero-sidebar" className={`${variant === 'desktop' ? 'fixed left-0 top-0 h-screen w-64' : 'relative w-full h-full'} border-r border-[#0b5a31]/20 bg-[#052e1a] text-white flex flex-col p-8 z-30`}>
      {/* Brand Header */}
      <div className="mb-10">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <span>OviZero</span>
          <span className="text-[9px] font-mono font-normal tracking-normal px-1.5 py-0.5 rounded bg-[#0b5a31] text-[#e8f4ed] uppercase">
            v1.0
          </span>
        </h1>
        <p className="text-[9px] font-semibold text-[#cad5ce] uppercase tracking-[0.2em] mt-1.5">
          Mosquito Surveillance
        </p>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 flex flex-col gap-1">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentScreen === item.id || 
            (item.id === AppScreen.PRIORITY_ZONES && currentScreen === AppScreen.ZONE_DETAIL);
          
          return (
            <button
              key={item.id}
              
              id={`nav-${item.id.toLowerCase()}`}
              onClick={() => onScreenChange(item.id)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-all duration-200 active:scale-98 text-left ${
                isActive
                  ? 'bg-[#e8f4ed] text-[#052e1a] font-semibold shadow-sm'
                  : 'text-[#cad5ce] hover:bg-[#0b5a31] hover:text-white'
              }`}
            >
              <IconComponent className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#052e1a]' : 'text-[#cad5ce] group-hover:text-white'}`} />
              <span className="leading-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
