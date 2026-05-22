import React from 'react';
import { motion } from 'motion/react';
import { BookOpen } from 'lucide-react';

export type Lang = 'kus' | 'kub' | 'ar' | 'en';

interface LanguageSelectorProps {
  onSelect: (lang: Lang) => void;
}

export default function LanguageSelector({ onSelect }: LanguageSelectorProps) {
  return (
    <div className="fixed inset-0 min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 antialiased z-50 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl relative overflow-hidden text-center"
      >
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-yellow-400 to-emerald-500"></div>
        
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/15 mx-auto mb-6">
          <BookOpen size={30} className="text-white animate-pulse" />
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-slate-800 leading-tight mb-2">
          ڕێبەری ئەلیکترۆنیی نمرە و بڕیارەکان
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mb-8 leading-relaxed">
          سیستەمی ئەژمارکردنی بریار و نمرەی پۆلەکانی ٤ م پۆلی ١١ی ئامادەیی بەپێی یاساکانی وەزارەت
        </p>

        <div className="grid grid-cols-2 gap-3 mb-2">
          <button
            id="lang-kus"
            type="button"
            onClick={() => onSelect('kus')}
            className="p-5 rounded-2xl font-bold border text-sm transition-all duration-150 active:scale-95 text-center flex flex-col items-center justify-center gap-2 bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200/60"
          >
            <span className="text-2xl select-none">☀️</span>
            <span className="font-extrabold text-[#334155]">کوردى (سۆرانی)</span>
          </button>
          
          <button
            id="lang-kub"
            type="button"
            onClick={() => onSelect('kub')}
            className="p-5 rounded-2xl font-bold border text-sm transition-all duration-150 active:scale-95 text-center flex flex-col items-center justify-center gap-2 bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200/60"
          >
            <span className="text-2xl select-none">⛰️</span>
            <span className="font-extrabold text-[#334155]">کوردى (بادينى)</span>
          </button>
          
          <button
            id="lang-ar"
            type="button"
            onClick={() => onSelect('ar')}
            className="p-5 rounded-2xl font-bold border text-sm transition-all duration-150 active:scale-95 text-center flex flex-col items-center justify-center gap-2 bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200/60"
          >
            <span className="text-2xl select-none">🌴</span>
            <span className="font-extrabold text-[#334155]">العربية</span>
          </button>
          
          <button
            id="lang-en"
            type="button"
            onClick={() => onSelect('en')}
            className="p-5 rounded-2xl font-bold border text-sm transition-all duration-150 active:scale-95 text-center flex flex-col items-center justify-center gap-2 bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200/60"
          >
            <span className="text-2xl select-none">🇬🇧</span>
            <span className="font-extrabold text-[#334155]">English</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
