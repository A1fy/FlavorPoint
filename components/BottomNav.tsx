import React from 'react';
import { Screen } from '../types';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  // Removed styleVariant prop, forcing floating style
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center w-full px-4 pb-6 pointer-events-none">
      <div className="bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-floating rounded-full px-2 py-2 flex justify-between items-center w-full max-w-[340px] pointer-events-auto">
        <button 
          onClick={() => onNavigate(Screen.Home)}
          className={`flex flex-col items-center gap-1 w-14 h-14 justify-center rounded-full transition-all duration-300 ${currentScreen === Screen.Home ? 'text-primary bg-primary/10' : 'text-slate-400 hover:text-primary hover:bg-primary/5'}`}
        >
          <span className={`material-symbols-outlined text-[26px] ${currentScreen === Screen.Home ? 'filled' : ''}`}>home</span>
        </button>
        
        <button 
          onClick={() => onNavigate(Screen.Menu)}
          className={`flex flex-col items-center gap-1 w-14 h-14 justify-center rounded-full transition-all duration-300 ${currentScreen === Screen.Menu ? 'text-primary bg-primary/10' : 'text-slate-400 hover:text-primary hover:bg-primary/5'}`}
        >
          <span className={`material-symbols-outlined text-[26px] ${currentScreen === Screen.Menu ? 'filled' : ''}`}>restaurant_menu</span>
        </button>
        
        <div className="relative -top-6">
          <button 
             onClick={() => onNavigate(Screen.Cart)}
             className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transform hover:scale-105 transition-all duration-300 border-4 border-background-light dark:border-background-dark ${currentScreen === Screen.Cart ? 'bg-primary text-white shadow-primary/40' : 'bg-primary text-white shadow-primary/40'}`}
          >
            <span className="material-symbols-outlined text-[26px]">shopping_cart</span>
          </button>
        </div>
        
        <button 
          onClick={() => onNavigate(Screen.Orders)}
          className={`flex flex-col items-center gap-1 w-14 h-14 justify-center rounded-full transition-all duration-300 ${currentScreen === Screen.Orders ? 'text-primary bg-primary/10' : 'text-slate-400 hover:text-primary hover:bg-primary/5'}`}
        >
          <span className={`material-symbols-outlined text-[26px] ${currentScreen === Screen.Orders ? 'filled' : ''}`}>receipt_long</span>
        </button>
        
        <button 
          onClick={() => onNavigate(Screen.Profile)}
          className={`flex flex-col items-center gap-1 w-14 h-14 justify-center rounded-full transition-all duration-300 ${currentScreen === Screen.Profile ? 'text-primary bg-primary/10' : 'text-slate-400 hover:text-primary hover:bg-primary/5'}`}
        >
          <span className={`material-symbols-outlined text-[26px] ${currentScreen === Screen.Profile ? 'filled' : ''}`}>person</span>
        </button>
      </div>
    </nav>
  );
};
