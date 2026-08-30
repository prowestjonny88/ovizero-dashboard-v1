import React from 'react';
import { HelpCircle, Sparkles, Clock } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  description: string;
}

export default function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200/50 p-12 max-w-2xl mx-auto text-center space-y-6 my-12 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
      <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-950 mx-auto border border-zinc-100">
        <Clock className="w-5 h-5" />
      </div>
      
      <div className="space-y-2">
        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">
          OviZero System Module
        </span>
        <h3 className="text-lg font-bold text-zinc-950 tracking-tight">{title}</h3>
        <p className="text-[11px] text-zinc-500 leading-relaxed max-w-md mx-auto">
          {description}
        </p>
      </div>

      <div className="pt-4 border-t border-zinc-100 flex justify-center items-center gap-2 text-[9px] text-zinc-950 font-bold uppercase tracking-wider">
        <Sparkles className="w-4 h-4 text-zinc-950" />
        <span>Development Phase 1 Active</span>
      </div>
    </div>
  );
}
