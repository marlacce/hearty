import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useHealth } from '../context/HealthContext';
import { calculateBPStatus, getBPStatusColor } from '../lib/utils';
import { Save, ChevronRight, Delete, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Log() {
  const { addReading, syncInProgress } = useHealth();
  const navigate = useNavigate();
  const [activeField, setActiveField] = useState<'systolic' | 'diastolic' | 'pulse'>('systolic');
  const [values, setValues] = useState({ systolic: '', diastolic: '', pulse: '' });

  const status = calculateBPStatus(parseInt(values.systolic) || 0, parseInt(values.diastolic) || 0);

  const handleNumClick = (num: string) => {
    setValues(prev => ({
      ...prev,
      [activeField]: prev[activeField].length < 3 ? prev[activeField] + num : prev[activeField]
    }));
  };

  const handleBackspace = () => {
    setValues(prev => ({
      ...prev,
      [activeField]: prev[activeField].slice(0, -1)
    }));
  };

  const nextField = () => {
    if (activeField === 'systolic') setActiveField('diastolic');
    else if (activeField === 'diastolic') setActiveField('pulse');
    else setActiveField('systolic');
  };

  const handleSave = () => {
    const s = parseInt(values.systolic);
    const d = parseInt(values.diastolic);
    const p = parseInt(values.pulse) || 72;
    
    if (s && d) {
      addReading(s, d, p);
      navigate('/');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6 pt-2"
    >
      <div className="flex items-center justify-between px-1">
        <h2 className="text-2xl font-bold font-headline text-on-surface">New Reading</h2>
        <div className="px-3 py-1 bg-surface-container-high rounded-full">
          <span className="text-sm font-medium text-on-surface-variant">Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* Input Display Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Systolic */}
        <button 
          onClick={() => setActiveField('systolic')}
          className={`bg-surface-container-lowest rounded-2xl p-6 shadow-sm border-2 transition-all text-left group ${
            activeField === 'systolic' ? 'border-primary ring-4 ring-primary/5' : 'border-transparent'
          }`}
        >
          <div className="flex items-start justify-between mb-1">
            <p className={`text-xs font-bold uppercase tracking-wider ${activeField === 'systolic' ? 'text-primary' : 'text-on-surface-variant'}`}>Systolic</p>
            {activeField === 'systolic' && values.systolic && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${getBPStatusColor(status)}`}>
                {status}
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-5xl font-extrabold font-headline transition-colors ${activeField === 'systolic' ? 'text-primary' : 'text-on-surface'}`}>
              {values.systolic || '0'}
            </span>
            <span className="text-outline-variant font-bold text-lg">mmHg</span>
          </div>
        </button>

        {/* Diastolic */}
        <button 
          onClick={() => setActiveField('diastolic')}
          className={`bg-surface-container-lowest rounded-2xl p-6 shadow-sm border-2 transition-all text-left group ${
            activeField === 'diastolic' ? 'border-primary ring-4 ring-primary/5' : 'border-transparent'
          }`}
        >
          <div className="flex items-start justify-between mb-1">
            <p className={`text-xs font-bold uppercase tracking-wider ${activeField === 'diastolic' ? 'text-primary' : 'text-on-surface-variant'}`}>Diastolic</p>
            {activeField === 'diastolic' && values.diastolic && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${getBPStatusColor(status)}`}>
                {status}
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-5xl font-extrabold font-headline transition-colors ${activeField === 'diastolic' ? 'text-primary' : 'text-on-surface'}`}>
              {values.diastolic || '0'}
            </span>
            <span className="text-outline-variant font-bold text-lg">mmHg</span>
          </div>
        </button>
      </div>

      {/* Pulse rate */}
      <button 
        onClick={() => setActiveField('pulse')}
        className={`w-full bg-surface-container-low rounded-2xl p-5 flex items-center justify-between border-2 transition-all ${
          activeField === 'pulse' ? 'border-primary ring-4 ring-primary/5' : 'border-transparent'
        }`}
      >
        <div>
          <p className={`text-xs font-bold uppercase tracking-wider ${activeField === 'pulse' ? 'text-primary' : 'text-on-surface-variant'}`}>Pulse Rate</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-3xl font-bold font-headline ${activeField === 'pulse' ? 'text-primary' : 'text-on-surface'}`}>
              {values.pulse || '0'}
            </span>
            <span className="text-outline text-sm uppercase">BPM</span>
          </div>
        </div>
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
          <Heart size={20} className="text-tertiary" fill="currentColor" />
        </div>
      </button>

      {/* Numpad */}
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
          <button
            key={n}
            onClick={() => handleNumClick(n.toString())}
            className="h-16 bg-white rounded-2xl text-2xl font-bold text-on-surface shadow-sm active:scale-95 transition-transform hover:bg-surface-container-high border border-outline-variant/10"
          >
            {n}
          </button>
        ))}
        <button 
          onClick={handleBackspace}
          className="h-16 bg-surface-container-low rounded-2xl flex items-center justify-center text-on-surface-variant active:scale-95 transition-transform border border-outline-variant/10"
        >
          <Delete size={24} />
        </button>
        <button
          onClick={() => handleNumClick('0')}
          className="h-16 bg-white rounded-2xl text-2xl font-bold text-on-surface shadow-sm active:scale-95 transition-transform hover:bg-surface-container-high border border-outline-variant/10"
        >
          0
        </button>
        <button 
          onClick={nextField}
          className="h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary active:scale-95 transition-transform border border-primary/10"
        >
          <ChevronRight size={24} strokeWidth={3} />
        </button>
      </div>

      <button 
        disabled={!values.systolic || !values.diastolic || syncInProgress}
        onClick={handleSave}
        className="w-full h-16 bg-gradient-to-r from-primary to-primary-container text-on-primary text-lg font-bold rounded-2xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
      >
        <Save size={20} />
        {syncInProgress ? 'Saving...' : 'Save Reading'}
      </button>
    </motion.div>
  );
}
