import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type BPStatus = 'Normal' | 'Elevated' | 'Stage 1' | 'Stage 2' | 'Hypertensive Crisis' | 'Unknown';

export function calculateBPStatus(systolic: number, diastolic: number): BPStatus {
  if (systolic === 0 || diastolic === 0) return 'Unknown';
  
  if (systolic >= 180 || diastolic >= 120) return 'Hypertensive Crisis';
  if (systolic >= 140 || diastolic >= 90) return 'Stage 2';
  if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) return 'Stage 1';
  if (systolic >= 120 && systolic <= 129 && diastolic < 80) return 'Elevated';
  if (systolic < 120 && diastolic < 80) return 'Normal';
  
  // AHA 2017: If systolic and diastolic fall into different categories, the higher category is used.
  if (systolic >= 140) return 'Stage 2';
  if (diastolic >= 90) return 'Stage 2';
  if (systolic >= 130) return 'Stage 1';
  if (diastolic >= 80) return 'Stage 1';
  if (systolic >= 120) return 'Elevated';
  
  return 'Normal';
}

export function getBPStatusColor(status: BPStatus): string {
  switch (status) {
    case 'Normal': return 'bg-green-100 text-green-800 border-green-200';
    case 'Elevated': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Stage 1': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Stage 2': return 'bg-red-100 text-red-800 border-red-200';
    case 'Hypertensive Crisis': return 'bg-red-600 text-white border-red-700';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export function getBPStatusText(status: BPStatus): string {
  switch (status) {
    case 'Normal': return 'Great job! Your blood pressure is within the healthy range.';
    case 'Elevated': return 'Your blood pressure is slightly elevated. Take a deep breath and rest for 10 minutes.';
    case 'Stage 1': return 'Your blood pressure is at Hypertension Stage 1. Continue to monitor and consult your care team.';
    case 'Stage 2': return 'Your blood pressure is at Hypertension Stage 2. Please follow your medical guidance closely.';
    case 'Hypertensive Crisis': return 'EMERGENCY: Please contact your doctor or emergency services immediately.';
    default: return 'Log a reading to see your status.';
  }
}
