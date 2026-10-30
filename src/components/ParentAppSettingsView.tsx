import React, { useState } from 'react';
import { 
  Sun,
  Moon,
  Check
} from 'lucide-react';
import { ScreenHeader } from './ScreenHeader';

export const ParentAppSettingsView: React.FC<{
  onBack: () => void;
}> = ({ onBack }) => {
  // Theme state with localStorage persistence
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      return (localStorage.getItem('offsleek_parent_theme') as 'light' | 'dark') || 'light';
    } catch {
      return 'light';
    }
  });

  // Language state with localStorage persistence
  const [language, setLanguage] = useState<'en' | 'hi'>(() => {
    try {
      return (localStorage.getItem('offsleek_parent_language') as 'en' | 'hi') || 'en';
    } catch {
      return 'en';
    }
  });

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    try {
      localStorage.setItem('offsleek_parent_theme', newTheme);
    } catch {}
  };

  const handleLanguageChange = (newLang: 'en' | 'hi') => {
    setLanguage(newLang);
    try {
      localStorage.setItem('offsleek_parent_language', newLang);
    } catch {}
  };

  return (
    <div className="min-h-full bg-white text-black flex flex-col font-sans pb-28 selection:bg-black selection:text-white">
      {/* 1. Header */}
      <ScreenHeader
        title="App Settings"
        subtitle="Manage your app preferences"
        onBack={onBack}
        backAriaLabel="Back to Profile"
      />

      <div className="px-5 pt-4 space-y-5">
        {/* Section 1: Theme */}
        <div className="space-y-2.5">
          <h2 className="text-xs font-medium text-neutral-400">Choose your preferred theme</h2>
          
          <div className="space-y-2.5">
            {/* Light Option */}
            <div
              onClick={() => handleThemeChange('light')}
              className="bg-white border border-neutral-200/90 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs cursor-pointer hover:border-neutral-400 transition-all"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0">
                  <Sun className="w-4.5 h-4.5 stroke-[1.8]" />
                </div>
                <span className="text-xs font-bold text-black">Light</span>
              </div>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                theme === 'light' ? 'bg-black text-white' : 'border border-neutral-300'
              }`}>
                {theme === 'light' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>

            {/* Dark Option */}
            <div
              onClick={() => handleThemeChange('dark')}
              className="bg-white border border-neutral-200/90 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs cursor-pointer hover:border-neutral-400 transition-all"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0">
                  <Moon className="w-4.5 h-4.5 stroke-[1.8]" />
                </div>
                <span className="text-xs font-bold text-black">Dark</span>
              </div>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                theme === 'dark' ? 'bg-black text-white' : 'border border-neutral-300'
              }`}>
                {theme === 'dark' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Language */}
        <div className="space-y-2.5">
          <h2 className="text-xs font-medium text-neutral-400">Choose your language</h2>

          <div className="space-y-2.5">
            {/* English Option */}
            <div
              onClick={() => handleLanguageChange('en')}
              className="bg-white border border-neutral-200/90 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs cursor-pointer hover:border-neutral-400 transition-all"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-800 flex items-center justify-center font-bold text-xs shrink-0">
                  A/A
                </div>
                <span className="text-xs font-bold text-black">English</span>
              </div>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                language === 'en' ? 'bg-black text-white' : 'border border-neutral-300'
              }`}>
                {language === 'en' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>

            {/* Hindi Option */}
            <div
              onClick={() => handleLanguageChange('hi')}
              className="bg-white border border-neutral-200/90 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs cursor-pointer hover:border-neutral-400 transition-all"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-800 flex items-center justify-center font-bold text-xs shrink-0">
                  अ/रा
                </div>
                <span className="text-xs font-bold text-black">Hindi</span>
              </div>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                language === 'hi' ? 'bg-black text-white' : 'border border-neutral-300'
              }`}>
                {language === 'hi' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
