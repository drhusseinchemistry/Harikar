import React from 'react';
import { Send, ExternalLink } from 'lucide-react';
import { Lang } from './LanguageSelector';

interface FooterProps {
  activeLang: Lang;
}

export default function Footer({ activeLang }: FooterProps) {
  const content = {
    kus: {
      telegramText: 'بۆ بینینی دوایین پۆست و بابەتەکان، یان ئاراستەکردنی هەر پرسیارێک، سەردانی تەلەگرامی فەرمیمان بکەن:',
      telegramBtn: 'چوونە ناو کەناڵی تەلەگرام 📱',
      credit: 'ئامادەکرن: dr.hussein.chemistry ب هاریکاریا Ai'
    },
    kub: {
      telegramText: 'بۆ دیتنا دوایین پۆستان و ئاراستەکرنا هەر پرسیارەکێ، سەرەدانا تەلەگرامی مە بکەن:',
      telegramBtn: 'چوونە ناڤ کەناڵێ تەلەگرامی 📱',
      credit: 'ئامادەکرن: dr.hussein.chemistry ب هاریکاریا Ai'
    },
    ar: {
      telegramText: 'لمشاهدة آخر المنشورات ولطرح أي سؤال، تفضل بزيارة قناتنا على التليجرام:',
      telegramBtn: 'انضم إلى قناة التليجرام 📱',
      credit: 'إعداد: dr.hussein.chemistry بمساعدة الذكاء الاصطناعي (Ai)'
    },
    en: {
      telegramText: 'To view the latest educational posts or ask any questions, visit our Telegram channel:',
      telegramBtn: 'Join Telegram Channel 📱',
      credit: 'Prepared by: dr.hussein.chemistry with help of Ai'
    }
  }[activeLang];

  const isRtl = activeLang !== 'en';

  return (
    <footer className="w-full max-w-2xl mx-auto mt-8 px-4 pb-12 text-center space-y-5" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Divider */}
      <div className="flex items-center justify-center gap-3">
        <div className="h-[1px] bg-slate-200 flex-1"></div>
        <div className="w-2 h-2 rounded-full bg-indigo-200"></div>
        <div className="h-[1px] bg-slate-200 flex-1"></div>
      </div>

      {/* Prominent Telegram Helper Card */}
      <div className="bg-gradient-to-br from-sky-50 to-indigo-50/50 border border-sky-150/40 rounded-3xl p-5 shadow-sm space-y-4 relative overflow-hidden text-right">
        {/* Sky accent line */}
        <div className="absolute top-0 right-0 left-0 h-1 bg-sky-400"></div>
        
        <div className={`flex items-center gap-2.5 ${isRtl ? 'flex-row' : 'flex-row-reverse'} justify-between`}>
          <div className="flex items-center gap-2">
            <span className="text-xl">📢</span>
            <span className="text-xs sm:text-sm font-black text-sky-900">
              {activeLang === 'en' ? 'Telegram Community & Assistance' : 'کەناڵ و گرووپی فەرمی تەلەگرام'}
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-wider font-extrabold bg-sky-100 text-sky-850 px-2 py-0.5 rounded-full">
            Online
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-650 leading-relaxed font-bold">
          {content.telegramText}
        </p>

        {/* Telegram Direct Action Button */}
        <a
          href="https://t.me/qutabi_Kurdistan"
          target="_blank"
          referrerPolicy="no-referrer"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 py-3.5 px-6 font-black text-white bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 active:scale-[0.99] transition-all rounded-2xl shadow-md shadow-sky-500/10 cursor-pointer text-xs sm:text-sm text-center"
        >
          <Send size={15} className="-rotate-45" />
          <span>{content.telegramBtn}</span>
          <ExternalLink size={12} className="opacity-75" />
        </a>
      </div>

      {/* Elegant Prepared By Credit */}
      <div className="space-y-1">
        <p className="text-[11px] sm:text-xs text-slate-500 font-extrabold tracking-wide">
          {content.credit}
        </p>
        <p className="text-[10px] text-slate-400 font-semibold">
          {activeLang === 'en' ? 'Kurdistan Grade & Verdict Calculator © 2026' : 'سیستەمی ئەلیکترۆنیی ئەژماری نمرە ل هەرێما کوردستانێ © ٢٠٢٦'}
        </p>
      </div>
    </footer>
  );
}
