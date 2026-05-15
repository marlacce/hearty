import React from 'react';
import { motion } from 'motion/react';
import { useHealth, Medication } from '../context/HealthContext';
import { Pill, Clock, CheckCircle2, Lock, Navigation, Bell } from 'lucide-react';
import { cn } from '../lib/utils';

export function Meds() {
  const { medications, toggleMedication } = useHealth();

  const morning = medications.filter(m => m.category === 'Morning');
  const afternoon = medications.filter(m => m.category === 'Afternoon');
  const evening = medications.filter(m => m.category === 'Evening');

  const takenCount = medications.filter(m => m.taken).length;

  const MedCard = ({ med }: { med: Medication }) => {
    return (
      <div className={cn(
        "bg-surface-container-lowest rounded-3xl p-5 shadow-sm flex items-center justify-between transition-all group border border-outline-variant/10",
        med.taken && "opacity-80"
      )}>
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors",
            med.taken ? "bg-primary-fixed/30 text-primary" : "bg-secondary-fixed text-on-secondary-fixed-variant"
          )}>
            <Pill size={24} fill={med.taken ? "currentColor" : "none"} />
          </div>
          <div>
            <h3 className={cn(
              "text-lg font-bold text-on-surface transition-all",
              med.taken && "opacity-50 line-through"
            )}>
              {med.name} {med.dosage}
            </h3>
            <div className="flex items-center gap-2 text-on-surface-variant text-xs font-medium">
              <Clock size={14} />
              <span>{med.time}</span>
            </div>
          </div>
        </div>

        {med.taken ? (
          <div className="bg-primary-fixed text-on-primary-fixed-variant rounded-full px-4 py-2 flex items-center gap-2 font-bold text-xs">
            <CheckCircle2 size={14} fill="currentColor" className="text-primary" />
            Taken
          </div>
        ) : (
          <div className="flex flex-col items-end gap-1.5">
            <button 
              onClick={() => toggleMedication(med.id)}
              className="h-12 px-5 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-xl font-bold flex items-center gap-2 active:scale-95 transition-transform text-sm"
            >
              <CheckCircle2 size={16} />
              Pill Taken
            </button>
            {med.notifiesFamily && (
              <span className="text-[10px] font-bold text-secondary flex items-center gap-1 pr-1">
                <Bell size={10} /> Notifies family
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  const PendingCard = ({ med }: { med: Medication }) => (
    <div className="bg-surface-container-low rounded-3xl p-5 flex items-center justify-between opacity-80 border border-outline-variant/5">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-surface-container-highest flex items-center justify-center text-outline">
          <Pill size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-on-surface">{med.name} {med.dosage}</h3>
          <div className="flex items-center gap-2 text-on-surface-variant text-xs font-medium">
            <Clock size={14} />
            <span>{med.time}</span>
          </div>
        </div>
      </div>
      <button className="h-12 px-6 bg-surface-container-highest text-on-surface-variant rounded-xl font-bold flex items-center gap-2 cursor-not-allowed text-sm">
        <Lock size={14} />
        Pending
      </button>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-10"
    >
      <section className="space-y-1 px-1">
        <p className="text-on-surface-variant font-medium mb-1">Thursday, October 24</p>
        <h1 className="text-4xl font-extrabold text-on-surface tracking-tight leading-tight">Daily Meds</h1>
        <div className="mt-4 flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary-fixed flex items-center justify-center shadow-sm">
            <CheckCircle2 size={12} className="text-on-primary-fixed-variant" fill="currentColor" />
          </div>
          <p className="text-sm font-bold text-on-surface-variant">
            {takenCount} of {medications.length} medications taken today
          </p>
        </div>
      </section>

      <div className="space-y-8">
        {/* Morning */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-primary ml-1">Morning</h2>
          <div className="grid gap-4">
            {morning.map(med => <div key={med.id}><MedCard med={med} /></div>)}
          </div>
        </div>

        {/* Afternoon */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-tertiary ml-1">Afternoon</h2>
          <div className="grid gap-4">
            {afternoon.map(med => <div key={med.id}><MedCard med={med} /></div>)}
          </div>
        </div>

        {/* Evening */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant ml-1 opacity-60">Evening</h2>
          <div className="grid gap-4">
            {evening.map(med => <div key={med.id}><PendingCard med={med} /></div>)}
          </div>
        </div>
      </div>

      {/* Health Note Suggestion Card */}
      <section className="bg-on-primary-fixed text-on-primary-fixed-variant p-8 rounded-3xl flex flex-col md:flex-row gap-6 items-center shadow-xl relative overflow-hidden mt-12 mb-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="relative z-10 flex-1">
          <h4 className="text-xl font-bold mb-2">Feeling side effects?</h4>
          <p className="text-sm opacity-90 leading-relaxed">It's important to track how you feel after your dose. Add a note to share with your care team.</p>
          <button className="mt-6 px-6 py-2.5 bg-primary-fixed-dim text-on-primary-fixed font-bold rounded-full text-sm hover:opacity-90 transition-opacity shadow-lg">
            Add Symptom Log
          </button>
        </div>
        <div className="w-24 h-24 shrink-0 rounded-2xl overflow-hidden shadow-lg transform rotate-3 border-2 border-primary-fixed/30 bg-white">
          <img 
            alt="Medication health" 
            className="w-full h-full object-cover" 
            src="https://picsum.photos/seed/meditation/300/300"
          />
        </div>
      </section>
    </motion.div>
  );
}
