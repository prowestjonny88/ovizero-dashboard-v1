import React, { useState, useRef, useEffect } from 'react';
import { ExportFormat } from '../types';
import { Download, ChevronDown, FileText, FileJson } from 'lucide-react';

interface ExportMenuProps {
  onExport: (format: ExportFormat) => Promise<void> | void;
  exportingFormat: ExportFormat | null;
  className?: string;
}

const ExportMenu: React.FC<ExportMenuProps> = ({ onExport, exportingFormat, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isExporting = exportingFormat !== null;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
      >
        <Download className="w-4 h-4" />
        {isExporting ? 'Generating...' : 'Export'}
        <ChevronDown className="w-3.5 h-3.5 ml-1" />
      </button>

      {isOpen && !isExporting && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-zinc-200 rounded-lg shadow-lg overflow-hidden z-50">
          <button
            onClick={() => {
              setIsOpen(false);
              onExport('pdf');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors text-left"
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            <div>
              <div className="font-bold">PDF Report</div>
              <div className="text-[10px] text-zinc-500">Visual summary</div>
            </div>
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              onExport('json');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors border-t border-zinc-100 text-left"
          >
            <FileJson className="w-4 h-4 text-blue-600" />
            <div>
              <div className="font-bold">JSON Payload</div>
              <div className="text-[10px] text-zinc-500">Raw data export</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportMenu;
