import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full bg-slate-800/40 border border-slate-700/50 flex items-center justify-between px-1 cursor-pointer transition-all duration-300 hover:border-primary/50"
      title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      <div className="flex items-center justify-center w-6 h-6">
        <Moon size={14} className={`${theme === 'dark' ? 'text-primary' : 'text-slate-500'} transition-colors duration-300`} />
      </div>
      <div className="flex items-center justify-center w-6 h-6">
        <Sun size={14} className={`${theme === 'light' ? 'text-primary' : 'text-slate-500'} transition-colors duration-300`} />
      </div>
      <div 
        className={`absolute top-[2px] left-[2px] w-[22px] h-[22px] rounded-full bg-primary flex items-center justify-center shadow-md transition-all duration-300 ease-out ${
          theme === 'light' ? 'translate-x-7' : 'translate-x-0'
        }`}
      >
        {theme === 'light' ? (
          <Sun size={12} className="text-white" />
        ) : (
          <Moon size={12} className="text-white" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
