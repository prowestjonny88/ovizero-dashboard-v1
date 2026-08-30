import React from 'react';

export default function IllustrativeSubstrateFrame() {
  return (
    <div className="relative w-full aspect-square bg-zinc-100 rounded-lg border border-zinc-200 overflow-hidden flex items-center justify-center">
      {/* Synthetic Substrate Pattern */}
      <svg className="w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
      </svg>
      
      {/* Illustrative Egg Marks & Bounding Boxes */}
      <div className="absolute inset-0">
        {[
          { x: 20, y: 30, w: 12, h: 12 },
          { x: 50, y: 60, w: 10, h: 14 },
          { x: 75, y: 25, w: 14, h: 12 },
          { x: 35, y: 80, w: 12, h: 12 },
          { x: 80, y: 70, w: 10, h: 10 },
        ].map((box, i) => (
          <div key={i} className="absolute" style={{ left: `${box.x}%`, top: `${box.y}%` }}>
            <div className="w-1.5 h-1.5 bg-zinc-800 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <div 
              className="absolute border border-emerald-500 bg-emerald-500/10"
              style={{ 
                width: `${box.w}px`, 
                height: `${box.h}px`,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
          </div>
        ))}
      </div>
      
      <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur px-2 py-1.5 rounded text-[10px] font-mono text-zinc-600 text-center border border-white">
        Synthetic substrate illustration.<br/>Does not represent an actual model inference.
      </div>
    </div>
  );
}
