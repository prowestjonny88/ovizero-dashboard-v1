import { InterventionStatus } from '../types';

export const ALLOWED_INTERVENTION_TRANSITIONS: Record<InterventionStatus, InterventionStatus[]> = {
  'New Alert': ['Reviewed'],
  'Reviewed': ['Assigned'],
  'Assigned': ['On Site'],
  'On Site': ['Action Completed'],
  'Action Completed': ['Awaiting Verification'],
  'Awaiting Verification': [
    'Activity decreased',
    'Little/no change',
    'Activity increased',
    'Not comparable',
    'Inconclusive',
    'Escalated'
  ],
  'Little/no change': ['Escalated'],
  'Activity decreased': [],
  'Escalated': [],
  'Activity increased': [],
  'Not comparable': [],
  'Inconclusive': [],
};

export const getStatusColor = (status: InterventionStatus): string => {
  switch (status) {
    case 'New Alert': return 'bg-red-100 text-red-800 border-red-200';
    case 'Reviewed': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Assigned': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'On Site': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Action Completed': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'Awaiting Verification': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Activity decreased': return 'bg-green-100 text-green-800 border-green-200';
    case 'Little/no change': return 'bg-zinc-100 text-zinc-800 border-zinc-200';
    case 'Activity increased': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Not comparable': return 'bg-zinc-100 text-zinc-600 border-zinc-200';
    case 'Inconclusive': return 'bg-zinc-100 text-zinc-600 border-zinc-200';
    case 'Escalated': return 'bg-rose-100 text-rose-800 border-rose-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getInterventionDisplayStatus = (status: InterventionStatus): string => {
  if (status === 'Action Completed') return 'Action Logged';
  if (status === 'Awaiting Verification') return 'Awaiting follow-up';
  return status;
};
