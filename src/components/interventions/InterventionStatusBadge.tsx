import React from 'react';
import { InterventionStatus } from '../../types';
import { getStatusColor } from '../../utils/interventionWorkflow';

interface InterventionStatusBadgeProps {
  status: InterventionStatus | undefined;
}

export default function InterventionStatusBadge({ status }: InterventionStatusBadgeProps) {
  if (!status) {
    return (
      <span className="inline-block px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-500 border border-zinc-200">
        No Active Alert
      </span>
    );
  }

  return (
    <span className={`inline-block px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-wider border ${getStatusColor(status)}`}>
      {status}
    </span>
  );
}
