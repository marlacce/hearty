import React from 'react';
import { motion } from 'motion/react';
import { useHealth } from '../context/HealthContext';
import { getBPStatusColor, getBPStatusText, cn } from '../lib/utils';
import { PlusCircle, Heart, Clock, CheckCircle2, Pill } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export function Home() {
  const { readings, activities, medications, heartActivity, currentUser } = useHealth();
  const navigate = useNavigate();
  
  const latestReading = readings[0];
  const nextMedication = medications.find(m => !m.taken);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8 pb-10"
    >
      {/* Greeting */}
      <section className="space-y-1">
        <p className="text-secondary font-medium tracking-wide">
          Good morning, {currentUser === 'Mom' ? 'Mom!' : 'Son!'}
        </p>
        <h2 className="text-2xl font-bold text-on-surface">Ready for your check?</h2>
      </section>

      {/* Hero Reading Card */}
      <section className="relative">
        <div className="absolute -top-4 -right-4 w-32 h-32 bg-tertiary/10 rounded-full blur-3xl"></div>
        <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-[0_8px_24px_rgba(27,28,25,0.04)] border border-outline-variant/10 relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 ${latestReading ? getBPStatusColor(latestReading.status) : 'bg-surface-container-high'}`}>
              <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
              {latestReading?.status || 'No reading'}
            </span>
            <span className="text-on-surface-variant text-sm font-medium">
              {latestReading ? `Last reading: ${formatDistanceToNow(new Date(latestReading.timestamp))} ago` : 'No readings yet'}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center py-6 text-center">
            {latestReading ? (
              <div className="flex items-baseline gap-1">
                <span className="text-7xl font-extrabold font-headline text-primary tracking-tighter">
                  {latestReading.systolic}
                </span>
                <span className="text-4xl font-bold font-headline text-primary-fixed-dim">
                  /{latestReading.diastolic}
                </span>
                <span className="text-outline-variant font-medium ml-2 uppercase text-sm">mmHg</span>
              </div>
            ) : (
              <div className="text-outline-variant font-medium">-- / --</div>
            )}
            <p className="mt-4 text-on-surface-variant max-w-[260px] leading-relaxed text-sm">
              {latestReading ? getBPStatusText(latestReading.status) : 'Start by logging your morning blood pressure reading.'}
            </p>
          </div>

          <button 
            onClick={() => navigate('/log')}
            className="w-full h-14 mt-6 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold text-lg rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
          >
            <PlusCircle size={20} />
            Log New Reading
          </button>
        </div>
      </section>

      {/* Family Activity */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-on-surface flex items-center gap-2 px-1">
          <Heart size={20} className="text-primary" fill="currentColor" />
          Family Activity
        </h3>
        
        <div className="grid gap-4">
          {activities.slice(0, 3).map((activity) => (
            <div key={activity.id} className="bg-surface-container-low rounded-2xl p-5 flex gap-4 items-start relative overflow-hidden">
              {activity.authorAvatar ? (
                <img 
                  src={activity.authorAvatar} 
                  alt={activity.authorName} 
                  className="w-12 h-12 rounded-2xl object-cover shrink-0 shadow-sm border border-outline-variant/20" 
                />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-outline-variant/20">
                  <span className="text-primary font-bold">{activity.authorName[0]}</span>
                </div>
              )}
              
              <div className="space-y-1 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-on-surface text-sm">{activity.authorName}</span>
                  {activity.authorId === 'Son' && (
                    <span className="text-[10px] font-semibold text-secondary uppercase tracking-wider bg-secondary-container/30 px-1.5 py-0.5 rounded">Med Student</span>
                  )}
                </div>
                <p className="text-on-surface-variant leading-relaxed text-sm italic">
                  "{activity.text}"
                </p>
                <div className="flex items-center gap-4 pt-1">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                    {formatDistanceToNow(new Date(activity.timestamp))} ago
                  </span>
                  {activity.type === 'note' && (
                    <button 
                      onClick={() => heartActivity(activity.id)}
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded uppercase transition-colors",
                        activity.hasHearted 
                          ? "bg-primary text-white" 
                          : "bg-primary/10 text-primary"
                      )}
                    >
                      {activity.hasHearted ? 'Hearted' : 'Heart'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Meds Glance */}
      <section className="bg-secondary-container/20 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-xl shadow-sm">
              <Pill size={20} className="text-primary" />
            </div>
            <h3 className="font-bold">Next Medication</h3>
          </div>
          <span className="text-sm font-bold text-on-secondary-container">
            {nextMedication?.time || '---'}
          </span>
        </div>
        
        {nextMedication ? (
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-outline-variant/10">
            <div>
              <p className="font-bold text-on-surface">{nextMedication.name}</p>
              <p className="text-xs text-on-surface-variant flex items-center gap-1">
                <Clock size={12} /> Take with water
              </p>
            </div>
            <button 
              onClick={() => navigate('/meds')}
              className="px-4 py-2 bg-white rounded-xl text-primary font-bold text-sm shadow-sm border border-primary/20 active:scale-95 transition-transform"
            >
              Details
            </button>
          </div>
        ) : (
          <div className="bg-white/50 p-4 rounded-2xl text-center text-sm text-secondary font-medium">
            All medications taken for today!
          </div>
        )}
      </section>
    </motion.div>
  );
}
