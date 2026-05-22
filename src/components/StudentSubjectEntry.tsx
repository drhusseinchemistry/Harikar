import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap, BookOpen, Settings2 } from 'lucide-react';
import { SubjectGrade } from '../types';
import { Lang } from './LanguageSelector';
import { STAGES } from '../translations';

interface StudentSubjectEntryProps {
  activeLang: Lang;
  studentName: string;
  setStudentName: (name: string) => void;
  stageId: string;
  handleStageChange: (id: string) => void;
  subjects: SubjectGrade[];
  checkedSubjects: Record<string, boolean>;
  setCheckedSubjects: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  updateSubjectScore: (id: string, scoreStr: string) => void;
  getSubjectName: (sub: SubjectGrade) => string;
  onSubmit: () => void;
  onBackToLang: () => void;
}

export default function StudentSubjectEntry({
  activeLang,
  studentName,
  setStudentName,
  stageId,
  handleStageChange,
  subjects,
  checkedSubjects,
  setCheckedSubjects,
  updateSubjectScore,
  getSubjectName,
  onSubmit,
  onBackToLang
}: StudentSubjectEntryProps) {
  
  const labelTexts = {
    kus: {
      name: 'ناوی قوتابی',
      class: 'پۆلی خوێندن',
      placeholder: 'ناوی قوتابی بنووسە...',
      head: 'بابەتەکان هەڵبژێرە لەگەڵ نمرەکانیان 📝',
      desc: 'بۆ چالاککردنی هەر بابەتێک، چوارگۆشەی پاڵ بابەتەکە دابگرە و نمرەکەی دیاری بکە (لە نێوان ٠ بۆ ١٠٠).',
      submit: 'ئەژمارکردن و بینینی ئەنجام 🏆',
      back: 'گەڕانەوە بۆ زمانەکان 🌐'
    },
    kub: {
      name: 'ناڤێ قوتابی',
      class: 'پۆلا خاندنێ',
      placeholder: 'ناڤێ قوتابی بنڤیسە...',
      head: 'بابەتان هەلبژێرە دگەل نمرێن وان 📝',
      desc: 'بۆ پێخستنا هەر بابەتەکی، چوارگوشا ڕەخ بابەتێ دابگرە و نمرەیا وێ بنڤیسە (دناڤبەرا ٠ تا ١٠٠).',
      submit: 'ئەژمارکرن و دیتنا ئەنجامی 🏆',
      back: 'زڤڕین بۆ زمانان 🌐'
    },
    ar: {
      name: 'اسم الطالب',
      class: 'الصف الدراسي',
      placeholder: 'اكتب اسم الطالب هنا...',
      head: 'أدخل معلومات الطالب والمواد الدراسية 📝',
      desc: 'قم بتفعيل المواد عن طريق تحديد المربع بجانب المادة، ثم أدخل درجتها الخاصة من (0 إلى 100).',
      submit: 'احتساب النتيجة والترشيح 🏆',
      back: 'الرجوع لاختيار اللغة 🌐'
    },
    en: {
      name: 'Student Name',
      class: 'Grade Level',
      placeholder: 'Enter student name...',
      head: 'Select Subjects & Input Grades 📝',
      desc: 'Click on the checkbox beside any subject to include it, and enter its score (from 0 to 100).',
      submit: 'Calculate & View Verdict 🏆',
      back: 'Back to Languages 🌐'
    }
  }[activeLang];

  const toggleSubject = (id: string) => {
    setCheckedSubjects(prev => {
      const current = prev[id] !== false; // default to true
      return {
        ...prev,
        [id]: !current
      };
    });
  };

  const isRtl = activeLang !== 'en';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full max-w-2xl mx-auto space-y-6 pb-20 px-4"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* 1. Header Row */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold select-none text-lg">
            🎓
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-800">
              {activeLang === 'en' ? 'Kurdistan Grade Guide' : 'شارەزای نمرە و بڕیارەکان'}
            </h1>
            <p className="text-[10px] text-slate-400 font-bold">
              {activeLang === 'en' ? 'Ministry Regulations Suite' : 'سیستەمى رەسمى بە پێى رێساکانى وەزارەت'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onBackToLang}
          className="text-xs font-bold text-slate-500 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-xl transition-all"
        >
          {labelTexts.back}
        </button>
      </div>

      {/* 2. Student Info Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Student Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-600 flex items-center gap-1.5">
              <span>👤</span> {labelTexts.name}
            </label>
            <input 
              type="text"
              value={studentName}
              placeholder={labelTexts.placeholder}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-2xl px-4 py-3 text-sm transition-all outline-none font-bold text-slate-850"
            />
          </div>

          {/* Grade Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-600 flex items-center gap-1.5">
              <span>🏫</span> {labelTexts.class}
            </label>
            <div className="relative">
              <select
                value={stageId}
                onChange={(e) => handleStageChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-2xl px-4 py-3 text-sm transition-all outline-none appearance-none font-bold text-slate-800 cursor-pointer"
              >
                <option value="4th">{STAGES['4th'][activeLang]}</option>
                <option value="5th">{STAGES['5th'][activeLang]}</option>
                <option value="6th">{STAGES['6th'][activeLang]}</option>
                <option value="7th">{STAGES['7th'][activeLang]}</option>
                <option value="8th">{STAGES['8th'][activeLang]}</option>
                <option value="10th">{STAGES['10th'][activeLang]}</option>
                <option value="11th">{STAGES['11th'][activeLang]}</option>
              </select>
              <span className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'left-4' : 'right-4'} pointer-events-none text-slate-400 text-xs`}>
                ▼
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Subjects list card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div>
          <h2 className="text-base font-black text-slate-800 flex items-center gap-2">
            <Settings2 size={18} className="text-indigo-600" />
            {labelTexts.head}
          </h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            {labelTexts.desc}
          </p>
        </div>

        <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
          {subjects.map((sub) => {
            const isChecked = checkedSubjects[sub.id] !== false;
            
            return (
              <div 
                key={sub.id} 
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-4 select-none ${isChecked ? 'bg-indigo-50/20 border-indigo-100 shadow-2xs' : 'bg-slate-50/40 border-slate-100 opacity-60'}`}
              >
                {/* Left checkbox and name */}
                <button
                  type="button"
                  onClick={() => toggleSubject(sub.id)}
                  className="flex items-center gap-3 text-right flex-1 focus:outline-none"
                >
                  <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${isChecked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white hover:border-indigo-400'}`}>
                    {isChecked && (
                      <svg className="w-3.5 h-3.5 stroke-2 stroke-current fill-none" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm font-black transition-all ${isChecked ? 'text-indigo-950 font-black' : 'text-slate-500 font-bold line-through decoration-slate-350'}`}>
                    {getSubjectName(sub)}
                  </span>
                </button>

                {/* Score Controls */}
                {isChecked ? (
                  <div className="flex items-center gap-2">
                    {/* Fast score sliders/buttons */}
                    <div className="flex gap-1">
                      {[35, 45, 50].map((scoreVal) => (
                        <button
                          key={scoreVal}
                          type="button"
                          onClick={() => updateSubjectScore(sub.id, String(scoreVal))}
                          className={`text-[9px] font-black px-1.5 py-1 rounded-md transition-colors ${sub.score === scoreVal ? 'bg-indigo-605 bg-indigo-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                        >
                          {scoreVal}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-0.5 border border-slate-200/50">
                      <button
                        type="button"
                        onClick={() => updateSubjectScore(sub.id, String(Math.max(0, sub.score - 1)))}
                        className="w-6 h-6 rounded-lg hover:bg-white text-slate-600 font-bold text-xs flex items-center justify-center active:scale-90"
                      >
                        -
                      </button>
                      
                      <input 
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={sub.score}
                        onChange={(e) => updateSubjectScore(sub.id, e.target.value)}
                        className="w-10 text-center font-black text-xs text-indigo-950 bg-transparent border-0 focus:ring-0 p-0 outline-none"
                      />

                      <button
                        type="button"
                        onClick={() => updateSubjectScore(sub.id, String(Math.min(100, sub.score + 1)))}
                        className="w-6 h-6 rounded-lg hover:bg-white text-slate-600 font-bold text-xs flex items-center justify-center active:scale-90"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ) : (
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                    {activeLang === 'en' ? 'Excluded' : activeLang === 'ar' ? 'مستبعدة' : 'لادراو'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Large Action Submit Button */}
      <motion.button
        whileHover={{ translateY: -1 }}
        whileTap={{ scale: 0.99 }}
        id="btn-trigger-calculators"
        type="button"
        onClick={onSubmit}
        className="w-full py-4.5 bg-gradient-to-r from-indigo-700 to-violet-600 hover:from-indigo-800 hover:to-violet-700 text-white font-black text-sm rounded-3xl transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>{labelTexts.submit}</span>
      </motion.button>
    </motion.div>
  );
}
