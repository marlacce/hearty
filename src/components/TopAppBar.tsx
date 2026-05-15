import React from 'react';
import { Users } from 'lucide-react';
import { useHealth } from '../context/HealthContext';

export function TopAppBar() {
  const { currentUser, setCurrentUser } = useHealth();

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl shadow-[0_8px_24px_rgba(27,28,25,0.06)] bg-gradient-to-b from-surface-container-low/20 to-transparent">
      <div className="flex justify-between items-center px-6 h-16 w-full max-w-2xl mx-auto">
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setCurrentUser(currentUser === 'Mom' ? 'Son' : 'Mom')}
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-fixed">
            <img 
              alt="User Profile" 
              className="w-full h-full object-cover" 
              src={currentUser === 'Mom' 
                ? "https://lh3.googleusercontent.com/aida-public/AB6AXuC4u1SaBBQHqU5apNQM5vq05ZRVVrl_4okA13mAYMpxM2DMLMLeTBOcX095U_3aXy60rP07Jgp7_XSbhqzaUBeRRHsfq1ZPPWX0AjANWDIk_TaJL4w7bpUSIRjWXaEY4X3ykJkGOhx3hokWL8U1LrltrKEv2y4h41jgK7Birygix4UlS-RNWt88197fjnJRnpGyipEbmHXR-R48n5h2TzE4olVC_IKct0mg8EE_nNSy4Cm9hERQk_Wt9qz0mpqQio1JcS4XInilmEIL"
                : "https://lh3.googleusercontent.com/aida-public/AB6AXuALpSeoHa6IEFszpp4BBbyZxI4bdtsKprKGcYBpRpSUREHRa9u9PcZ6iBLCt9Ciijpg_Ho24daikO-ktKiLsnTN3YarWLwKqkhjCybPLjL-e_OM7N4iCwhzkxSHJz0SMnQJVB30MuShy9Qyg_H42CfiLckWzZsMX_zHmwiWB4OEdCqyMVlspF6at_PzdKR1tDwOfp0cTD4eebXx1-Czj2VEogFoYRXrCp8rhunLlZ3lH4tzlcE4Tm5kf79YmpIo7pjvGl7TvJuwM27_"
              }
            />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-primary font-headline">Hearty</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-secondary hover:opacity-80 transition-opacity active:scale-95">
            <div className="relative">
              <Users size={24} />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background"></span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
