/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  RotateCcw, 
  Award, 
  AlertTriangle, 
  BookOpen, 
  GraduationCap, 
  HelpCircle, 
  Share2, 
  Sparkles, 
  Info, 
  CheckCircle2, 
  XOctagon, 
  Settings, 
  Percent, 
  Columns,
  Check,
  ClipboardCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SubjectGrade, HelpSystemMode } from './types';
import { calculateGrades } from './utils/gradeCalculator';

// Predefined Kurdish school presets showing different academic scenarios
const PRESETS = [
  {
    title: '🏆 ناجح بە تەواوی (Excellent Pass)',
    description: 'قوتابییەکی پۆلی گشتی کە سەرجەم بابەتەکانی بەبێ یارمەتی نمرە دەرچووە.',
    subjects: [
      { id: '1', name: 'کیمیا (Chemistry)', score: 78 },
      { id: '2', name: 'فیزیا (Physics)', score: 82 },
      { id: '3', name: 'بیرکاری (Mathematics)', score: 65 },
      { id: '4', name: 'زیندەوەر (Biology)', score: 70 },
      { id: '5', name: 'ئینگلیزی (English)', score: 74 },
      { id: '6', name: 'کوردی (Kurdish)', score: 85 },
    ],
  },
  {
    title: '⚡ ڕزگاربوو بە (٥ بڕیار + ١٠ مەرجی عوبور)',
    description: 'قوتابییەک یەک بابەتی ٣٥ ھەیە دەرئەچێت چونکە ٥ نمرەی فەرمی و ١٠ نمرەی عوبور دەبێتە ٥٠.',
    subjects: [
      { id: '1', name: 'کیمیا (Chemistry)', score: 35 },
      { id: '2', name: 'فیزیا (Physics)', score: 65 },
      { id: '3', name: 'بیرکاری (Mathematics)', score: 55 },
      { id: '4', name: 'زیندەوەر (Biology)', score: 70 },
      { id: '5', name: 'ئینگلیزی (English)', score: 60 },
      { id: '6', name: 'کوردی (Kurdish)', score: 72 },
    ],
  },
  {
    title: '💫 پێدانی ١٠ نمرەی عوبوری بابەتێکی تاک',
    description: 'قوتابییەک کە بابەتێکی لە ٤٠ نمرەیە و تەنها بە بڕیاری ١٠ نمرەی عوبور سەرکەوتوو دەبێت.',
    subjects: [
      { id: '1', name: 'کیمیا (Chemistry)', score: 40 },
      { id: '2', name: 'فیزیا (Physics)', score: 68 },
      { id: '3', name: 'بیرکاری (Mathematics)', score: 71 },
      { id: '4', name: 'زیندەوەر (Biology)', score: 50 },
      { id: '5', name: 'ئینگلیزی (English)', score: 65 },
      { id: '6', name: 'کوردی (Kurdish)', score: 75 },
    ],
  },
];

