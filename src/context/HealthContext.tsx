import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BPStatus, calculateBPStatus } from '../lib/utils';

export type UserType = 'Mom' | 'Son';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  category: 'Morning' | 'Afternoon' | 'Evening';
  taken: boolean;
  takenAt?: string;
  notifiesFamily?: boolean;
}

export interface Reading {
  id: string;
  userId: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  timestamp: string;
  status: BPStatus;
}

export interface Activity {
  id: string;
  userId: string;
  type: 'reading' | 'medication_taken' | 'note' | 'viewed';
  text: string;
  timestamp: string;
  authorName: string;
  authorId: string;
  authorAvatar?: string;
  replies?: ActivityReply[];
  hasHearted?: boolean;
}

export interface ActivityReply {
  id: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
}

interface HealthContextType {
  currentUser: UserType;
  setCurrentUser: (user: UserType) => void;
  medications: Medication[];
  toggleMedication: (id: string) => void;
  readings: Reading[];
  addReading: (systolic: number, diastolic: number, pulse: number) => void;
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
  heartActivity: (id: string) => void;
  syncInProgress: boolean;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

const INITIAL_MEDS: Medication[] = [
  { id: '1', name: 'Lisinopril', dosage: '10mg', time: '8:00 AM', category: 'Morning', taken: true, takenAt: '2026-10-24T08:00:00Z' },
  { id: '2', name: 'Metformin', dosage: '500mg', time: '8:30 AM', category: 'Morning', taken: true, takenAt: '2026-10-24T08:30:00Z' },
  { id: '3', name: 'Aspirin', dosage: '81mg', time: '1:00 PM', category: 'Afternoon', taken: false, notifiesFamily: true },
  { id: '4', name: 'Atorvastatin', dosage: '20mg', time: '8:00 PM', category: 'Evening', taken: false },
  { id: '5', name: 'Multivitamin', dosage: '', time: '9:00 PM', category: 'Evening', taken: false },
];

const INITIAL_READINGS: Reading[] = [
  { id: 'r1', userId: 'Mom', systolic: 129, diastolic: 82, pulse: 72, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), status: 'Stage 1' },
];

const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'a1',
    userId: 'Mom',
    type: 'note',
    authorName: 'Son',
    authorId: 'Son',
    authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALpSeoHa6IEFszpp4BBbyZxI4bdtsKprKGcYBpRpSUREHRa9u9PcZ6iBLCt9Ciijpg_Ho24daikO-ktKiLsnTN3YarWLwKqkhjCybPLjL-e_OM7N4iCwhzkxSHJz0SMnQJVB30MuShy9Qyg_H42CfiLckWzZsMX_zHmwiWB4OEdCqyMVlspF6at_PzdKR1tDwOfp0cTD4eebXx1-Czj2VEogFoYRXrCp8rhunLlZ3lH4tzlcE4Tm5kf79YmpIo7pjvGl7TvJuwM27_',
    text: 'Great job keeping up the readings today! Your trends are looking very consistent lately.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    hasHearted: false
  },
  {
    id: 'a2',
    userId: 'Mom',
    type: 'medication_taken',
    authorName: 'Mom',
    authorId: 'Mom',
    text: 'Mom marked Lisinopril as taken',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString()
  },
  {
    id: 'a3',
    userId: 'Mom',
    type: 'viewed',
    authorName: 'Daughter',
    authorId: 'Daughter',
    text: 'Daughter checked your morning log',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
  }
];

export function HealthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserType>('Mom');
  const [medications, setMedications] = useState<Medication[]>(INITIAL_MEDS);
  const [readings, setReadings] = useState<Reading[]>(INITIAL_READINGS);
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [syncInProgress, setSyncInProgress] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const savedMeds = localStorage.getItem('hearty_meds');
    const savedReadings = localStorage.getItem('hearty_readings');
    const savedActivities = localStorage.getItem('hearty_activities');
    
    if (savedMeds) setMedications(JSON.parse(savedMeds));
    if (savedReadings) setReadings(JSON.parse(savedReadings));
    if (savedActivities) setActivities(JSON.parse(savedActivities));
  }, []);

  // Sync to local storage on change
  useEffect(() => {
    localStorage.setItem('hearty_meds', JSON.stringify(medications));
    localStorage.setItem('hearty_readings', JSON.stringify(readings));
    localStorage.setItem('hearty_activities', JSON.stringify(activities));
  }, [medications, readings, activities]);

  const toggleMedication = (id: string) => {
    setMedications(prev => prev.map(med => {
      if (med.id === id) {
        const newState = !med.taken;
        
        // If becoming taken, add activity
        if (newState) {
          addActivity({
            userId: 'Mom',
            type: 'medication_taken',
            authorName: currentUser,
            authorId: currentUser,
            text: `${currentUser} marked ${med.name} as taken`
          });
        }
        
        return { ...med, taken: newState, takenAt: newState ? new Date().toISOString() : undefined };
      }
      return med;
    }));
  };

  const addReading = (systolic: number, diastolic: number, pulse: number) => {
    const status = calculateBPStatus(systolic, diastolic);
    const newReading: Reading = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser,
      systolic,
      diastolic,
      pulse,
      timestamp: new Date().toISOString(),
      status
    };
    
    setSyncInProgress(true);
    // Mimic network sync
    setTimeout(() => {
      setReadings(prev => [newReading, ...prev]);
      
      addActivity({
        userId: 'Mom',
        type: 'reading',
        authorName: currentUser,
        authorId: currentUser,
        text: `${currentUser} logged a reading: ${systolic}/${diastolic}`
      });
      setSyncInProgress(false);
    }, 800);
  };

  const addActivity = (activity: Omit<Activity, 'id' | 'timestamp'>) => {
    const newActivity: Activity = {
      ...activity,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  const heartActivity = (id: string) => {
    setActivities(prev => prev.map(act => 
      act.id === id ? { ...act, hasHearted: !act.hasHearted } : act
    ));
  };

  return (
    <HealthContext.Provider value={{
      currentUser,
      setCurrentUser,
      medications,
      toggleMedication,
      readings,
      addReading,
      activities,
      addActivity,
      heartActivity,
      syncInProgress
    }}>
      {children}
    </HealthContext.Provider>
  );
}

export function useHealth() {
  const context = useContext(HealthContext);
  if (context === undefined) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
}
