import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HealthProvider } from './context/HealthContext';
import { BottomNav } from './components/BottomNav';
import { TopAppBar } from './components/TopAppBar';
import { Home } from './screens/Home';
import { Log } from './screens/Log';
import { Meds } from './screens/Meds';
import { Chat } from './screens/Chat';
import { AnimatePresence } from 'motion/react';

function AppContent() {
  return (
    <div className="min-h-screen bg-background pb-32">
      <TopAppBar />
      <main className="pt-24 px-6 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/log" element={<Log />} />
            <Route path="/meds" element={<Meds />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <HealthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </HealthProvider>
  );
}