export default function App() {
  const [studentName, setStudentName] = useState<string>('');
  const [stageName, setStageName] = useState<string>('پۆلی دەیەم');
  const [subjects, setSubjects] = useState<SubjectGrade[]>([
    { id: '1', name: 'کیمیا (Chemistry)', score: 35 },
    { id: '2', name: 'فیزیا (Physics)', score: 72 },
    { id: '3', name: 'بیرکاری (Mathematics)', score: 65 },
    { id: '4', name: 'زیندەوەر (Biology)', score: 80 },
    { id: '5', name: 'کۆمپیوتەر (Computer)', score: 90 },
    { id: '6', name: 'جینۆساید (Genocide)', score: 75 },
    { id: '7', name: 'ماف (Human Rights)', score: 88 },
    { id: '8', name: 'وەرزش (Sports)', score: 95 },
    { id: '9', name: 'هونەر (Art)', score: 92 },
    { id: '10', name: 'ئینگلیزی (English)', score: 58 },
    { id: '11', name: 'عەرەبی (Arabic)', score: 63 },
    { id: '12', name: 'کوردی (Kurdish)', score: 70 },
    { id: '13', name: 'ئاین (Religion)', score: 98 },
    { id: '14', name: 'کۆمەڵایەتی (Social Studies)', score: 67 },
  ]);

  const [helpMode, setHelpMode] = useState<HelpSystemMode>('total_pool');
  const [activeTab, setActiveTab] = useState<'calculator' | 'rules'>('calculator');
  const [copied, setCopied] = useState(false);

  // State for Round 2 assessments (هەرسەنگاندن - 2 marks of 10 each)
  const [assessments, setAssessments] = useState<Record<string, { a1: number; a2: number }>>({});

  const getAssessment = (id: string) => {
    return assessments[id] || { a1: 10, a2: 10 }; // Default to 10 and 10 as requested
  };

  const updateAssessment = (id: string, field: 'a1' | 'a2', valueStr: string) => {
    let val = parseInt(valueStr) || 0;
    if (val < 0) val = 0;
    if (val > 10) val = 10;
    setAssessments(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || { a1: 10, a2: 10 }),
        [field]: val
      }
    }));
  };

  // Handle stage change constraints and dynamic deletion of subjects
  const handleStageChange = (newStage: string) => {
    setStageName(newStage);

    const is4to8 = ["پۆلی چوارەم", "پۆلی پێنجەم", "پۆلی شەشەم", "پۆلی حەفتەم", "پۆلی هەشتەم"].includes(newStage);
    const is10to11 = ["پۆلی دەیەم", "پۆلی یازدەیەم"].includes(newStage);

    const isExcludedForGrade4to9 = (name: string) => {
      const normalized = name.toLowerCase();
      return (
        normalized.includes('زیندەوەر') ||
        normalized.includes('کیمیا') ||
        normalized.includes('فیزیا') ||
        normalized.includes('جینۆساید') ||
        normalized.includes('جینوساید') ||
        normalized.includes('biology') ||
        normalized.includes('chemistry') ||
        normalized.includes('physics') ||
        normalized.includes('genocide')
      );
    };

    const isExcludedForGrade10to12 = (name: string) => {
      const normalized = name.toLowerCase();
      return (
        normalized.includes('زانست') ||
        normalized.includes('کارامەیی') ||
        normalized.includes('کارامایی') ||
        normalized.includes('science') ||
        normalized.includes('skills')
      );
    };

    if (is4to8) {
      setSubjects(prev => prev.filter(s => !isExcludedForGrade4to9(s.name)));
    } else if (is10to11) {
      setSubjects(prev => prev.filter(s => !isExcludedForGrade10to12(s.name)));
    }
  };

  // Auto calculation on inputs change
  const calculation = useMemo(() => {
    return calculateGrades(subjects, helpMode);
  }, [subjects, helpMode]);

  // Overall statistics
  const averageScore = useMemo(() => {
    if (subjects.length === 0) return 0;
    const total = subjects.reduce((sum, s) => sum + s.score, 0);
    return Math.round((total / subjects.length) * 10) / 10;
  }, [subjects]);

  const initialFailedCount = useMemo(() => {
    return subjects.filter((s) => s.score < 50).length;
  }, [subjects]);

  // Handle subject changes
  const updateSubjectName = (id: string, name: string) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, name } : s));
  };

  const updateSubjectScore = (id: string, scoreStr: string) => {
    let score = parseInt(scoreStr) || 0;
    if (score < 0) score = 0;
    if (score > 100) score = 100;
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, score } : s));
  };

  const setFixedScore = (id: string, fixedScore: number) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, score: fixedScore } : s));
  };

  const removeSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  const addNewSubject = () => {
    const newId = (Math.max(...subjects.map(s => parseInt(s.id) || 0), 0) + 1).toString();
    setSubjects(prev => [
      ...prev,
      { id: newId, name: `بابەتی نوێ ${newId}`, score: 50 }
    ]);
  };

  const applyPreset = (presetSubjects: SubjectGrade[]) => {
    const cloned = presetSubjects.map(s => ({ ...s, id: `${Math.random()}` }));
    setSubjects(cloned);
  };

  const clearAllSubjects = () => {
    setSubjects([]);
  };

  // Generate localized share report copy
  const handleCopyReport = () => {
    const toKurdishDigits = (val: number | string): string => {
      const digits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
      return String(val).replace(/[0-9]/g, (w) => digits[parseInt(w, 10)]);
    };

    const emojiStatus = 
      calculation.status === 'passed' ? '🟢 دەرچوو (ناجح) 🎓' : 
      calculation.status === 'uboor' ? '🔵 سەرکەوت بۆ قۆناغی تر بە عوبور (مەرجدار)' : '🔴 دەرنەچوو (ڕاسیب) ⚠️';

    let text = `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += ` 👨‍🎓 ڕاپۆرتی ئەنجامی قوتابی: ${studentName || 'نەناسراو'}\n`;
    text += ` 🏫 قۆناغ: ${stageName}\n`;
    text += ` 📊 تێکڕای گشتی نمرەکان: ${toKurdishDigits(averageScore)}٪\n`;
    text += ` 📝 بارودۆخی کۆتایی: ${emojiStatus}\n`;
    text += ` ⚙️ مۆد: ${helpMode === 'per_subject' ? 'یارمەتی ٥ نمرەی جیاواز بۆ هەر بابەتێک' : 'کۆی گشتی ٥ نمرە بۆ کۆی بابەتەکان'} + ١٠ نمرەی بابەتێکی تاک\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    text += `📚 لیستی بابەتەکان:\n`;

    calculation.subjects.forEach((sub, idx) => {
      const helperText = sub.helpMarksAdded > 0 
        ? ` (لەگەڵ +${toKurdishDigits(sub.helpMarksAdded)} نمرەی بڕیار 👈 نمرەی سەرەکی ${toKurdishDigits(sub.originalScore)})` 
        : '';
      const statusIcon = sub.isPassed ? '✅' : '❌';
      text += ` ${toKurdishDigits(idx + 1)}. ${statusIcon} ${sub.name}: ${toKurdishDigits(sub.finalScore)} نمرە ${helperText}\n`;
      
      if (!sub.isPassed) {
        // Compute Round 1 missing:
        let r1Help = '';
        const score = sub.originalScore;
        if (score < 35) {
          const to35 = 35 - score;
          const to50 = 50 - score;
          r1Help = `پێویستت بە ${toKurdishDigits(to35)} نمرەی تر هەبوو لە خولی یەکەمدا بۆ عوبوری مەرجدار (ببێتە ٣٥)، یان ${toKurdishDigits(to50)} نمرە بۆ دەرچوونی تەواو (ببێتە ٥٠)`;
        } else if (score < 40) {
          const to40 = 40 - score;
          const to50 = 50 - score;
          r1Help = `پێویستت بە ${toKurdishDigits(to40)} نمرەی تر هەبوو لە خولی یەکەمدا بۆ عوبوری سادە (ببێتە ٤٠)، یان ${toKurdishDigits(to50)} نمرە بۆ دەرچوونی تەواو (ببێتە ٥٠)`;
        } else if (score < 45) {
          const to45 = 45 - score;
          const to50 = 50 - score;
          r1Help = `پێویستت بە ${toKurdishDigits(to45)} نمرەی تر هەبوو لە خولی یەکەم بۆ چانسی ئاسانتری یارمەتی (ببێتە ٤٥)، یان ${toKurdishDigits(to50)} نمرە بۆ دەرچوونی تەواو (ببێتە ٥٠)`;
        } else {
          const to50 = 50 - score;
          r1Help = `تەنها پێویستت بە ${toKurdishDigits(to50)} نمرەی تر هەبوو لە خولی یەکەم بۆ دەرچوونی تەواو (ببێتە ٥٠) و ڕێگری لە دەوری دووەم`;
        }
        
        // Compute Round 2 required:
        const isUboorEligible = !!sub.isUboorEligibleInRound2;
        const ass = getAssessment(sub.id);
        const totalAssessment = ass.a1 + ass.a2;
        const targetScore = isUboorEligible ? 40 : 50;
        const reqFrom80 = Math.max(0, targetScore - totalAssessment);
        
        const uboorLabel = isUboorEligible 
          ? `عوبور (ببێتە ٤٠)` 
          : `دەرچوونی تەواو (ببێتە ٥٠)`;
          
        text += `   📍 خولی یەکەم: ئەگەر « ${r1Help} »، نەدەچوویتە دەوری دوو.\n`;
        text += `   📝 خولی دووەم: دەبێت نمرەت لە تاقیکردنەوەی خولی دووەمدا کەمتر نەبێت لە « ${toKurdishDigits(reqFrom80)} لەسەر ٨٠ » (بۆ ئەوەی کۆی گشتی بە خولی دووەم لەگەڵ نمرەی هەڵسەنگاندن بگاتە ${toKurdishDigits(targetScore)} وەک ${uboorLabel}).\n\n`;
      }
    });

    if (calculation.totalHelpMarksUsed > 0) {
      text += `\n🎯 نمرەی هاوکاری بەکارهاتوو لە خولی یەکەمدا: ${toKurdishDigits(calculation.totalHelpMarksUsed)} نمرە\n`;
    }

    text += `\n🌐 ئەژمارکراوە لە ڕێگەی "ڕێبه‌ری ئه‌لیكترۆنی بۆ نمره‌كان و ڕێسای عوبور"`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased rtl-grid" dir="rtl">
      
      {/* Dynamic Top Indicator Bar */}
      <div className="bg-sky-950 text-white text-xs py-2 px-4 flex justify-between items-center shadow-inner font-mono border-b border-sky-900/40">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>سیستەمی فەرمی ئەژمارکردنی ئەنجامی خوێندن</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-sky-200">
          <span>کاتی مێژوویی: ٢٠٢٦</span>
          <span>کۆتایی چاککردنەوە: ٢٠٢٦-٠٥-٢٠</span>
        </div>
      </div>

      {/* Main Brand Header with Kurdish Motif */}
      <header className="bg-white border-b border-slate-200 relative overflow-hidden shrink-0">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-yellow-400 to-emerald-500"></div>
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/10 shrink-0">
              <BookOpen size={36} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-800 text-xs px-2.5 py-0.5 rounded-full font-bold border border-indigo-200/50">سیستەمی قوتابخانەکان</span>
                <span className="text-xs text-indigo-600 font-semibold font-mono">Kurdish School System</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight tracking-tight mt-1">
                ڕێساکانی تێپەڕبوون و بڕیاری عوبور (قوتابخانەکانی کوردستان)
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">
                سیستەمی فەرمی پەروەردەی هەرێم: نمرەی ٣٥ بە یارمەتی ٥ نمرەی بڕیار دەبێتە ٤٠ و بە ١٠ نمرەی عوبور دەگۆڕێت بۆ ٥٠ (پاسکردنی فەرمی).
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex bg-slate-100 p-1 rounded-xl self-stretch md:self-auto">
            <button 
              id="tab-calculator"
              onClick={() => setActiveTab('calculator')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'calculator' ? 'bg-white text-sky-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <BookOpen size={16} />
              <span>ئەژمێریاری نمرەکان</span>
            </button>
            <button 
              id="tab-rules"
              onClick={() => setActiveTab('rules')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'rules' ? 'bg-white text-sky-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <HelpCircle size={16} />
              <span>شیکردنەوەی یاساکان</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="grow max-w-7xl w-full mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'calculator' ? (
            <motion.div 
              key="calculator-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              
              {/* Left Column (8-col width): inputs and subjects controller */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* 1. Quick Presets Gallery */}
                <section id="presets-card" className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="text-amber-500 shrink-0" size={18} />
                    <h2 className="text-base font-bold text-slate-800">تاقیکردنەوەی حالەتە پێشوەختەکان (Select Presets)</h2>
                  </div>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                    بە کلیک لەسەر هەر قوتابییەک ببینە چۆن بڕیاری ٥ نمرە و ١٠ نمرەی بابەتەکان ئەنجامی دەرچوونیان دەگۆڕێت:
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {PRESETS.map((p, idx) => {
                      // run initial classification mock for tags
                      const tagResult = calculateGrades(p.subjects, helpMode);
                      const baseColor = 
                        tagResult.status === 'passed' ? 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-950' :
                        tagResult.status === 'uboor' ? 'border-sky-200 bg-sky-50/50 hover:bg-sky-50 text-sky-950' :
                        'border-red-200 bg-red-50/50 hover:bg-red-50 text-red-910';

                      const statusText = 
                        tagResult.status === 'passed' ? 'دەرچوو' :
                        tagResult.status === 'uboor' ? 'عوبور' : 'دەرنەچوو';

                      return (
                        <button 
                          key={p.title}
                          id={`preset-${idx}`}
                          onClick={() => applyPreset(p.subjects)}
                          className={`text-right p-3.5 rounded-xl border text-xs leading-normal transition-all duration-150 hover:translate-y-[-2px] hover:shadow-sm flex flex-col justify-between h-full ${baseColor}`}
                        >
                          <div>
                            <span className="font-bold block text-slate-900 text-sm mb-1">{p.title}</span>
                            <span className="text-slate-500 block text-[11px] mb-2">{p.description}</span>
                          </div>
                          <div className="flex justify-between items-center w-full mt-2 pt-2 border-t border-slate-200/30">
                            <span className="font-semibold text-[10px] uppercase tracking-wider">ئەنجام: {statusText}</span>
                            <span className="text-[10px] font-mono text-slate-500">ماتماتیکی گشتی</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>

                {/* 2. Student Info Details */}
                <section id="student-info-card" className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
                  <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                    <BookOpen size={20} className="text-sky-600" />
                    <h2 className="text-lg font-bold text-slate-800">زانیاری سەرەتایی قوتابی (Student General Info)</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label id="lbl-student-name" className="block text-xs font-semibold text-slate-600 mb-1.5">ناوی قوتابی (ئارەزوومەندانە)</label>
                      <input 
                        id="input-student-name"
                        type="text" 
                        placeholder="بۆ نموونە: دیار ئاسۆ حەسەن"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl px-4 py-3 text-sm transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label id="lbl-student-level" className="block text-xs font-semibold text-slate-600 mb-1.5">پۆلی خوێندن / قۆناغ (Grade)</label>
                      <select 
                        id="select-student-level"
                        value={stageName}
                        onChange={(e) => handleStageChange(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl px-4 py-3 text-sm transition-all outline-none"
                      >
                        <option value="پۆلی چوارەم">پۆلی چوارەم (4th Grade)</option>
                        <option value="پۆلی پێنجەم">پۆلی پێنجەم (5th Grade)</option>
                        <option value="پۆلی شەشەم">پۆلی شەشەم (6th Grade)</option>
                        <option value="پۆلی حەفتەم">پۆلی حەفتەم (7th Grade)</option>
                        <option value="پۆلی هەشتەم">پۆلی هەشتەم (8th Grade)</option>
                        <option value="پۆلی دەیەم">پۆلی دەیەم (10th Grade)</option>
                        <option value="پۆلی یازدەیەم">پۆلی یازدەیەم (11th Grade)</option>
                      </select>
                    </div>
                  </div>
                </section>

                {/* 3. Main Grade Inputs Dashboard */}
                <section id="subject-grades-card" className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs relative">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Percent size={20} className="text-sky-600" />
                        <h2 className="text-lg font-bold text-slate-800">نمرەکانی هەموو بابەتەکان (Subject Grades)</h2>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        نمرەی دروستی بابەتەکان لەنێوان (٠ تا ١٠٠) بنووسە. بە بەکارهێنانی دوگمە خێراکان دەتوانیت نمرە هەستیارەکان ڕێکبخەیت.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-stretch sm:self-auto">
                      <button 
                        id="btn-add-subject"
                        onClick={addNewSubject}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-sky-950 hover:bg-sky-900 active:bg-sky-950 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm"
                      >
                        <Plus size={16} />
                        <span>بابەتی تر زیاد بکە</span>
                      </button>
                      <button 
                        id="btn-clear-all"
                        onClick={clearAllSubjects}
                        className="flex items-center justify-center gap-1 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-700 border border-rose-200/40 text-xs font-semibold px-3 py-2.5 rounded-xl transition-all"
                        title="پاککردنەوەی هەمووی بابەتەکان"
                      >
                        <Trash2 size={16} />
                        <span className="hidden sm:inline">سڕینەوەی هەموو</span>
                      </button>
                    </div>
                  </div>

                  {subjects.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200 px-4"
                    >
                      <BookOpen size={48} className="text-slate-300 mx-auto mb-3" />
                      <h3 className="font-bold text-slate-700 text-base">لیستی بابەتەکان بەتاڵە</h3>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4 leading-relaxed">
                        هیچ بابەتێک زیاد نەکراوە بۆ ئەژمارکردنی ئەنجام. تکایە بابەتێک زیاد بکە یان یەکێک لە قوتابییە نموونەکانی سەرەوە هەڵبژێرە.
                      </p>
                      <button 
                        id="btn-empty-add-subject"
                        onClick={addNewSubject}
                        className="inline-flex items-center gap-2 bg-sky-950 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-sky-900 transition-all shadow-sm"
                      >
                        <Plus size={16} />
                        <span>زیادکردنی یەکەم بابەت</span>
                      </button>
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      <AnimatePresence initial={false}>
                        {subjects.map((sub, index) => {
                          const isFailedInitially = sub.score < 50;
                          const calculatedSub = calculation.subjects.find(s => s.id === sub.id);
                          const isTrulyPassed = calculatedSub ? calculatedSub.isPassed : !isFailedInitially;
                          const helpRuleUsed = calculatedSub ? calculatedSub.helpRuleUsed : 'none';
                          const helpMarksAdded = calculatedSub ? calculatedSub.helpMarksAdded : 0;
                          const isUboorEligible = calculatedSub ? !!calculatedSub.isUboorEligibleInRound2 : false;
                          const unsavedFailedCount = calculation.subjects.filter(s => !s.isPassed).length;

                          // Split help marks into decision (bıryar) and uboor:
                          let d_needed = 0;
                          let u_needed = 0;
                          if (isTrulyPassed && helpRuleUsed === '10_marks_rule') {
                            d_needed = Math.max(0, 40 - sub.score);
                            u_needed = 50 - sub.score - d_needed;
                          } else if (isTrulyPassed && helpRuleUsed === '5_marks_rule') {
                            d_needed = helpMarksAdded;
                          }

                           // Generate custom help message for initially failed non-passed subject:
                           let failedNoticeText = "";
                           if (isFailedInitially && !isTrulyPassed) {
                             if (sub.score < 35) {
                               const diff = 35 - sub.score;
                               const diff50 = 50 - sub.score;
                               if (sub.score === 34) {
                                 failedNoticeText = "خولی یەکەم تۆ پێویستت بە تەنها ١ نمرەیە بۆ ئەوەی بە دەرچوون (عوبور) حساب بکرێی، یان پێویستت بە ١٦ نمرەیە بۆ ئەوەی بە تەواوی دەربچیت (ببێتە ٥٠).";
                               } else {
                                 failedNoticeText = `خولی یەکەم تۆ پێویستت بە ${diff} نمرەیە بۆ ئەوەی بگەی بە ٣٥ و بە دەرچوون (عوبور) حساب بکرێی، یان پێویستت بە ${diff50} نمرەیە بۆ ئەوەی بە تەواوی دەربچیت.`;
                               }
                             } else if (sub.score < 40) {
                               const diff = 40 - sub.score;
                               const diff50 = 50 - sub.score;
                               failedNoticeText = `تۆ پێویستت بە ${diff} نمرەی تر هەیە لە خولی یەکەمدا بۆ ئەوەی بگەیە ٤٠ و بە عوبوری سادە تێپەڕ بیت، یان ${diff50} نمرە بۆ ئەوەی بە تەواوی دەربچیت و بێ بڕیار ناجح بیت.`;
                             } else if (sub.score < 45) {
                               const diff = 45 - sub.score;
                               const diff50 = 50 - sub.score;
                               failedNoticeText = `کەمێک هەوڵ بدە! تۆ پێویستت بە ${diff} نمرەیە لە خولی یەکەمدا بۆ ئەوەی بگەیە بە ٤٥ کە چانسی دەرچوونی ئاسانتەرە، یان پێویستت بە ${diff50} نمرەی تر هەیە بۆ ئەوەی بە تەواوی بگەیە ٥٠ و ناجح بیت.`;
                             } else {
                               const diff = 50 - sub.score;
                               failedNoticeText = `تۆ پێویستت بە تەنها ${diff} نمرەی تر هەیە لە خولی یەکەمدا بۆ ئەوەی بگەیە بە ٥٠ و بە تەواوی بەبێ پێویست بوون بە بڕیار یان جێبەجێکردنی عوبور دەربچیت.`;
                             }
                           }

                          return (
                            <motion.div 
                              key={sub.id}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className={`p-4 rounded-xl border transition-all duration-150 ${
                                sub.score >= 50 
                                  ? 'bg-white border-slate-200/70 hover:border-slate-300' 
                                  : isTrulyPassed 
                                    ? 'bg-emerald-50/10 border-emerald-100 hover:border-emerald-200' 
                                    : 'bg-red-50/40 border-red-100 hover:border-red-200'
                              }`}
                            >
                              <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
                                
                                <div className="flex-1 flex gap-3 items-center">
                                  {/* Subject Index Badge */}
                                  <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-500 shrink-0 font-mono">
                                    {index + 1}
                                  </span>
                                  {/* Subject Name Input */}
                                  <input 
                                    id={`input-subject-name-${sub.id}`}
                                    type="text"
                                    value={sub.name}
                                    onChange={(e) => updateSubjectName(sub.id, e.target.value)}
                                    placeholder="ناوی بابەت (بۆ نموونە: بیرکاری)"
                                    className="grow bg-transparent border-0 focus:border-b focus:border-sky-500 focus:ring-0 text-sm font-semibold text-slate-800 placeholder-slate-400 p-1 rounded transition-none"
                                  />
                                </div>

                                <div className="flex-1 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                                  {/* Visual Slider */}
                                  <div className="grow flex items-center gap-2 select-none">
                                    <span className="text-[10px] text-slate-400 font-mono">0</span>
                                    <input 
                                      id={`slider-subject-${sub.id}`}
                                      type="range"
                                      min="0"
                                      max="100"
                                      value={sub.score}
                                      onChange={(e) => updateSubjectScore(sub.id, e.target.value)}
                                      className="h-1.5 grow bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-950" 
                                    />
                                    <span className="text-[10px] text-slate-400 font-mono">100</span>
                                  </div>

                                  {/* Quick Threshold Modifiers */}
                                  <div className="flex items-center gap-1 justify-center shrink-0">
                                    <button 
                                      id={`btn-modifier-40-${sub.id}`}
                                      onClick={() => setFixedScore(sub.id, 40)}
                                      className="bg-red-50 hover:bg-red-100 text-rose-800 text-[10px] font-bold px-2 py-1 rounded border border-red-100 font-mono transition-colors"
                                      title="بۆ تاقیکردنەوەی بڕیاری دە نمرە"
                                    >
                                      ٤٠
                                    </button>
                                    <button 
                                      id={`btn-modifier-45-${sub.id}`}
                                      onClick={() => setFixedScore(sub.id, 45)}
                                      className="bg-amber-50 hover:bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-1 rounded border border-amber-100 font-mono transition-colors"
                                      title="بۆ تاقیکردنەوەی بڕیاری پێنج نمرە"
                                    >
                                      ٤٥
                                    </button>
                                    <button 
                                      id={`btn-modifier-49-${sub.id}`}
                                      onClick={() => setFixedScore(sub.id, 49)}
                                      className="bg-teal-50 hover:bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-1 rounded border border-teal-100 font-mono transition-colors"
                                      title="پێویستی بە یەک نمرە هەیە بۆ دەرچوون"
                                    >
                                      ٤٩
                                    </button>
                                    <button 
                                      id={`btn-modifier-50-${sub.id}`}
                                      onClick={() => setFixedScore(sub.id, 50)}
                                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded border border-emerald-100 font-mono transition-colors"
                                      title="دەرچوونی سەرەتایی بێ یارمەتی"
                                    >
                                      ٥٠
                                    </button>
                                  </div>

                                  {/* Score Numeric Input Box */}
                                  <div className="flex items-center gap-2 justify-end w-max shrink-0 self-end sm:self-auto">
                                    <div className="relative">
                                      <input 
                                        id={`input-grade-${sub.id}`}
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={sub.score}
                                        onChange={(e) => updateSubjectScore(sub.id, e.target.value)}
                                        className={`w-14 text-center font-bold text-sm px-1 py-1.5 rounded-lg border focus:ring-1 outline-none text-slate-800 ${isFailedInitially ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' : 'border-slate-200 bg-slate-50 focus:ring-sky-500 focus:border-sky-500'}`}
                                      />
                                      <span className="absolute -top-1.5 -left-1 text-[8px] tracking-tight bg-slate-900 text-slate-200 px-1 rounded-sm font-mono scale-[0.85]">
                                        نمرە
                                      </span>
                                    </div>

                                    {/* Score Status Badge */}
                                    <span className={`w-14 text-center px-1 py-1.5 rounded-lg text-[10px] font-bold block ${
                                      sub.score >= 50 
                                        ? 'bg-green-100 text-green-900 border border-green-200/50' 
                                        : isTrulyPassed 
                                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-200/50' 
                                          : 'bg-red-100 text-red-900 border border-red-200/50'
                                    }`}>
                                      {sub.score >= 50 
                                        ? 'دەرچوو' 
                                        : isTrulyPassed 
                                          ? 'دەرچوو بە یارمەتی' 
                                          : 'دەرنەچوو'}
                                    </span>

                                    {/* Delete Subject Button */}
                                    <button 
                                      id={`btn-delete-${sub.id}`}
                                      onClick={() => removeSubject(sub.id)}
                                      className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                                      title="سڕینەوەی بابەت"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>

                                </div>

                              </div>
                              {isFailedInitially && (
                                <div className="mt-3.5 pt-3.5 border-t border-red-200/40 space-y-3 shrink-0">
                                  <div className={`rounded-xl border p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 ${isTrulyPassed ? 'bg-emerald-50/80 border-emerald-100 text-emerald-950' : 'bg-amber-50/60 border-amber-100 text-amber-950'}`}>
                                    <p className="text-xs font-semibold leading-relaxed">
                                      {isTrulyPassed ? (
                                        helpRuleUsed === '10_marks_rule' ? (
                                          <span>
                                            🎉 <strong className="font-extrabold text-emerald-900">دەرچوو بە بڕیار و عوبور!</strong> نمرەی سەرەتایی <span className="underline font-bold font-mono">{sub.score}</span> دگەل {d_needed} نمرێن بڕیار و {u_needed} نمرێن عوبور (پەڕینەوە) گەیشتە <span className="bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded font-mono font-bold">٥٠</span> و ڕاستەوخۆ دەردەچێت و دەکەوێتە جێبەجێکردن.
                                          </span>
                                        ) : (
                                          <span>
                                            🎉 <strong className="font-extrabold text-emerald-900">دەرچوو بە بڕیار!</strong> نمرەی سەرەتایی <span className="underline font-bold font-mono">{sub.score}</span> دگەل {d_needed} نمرێن بڕیاری وەزارەت گەیشتە <span className="bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded font-mono font-bold">٥٠</span> و ڕاستەوخۆ دەردەچێت.
                                          </span>
                                        )
                                      ) : (
                                        initialFailedCount === 1 ? (
                                          <div className="space-y-2">
                                            <span>
                                              ⚠️ <strong className="font-extrabold text-amber-900">دەورێ ئێکێ:</strong> دگەل نمرێن بڕیار و عوبور دبیتە <span className="bg-rose-100 text-rose-900 px-1.5 py-0.5 rounded font-mono font-bold">{sub.score + 15}</span>، تە پێتڤی ب <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-mono font-bold">{50 - (sub.score + 15)}</span> نمرێن دی هەبوون ل خولا ئێکێ دا ناجح بی.
                                            </span>
                                            <div className="mt-1.5 p-2 bg-amber-50 rounded border border-amber-200 text-[11px] text-amber-950 font-semibold block leading-relaxed">
                                              📌 <strong>تێبینی خولی یەکەم (ڕێگری لە دەوری دووەم):</strong> {failedNoticeText}
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="space-y-2">
                                            <span>
                                              ⚠️ <strong className="font-extrabold text-amber-900 font-mono">دەرنەچووی:</strong> نمرەی سەرەتایی کەمترە لە ٥٠ و پێتڤیە نمرێن عوبورێ تنێ بۆ ئێک بابەت حسێب بکەی و بابەتێ دی دەرنەچوویە.
                                            </span>
                                            <div className="mt-1.5 p-2 bg-amber-50 rounded border border-amber-200 text-[11px] text-amber-950 font-semibold block leading-relaxed">
                                              📌 <strong>تێبینی خولی یەکەم (ڕێگری لە دەوری دووەم):</strong> {failedNoticeText}
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </p>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${isTrulyPassed ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'}`}>
                                      {isTrulyPassed ? 'ڕزگاربوو بە بەخشین ✨' : 'ئامادەکاری بۆ دەورێ دووێ 🔄'}
                                    </span>
                                  </div>

                                  {!isTrulyPassed && (
                                    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3.5 space-y-4">
                                      <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                        <span>داخستنی هەردوو نمرەی هەڵسەنگاندنێ (Assessment) - هەر یەک ١٠ نمرە:</span>
                                      </div>
                                      
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Evaluation 1 */}
                                        <div className="p-2.5 bg-white rounded-lg border border-slate-100 space-y-1.5">
                                          <div className="flex justify-between items-center text-[11px]">
                                            <span className="font-semibold text-slate-600">هەڵسەنگاندنا ١یەم (١٠ نمرە)</span>
                                            <span className="font-bold text-sky-700 font-mono">{getAssessment(sub.id).a1} / ١٠</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <input 
                                              type="range"
                                              min="0"
                                              max="10"
                                              value={getAssessment(sub.id).a1}
                                              onChange={(e) => updateAssessment(sub.id, 'a1', e.target.value)}
                                              className="h-1 grow bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                            />
                                            <input
                                              type="number"
                                              min="0"
                                              max="10"
                                              value={getAssessment(sub.id).a1}
                                              onChange={(e) => updateAssessment(sub.id, 'a1', e.target.value)}
                                              className="w-11 text-center font-bold text-xs p-1 rounded border border-slate-200 bg-slate-50"
                                            />
                                          </div>
                                        </div>

                                        {/* Evaluation 2 */}
                                        <div className="p-2.5 bg-white rounded-lg border border-slate-100 space-y-1.5">
                                          <div className="flex justify-between items-center text-[11px]">
                                            <span className="font-semibold text-slate-600">هەڵسەنگاندنا ٢یەم (١٠ نمرە)</span>
                                            <span className="font-bold text-sky-700 font-mono">{getAssessment(sub.id).a2} / ١٠</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <input 
                                              type="range"
                                              min="0"
                                              max="10"
                                              value={getAssessment(sub.id).a2}
                                              onChange={(e) => updateAssessment(sub.id, 'a2', e.target.value)}
                                              className="h-1 grow bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                            />
                                            <input
                                              type="number"
                                              min="0"
                                              max="10"
                                              value={getAssessment(sub.id).a2}
                                              onChange={(e) => updateAssessment(sub.id, 'a2', e.target.value)}
                                              className="w-11 text-center font-bold text-xs p-1 rounded border border-slate-200 bg-slate-50"
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      {/* Final equation for Round 2 */}
                                      <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-3 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                                        <div className="space-y-1">
                                          <p className="text-xs font-bold text-indigo-950">
                                            کۆی گشتی ٢٠ نمرەی هەڵسەنگاندن گەیشتە: <span className="text-indigo-700 font-mono text-sm font-bold">{(getAssessment(sub.id).a1 + getAssessment(sub.id).a2)}</span> نمرە
                                          </p>
                                          <p className="text-[10px] text-slate-500 leading-relaxed">
                                            {isUboorEligible ? (
                                              <span className="text-emerald-700 font-bold block space-y-1">
                                                <span>✨ لەبەر ئەوەی یاسای عوبور هەیە، لێرە تەنها پێویستە نمرەی گشتیت بگاتە ٤٠ بۆ ئەوەی بە دەرچوو ئەژمار بکرێت!</span>
                                                {unsavedFailedCount > 1 && (
                                                  <span className="text-rose-800 bg-rose-50 border border-rose-100/70 p-1 px-1.5 rounded mt-1 block font-extrabold text-[9.5px]">
                                                    ⚠️ سەرنج: بەهۆی ئەوەی کە {unsavedFailedCount} بابەت کەوتوون بۆ خولی دووەم، تەنها ئەم بابەتەیان بە یاسای عوبور (نمرەی ٤٠) دەردەچێت. بابەتی تر پێویستە بگاتە ٥٠!
                                                  </span>
                                                )}
                                              </span>
                                            ) : (
                                              <span className="block space-y-1">
                                                <span>تاقیکردنەوەی دەورێ دووەم لەسەر ٨٠ نمرەیە (کۆی گشتی: ٢٠ هەڵسەنگاندن + ٨٠ ئەزموون = ١٠٠)</span>
                                                {unsavedFailedCount > 1 && (
                                                  <span className="text-amber-900 bg-amber-50 border border-amber-200/70 p-1 px-1.5 rounded mt-1 block font-extrabold text-[9.5px]">
                                                    ⚠️ سەرنج: لەبەر ئەوەی تەنها یەک بابەت دەتوانێت بە یاسای عوبور تێپەڕێت، پێویستە نمرەی گشتی ئەم بابەتەکەت بگاتە ٥٠ بۆ دەرچوون نەک ٤٠، ئەگەرنا بە دەرنەچوو هەژمار دەکرێیت.
                                                  </span>
                                                )}
                                              </span>
                                            )}
                                          </p>
                                        </div>
                                        <div className="bg-white rounded-xl p-3 border border-indigo-100 text-center shrink-0 min-w-[140px] flex flex-col justify-center">
                                          <span className="block text-[10px] text-slate-500 font-extrabold mb-0.5">
                                            {isUboorEligible ? "پێویست لەسەر ٨٠ (عوبور)" : "پێویست لە دەورێ دوو لەسەر ٨٠"}
                                          </span>
                                          <span className="text-xl font-black text-indigo-600 font-mono">
                                            {Math.max(0, (isUboorEligible ? 40 : 50) - (getAssessment(sub.id).a1 + getAssessment(sub.id).a2))}
                                          </span>
                                          <span className="text-[9px] block text-slate-400 font-extrabold mt-0.5 leading-tight">
                                            {isUboorEligible ? "نمرەی پێویست لەسەر ٨٠ بۆ دەرچوونی عوبور (ببیتە ٤٠)" : "نمرەی پێویست لەسەر ٨٠ بۆ دەرچوونی تەواو (ببیتە ٥٠)"}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  )}
                </section>
              </div>

              {/* Right Column (4-col width): Result analysis and rules configuration */}
              <div className="lg:col-span-4 space-y-8">
                
                {/* 1. Ministry Help Rules Information Card */}
                <section id="system-rule-info-card" className="bg-radial from-slate-50 to-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1 px-1.5 bg-sky-100 text-sky-950 rounded-lg text-xs font-black">یاسایی</div>
                    <h2 className="text-sm font-extrabold text-slate-800">یاسای فەرمی بڕیار و پەڕینەوە (عوبور)</h2>
                  </div>
                  <div className="space-y-3 text-xs leading-relaxed text-slate-600">
                    <p className="font-medium text-slate-700">
                      قوتابی لە سەرجەم بابەتەکاندا بە شێوەی کۆکراوە <strong className="text-indigo-950 font-extrabold font-mono text-[13px] bg-slate-100 px-1 py-0.5 rounded">تەنها مافی ٥ نمرەی بڕیاری هەیە</strong>.
                    </p>
                    <div className="bg-indigo-50/60 rounded-xl p-3 border border-indigo-100/50 space-y-1.5 text-[11px] text-indigo-950">
                      <p className="font-bold">📌 بۆ نموونە:</p>
                      <ul className="list-disc list-inside space-y-1 px-1 font-semibold text-indigo-900 leading-relaxed">
                        <li>ئەگەر بابەتێک ٣ نمرەی بڕیار بەرێت، بابەتەکەی تری تەنیا مافی ٢ نمرەی بڕیاری دەبێت.</li>
                        <li>یاسای عوبور تەنها بۆ یەک بابەتە کە نمرەی سەرەتایی کەمتر نەبێت لە ٣٥ (پێویستی بە بڕیار و عوبوری گشتی هەیە).</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* 2. Main Decision Outcome Display Card */}
                <section id="decision-result-card" className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden">
                  
                  {/* Decorative background flash */}
                  <div className={`absolute top-0 right-0 left-0 h-2 
                    ${calculation.status === 'passed' ? 'bg-emerald-500' : 
                      calculation.status === 'uboor' ? 'bg-sky-500' : 'bg-rose-500'}`}
                  />

                  <div className="text-center pt-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">ئەنجامی سەرەکیش (Final Verdict)</span>
                    
                    {/* Verdict Icon & Heading */}
                    <div className="my-5 flex justify-center">
                      {calculation.status === 'passed' ? (
                        <div className="w-18 h-18 rounded-full bg-emerald-100 border-4 border-emerald-50 flex items-center justify-center text-emerald-600 animate-bounce">
                          <Award size={40} className="stroke-[2.5]" />
                        </div>
                      ) : calculation.status === 'uboor' ? (
                        <div className="w-18 h-18 rounded-full bg-sky-100 border-4 border-sky-50 flex items-center justify-center text-sky-600">
                          <Columns size={40} className="stroke-[2.5]" />
                        </div>
                      ) : (
                        <div className="w-18 h-18 rounded-full bg-red-100 border-4 border-red-50 flex items-center justify-center text-red-600">
                          <AlertTriangle size={40} className="stroke-[2.5]" />
                        </div>
                      )}
                    </div>

                    <h3 className={`text-2xl font-extrabold tracking-tight 
                      ${calculation.status === 'passed' ? 'text-emerald-800' : 'text-rose-800'}`}
                    >
                      {calculation.status === 'passed' ? 'قوتابی دەرچوو (ناجح) 🎓' : 'داخەکەم! قوتابی دەرنەچوو ⚠️'}
                    </h3>

                    <p className="text-slate-500 text-xs mt-2 max-w-xs mx-auto leading-relaxed">
                      {studentName ? `قوتابی خۆشەویست [${studentName}] ` : 'ئەم قوتابیە '} 
                      {calculation.status === 'passed' ? 'سەرجەم بابەتەکانی بە سەرکەوتوویی تێپەڕاند بە هاوکاری یاسایی.' : 
                       'بەهۆی دەرنەچوون و مانەوەی نمرەی کەمتر لە ٥٠ لە بابەتەکاندا، دەکەوێت و دەمێنێتەوە ل پۆلى خۆیدا.'}
                    </p>
                  </div>

                  {/* Summary Small Analytics Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl scale-95 my-5 border border-slate-100">
                    <div className="text-center border-l border-slate-200 last:border-0 pl-1">
                      <span className="block text-[10px] text-slate-400 font-bold">تێکڕا (Average)</span>
                      <span className="font-extrabold text-slate-800 font-mono text-sm">{averageScore}%</span>
                    </div>
                    <div className="text-center border-l border-slate-200 last:border-0 pl-1">
                      <span className="block text-[10px] text-slate-400 font-bold">کەتنەکان (Fails)</span>
                      <span className={`font-extrabold text-sm font-mono ${calculation.failedSubjectsCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {calculation.failedSubjectsCount} بابەت
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="block text-[10px] text-slate-400 font-bold">یارمەتی بەکارهاتوو</span>
                      <span className="font-extrabold text-slate-800 font-mono text-sm text-sky-700">+{calculation.totalHelpMarksUsed}</span>
                    </div>
                  </div>

                  {/* Copy & Share actions */}
                  <div className="mt-4">
                    <button 
                      id="btn-copy-report"
                      onClick={handleCopyReport}
                      className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 active:bg-slate-900 border border-slate-800 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-xs"
                    >
                      {copied ? (
                        <>
                          <ClipboardCheck size={16} className="text-emerald-400" />
                          <span>ڕاپۆرتی ئەنجام کۆپی کرا!</span>
                        </>
                      ) : (
                        <>
                          <Share2 size={16} />
                          <span>ناردنی ڕاپۆرتی ئەنجام بۆ تێلیگرام / کۆپی کردن</span>
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-center text-slate-400 mt-2 leading-tight">
                      دەتوانیت لە ڕێگەی ناردنەوە بە شێوەیەکی فۆرماتکراو بۆ هاوڕێ و مامۆستاکانت بنێریت.
                    </p>
                  </div>
                </section>

                {/* 3. Help Decisions Steps Timeline (The beautiful step-by-step logic) */}
                <section id="help-steps-timeline-card" className="bg-slate-900 text-slate-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                  {/* Glowing ambient light */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>
                  
                  <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
                    <Sparkles className="text-amber-400 shrink-0" size={18} />
                    <h3 className="text-sm font-extrabold">ڕوونکردنەوەی بەکارخستنی نمرەکانی یارمەتی (Interactive Help Steps)</h3>
                  </div>

                  <div className="space-y-4">
                    {calculation.explanationSteps.map((step, idx) => {
                      let colorClass = 'border-slate-800 text-slate-300';
                      let dotColor = 'bg-slate-700';
                      
                      if (step.type === 'success') {
                        colorClass = 'border-emerald-950 text-emerald-100 bg-emerald-950/20';
                        dotColor = 'bg-emerald-500';
                      } else if (step.type === 'warning') {
                        colorClass = 'border-yellow-950 text-yellow-100 bg-yellow-950/20';
                        dotColor = 'bg-amber-500';
                      }

                      return (
                        <div 
                          key={step.title}
                          id={`step-${idx}`}
                          className={`p-3.5 rounded-xl border text-xs leading-relaxed transition-all ${colorClass}`}
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
                            <span className="font-extrabold text-white">{step.title}</span>
                          </div>
                          <p className="text-slate-350">{step.details}</p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400">
                      شیتەڵکارییەکە پشتبەستووە بە ئەلگۆریتمی فەرمی ئەنجومەنی زانکۆکان.
                    </span>
                  </div>
                </section>

                {/* Subject Grade Details Post-calculation table */}
                <section id="results-comparison-card" className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                  <h3 className="text-xs font-extrabold text-slate-700 mb-3 block">بەراوردکردنی نمرەکان پێش و دوای هاوکاری:</h3>
                  {calculation.subjects.length === 0 ? (
                    <span className="text-slate-400 text-xs block text-center min-h-[50px] py-4">هیچ زانیاریەک بەردەست نییە بۆ نمایش</span>
                  ) : (
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {calculation.subjects.map((sub) => {
                        const statusColor = sub.isPassed ? 'text-green-705 bg-green-50' : 'text-red-705 bg-red-50';
                        return (
                          <div key={sub.id} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg text-xs">
                            <span className="font-semibold text-slate-800">{sub.name}</span>
                            <div className="flex items-center gap-2">
                              {sub.helpMarksAdded > 0 ? (
                                <div className="text-left">
                                  <span className="line-through text-slate-400 text-[10px] ml-1 font-mono">{sub.originalScore}</span>
                                  <span className="font-bold text-sky-700 font-mono ml-1">{sub.finalScore}</span>
                                  <span className="bg-sky-100 text-sky-800 scale-90 px-1 py-0.5 rounded text-[9px] font-bold">+{sub.helpMarksAdded} بڕیار</span>
                                </div>
                              ) : (
                                <span className="font-medium font-mono text-slate-600">{sub.finalScore}</span>
                              )}
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${statusColor}`}>
                                {sub.isPassed ? 'دەرچوو' : 'دەکەوێ'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>

              </div>

            </motion.div>
          ) : (
            <motion.div 
              key="rules-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="max-w-4xl mx-auto space-y-8 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs"
            >
              
              {/* Header inside Help Guide Tab with nice badge */}
              <div className="text-center border-b border-slate-100 pb-6 max-w-xl mx-auto">
                <span className="bg-sky-100 text-sky-800 text-[11px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">ڕێنمایی وەزارەت</span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">ڕێنمایی فەرمی یارمەتی نمرەکان و بڕیاری پەڕینەوە</h2>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  وردەکاری فەرمی لەسەر چۆنییەتی زیادکردنی نمرەی هاوکاری لە قوتابخانەکانی هەرێمی کوردستان بە نموونەی کرداری.
                </p>
              </div>

              {/* Grid of detailed Cards outlining regulations in extreme detail */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                
                {/* Rules 1: The 5-Mark Grace Rule */}
                <div id="rule-desc-1" className="p-5 rounded-xl bg-amber-50/50 border border-amber-100 text-right space-y-3">
                  <div className="flex items-center gap-2 border-b border-amber-200/50 pb-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold font-mono">٥</div>
                    <h3 className="font-bold text-amber-950 text-base">ڕێسای ٥ نمرەی بڕیار (5 Grace Marks)</h3>
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    بەپێی بڕیاری وەزارەتی پەروەردە، هەر بابەتێک نمرەکەی لە سەرەتادا نێوان <strong>(٤٥ یان ٤٦ یان ٤٧ یان ٤٨ یان ٤٩)</strong> بێت، ڕاستەوخۆ دەبێتە ٥٠ بۆ ئەوەی ڕزگاری پێ ببەخشرێت و بە ناجحی دەربچێت.
                  </p>
                  <div className="p-3 bg-white/70 rounded-lg text-xs space-y-1">
                    <span className="block font-bold text-slate-800">چۆن نمرەکان زیاد دەکات؟</span>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 scale-[0.95] origin-top-right">
                      <li>نمرەی ٤٩ 👈 +١ نمرە زیاد دەکات بۆ ٥٠</li>
                      <li>نمرەی ٤٨ 👈 +٢ نمرە زیاد دەکات بۆ ٥٠</li>
                      <li>نمرەی ٤٥ 👈 +٥ نمرە زیاد دەکات بۆ ٥٠</li>
                    </ul>
                  </div>
                </div>

                {/* Rules 2: The 10-Mark Rule */}
                <div id="rule-desc-2" className="p-5 rounded-xl bg-sky-50/50 border border-sky-100 text-right space-y-3">
                  <div className="flex items-center gap-2 border-b border-sky-200/50 pb-2.5">
                    <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold font-mono">١٠</div>
                    <h3 className="font-bold text-sky-950 text-base">ڕێسای بڕیاری ١٠ نمرەی عوبور (پەڕینەوە)</h3>
                  </div>
                  <p className="text-xs text-sky-900 leading-relaxed">
                    یاساکانی هاوکاری بە قوتابخانەکان ڕێگە بۆ قوتابی دەکەنەوە کە سوودمەند بێت لە زیادکردنی تا <strong>١٠ نمرەی عوبور بۆ تەنها یەک بابەت</strong>. ئەگەر بابەتێکی ٣٥ نمرە بێت بە ٥ نمرەی فەرمی دەبێتە ٤٠ و پاشان بە ١٠ نمرەی عوبور دەگۆڕێت بۆ ٥٠ و سەرکەوتووانە ناجح دەبێت.
                  </p>
                  <div className="p-3 bg-white/70 rounded-lg text-xs space-y-1">
                    <span className="block font-bold text-slate-800">چۆن نمرەکان زیاد دەکات لە سیستەم؟</span>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 scale-[0.95] origin-top-right">
                      <li>نمرەی ٣٥ 👈 +٥ نمرەی بڕیار دەبێتە ٤٠ و +١٠ نمرەی عوبور دەبێتە ٥٠</li>
                      <li>نمرەی ٤٠ 👈 +١٠ نمرەی تەواو زیاد دەکات بۆ ٥٠</li>
                      <li>نمرەی ٤٢ 👈 +٨ نمرەی تەواو زیاد دەکات بۆ ٥٠</li>
                    </ul>
                  </div>
                </div>

              </div>

              {/* Comprehensive visual grid showing Pass, Carry-over and Fails */}
              <section id="academic-status-matrix" className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <h3 className="font-bold text-slate-800 text-sm mb-4">دیاریکردنی دۆخی سەرکەوتنی گشتی قوتابی (Student Academic Status Matrix)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div className="p-4 bg-white rounded-lg border-r-4 border-emerald-500 shadow-xs">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">دەرچوو (ناجح)</span>
                    <h4 className="font-bold text-sm text-slate-900 mt-2">کۆتا ئەنجام: دەرچوون</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                      ئەگەر سەرجەم نمرەکان دوای زیادکردنی بڕیاری هاوکار نمرەیان ٥٠ یاخود زیاتر بێت.
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-lg border-r-4 border-rose-500 shadow-xs">
                    <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded">دەرنەچوو (ڕاسیب)</span>
                    <h4 className="font-bold text-sm text-slate-900 mt-2">کۆتا ئەنجام: دووبارەکردنەوە</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                      سیستەمی قوتابخانەکان: ئەگەر قوتابی ل تەنانەت یەک بابەت دەرنەچوو بێت دوای زیادکردنی بڕیاری هاوکاری، دەکەوێت و دەمێنێتەوە ل پۆلى خۆیدا.
                    </p>
                  </div>

                </div>
              </section>

              {/* Simple Return Button */}
              <div className="flex justify-center pt-4">
                <button 
                  id="btn-return-calc"
                  onClick={() => setActiveTab('calculator')}
                  className="bg-sky-950 text-white font-extrabold text-xs px-6 py-3 rounded-xl hover:bg-sky-900 transition-colors shadow-sm"
                >
                  گەڕانەوە بۆ ئەژمارکردنی ئەنجامەکە
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Aesthetic Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 shrink-0 mt-12 text-center text-xs text-slate-500 space-y-2">
        <p className="max-w-md mx-auto leading-relaxed">
          ئەپڵیکەیشنی ڕێنماییکاری نمرەی قوتابخانەکان پشتگیری بڕیاری فەرمی پێنج نمرە و بڕیاری تا ١٠ نمرەی عوبور دەکات بۆ قوتابیانی پەروەردە.
        </p>
        <div className="flex justify-center gap-4 text-slate-400 font-mono">
          <span>کۆدکراو بە تەواوی بۆ چاکەخوازی قوتابیان</span>
          <span>•</span>
          <span>© ٢٠٢٦ هەموو مافەکان پارێزراوە</span>
        </div>
      </footer>

    </div>
  );
}
