import React, { useState, useMemo } from 'react';
import { Lang, SUBJECT_TRANSLATIONS, STAGES, toLangDigits } from './translations';
import { SubjectGrade } from './types';
import { calculateGrades } from './utils/gradeCalculator';

import LanguageSelector from './components/LanguageSelector';
import StudentSubjectEntry from './components/StudentSubjectEntry';
import VerdictResultsView from './components/VerdictResultsView';
import Footer from './components/Footer';

const ALL_SUBJECTS_DEFAULT: SubjectGrade[] = [
  { id: '1', key: 'chemistry', name: 'کیمیا', score: 35 },
  { id: '2', key: 'physics', name: 'فیزیا', score: 72 },
  { id: '3', key: 'math', name: 'بیرکاری', score: 65 },
  { id: '4', key: 'biology', name: 'زیندەوەر', score: 80 },
  { id: '5', key: 'computer', name: 'کۆمپیوتەر', score: 92 },
  { id: '6', key: 'genocide', name: 'جینۆساید', score: 75 },
  { id: '7', key: 'human_rights', name: 'مافەکانی مرۆڤ', score: 88 },
  { id: '8', key: 'sports', name: 'وەرزش', score: 95 },
  { id: '9', key: 'art', name: 'هونەر', score: 92 },
  { id: '10', key: 'english', name: 'ئینگلیزی', score: 58 },
  { id: '11', key: 'arabic', name: 'عەرەبی', score: 63 },
  { id: '12', key: 'kurdish', name: 'کوردی', score: 70 },
  { id: '13', key: 'religion', name: 'ئایین', score: 98 },
  { id: '14', key: 'social', name: 'کۆمەڵایەتی', score: 67 }
];

export default function App() {
  const [activeLang, setActiveLang] = useState<Lang>('kus');
  const [studentName, setStudentName] = useState<string>('');
  const [stageId, setStageId] = useState<string>('10th');
  const [activeStep, setActiveStep] = useState<number>(0);
  
  // Track continuous assessment (S1 and S2)
  const [assessments, setAssessments] = useState<Record<string, { s1a1: number; s1a2: number; s2a1: number; s2a2: number }>>({});
  const [copied, setCopied] = useState(false);

  // Subject List
  const [subjects, setSubjects] = useState<SubjectGrade[]>(ALL_SUBJECTS_DEFAULT);
  const [checkedSubjects, setCheckedSubjects] = useState<Record<string, boolean>>({});

  const activeSubjects = useMemo(() => {
    return subjects.filter(s => checkedSubjects[s.id] !== false);
  }, [subjects, checkedSubjects]);

  // Solver Engine Integration
  const calculation = useMemo(() => {
    return calculateGrades(activeSubjects, 'total_pool');
  }, [activeSubjects]);

  const averageScore = useMemo(() => {
    if (activeSubjects.length === 0) return 0;
    const total = activeSubjects.reduce((sum, s) => sum + s.score, 0);
    return Math.round((total / activeSubjects.length) * 10) / 10;
  }, [activeSubjects]);

  const initialFailedCount = useMemo(() => {
    return activeSubjects.filter(s => s.score < 55 && s.score < 50).length;
  }, [activeSubjects]);

  const finalStatus = useMemo(() => {
    if (calculation.status === 'failed') return 'failed';
    const hasUboor = calculation.subjects.some(s => s.helpMarksAdded > 0 && s.helpRuleUsed === '10_marks_rule');
    return hasUboor ? 'uboor' : 'passed';
  }, [calculation]);

  const updateSubjectScore = (id: string, scoreStr: string) => {
    if (scoreStr === '') {
      setSubjects(prev => prev.map(s => s.id === id ? { ...s, score: 0 } : s));
      return;
    }
    let score = parseFloat(scoreStr);
    if (isNaN(score)) score = 0;
    if (score < 0) score = 0;
    if (score > 100) score = 100;
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, score } : s));
  };

  const getAssessment = (id: string) => {
    return assessments[id] || { s1a1: 0, s1a2: 0, s2a1: 0, s2a2: 0 };
  };

  const updateAssessment = (id: string, field: 's1a1' | 's1a2' | 's2a1' | 's2a2', valueStr: string) => {
    if (valueStr === '') {
      setAssessments(prev => ({
        ...prev,
        [id]: {
          ...(prev[id] || { s1a1: 0, s1a2: 0, s2a1: 0, s2a2: 0 }),
          [field]: 0
        }
      }));
      return;
    }
    let val = parseFloat(valueStr);
    if (isNaN(val)) val = 0;
    if (val < 0) val = 0;
    setAssessments(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || { s1a1: 0, s1a2: 0, s2a1: 0, s2a2: 0 }),
        [field]: val
      }
    }));
  };

  const getSubjectName = (sub: { name: string; key?: string }) => {
    if (sub.key && SUBJECT_TRANSLATIONS[sub.key]) {
      return SUBJECT_TRANSLATIONS[sub.key][activeLang];
    }
    return sub.name;
  };

  const handleStageChange = (newStageId: string) => {
    setStageId(newStageId);
    
    // Filtering logic matching Kurdistan high school curriculum
    const is4to8 = ['4th', '5th', '6th', '7th', '8th'].includes(newStageId);
    const is10to11 = ['10th', '11th'].includes(newStageId);

    const isExcludedForGrade4to9 = (name: string, key?: string) => {
      if (key) return ['chemistry', 'physics', 'biology', 'genocide'].includes(key);
      const normalized = name.toLowerCase();
      return (
        normalized.includes('کیمیا') ||
        normalized.includes('فیزیا') ||
        normalized.includes('زیندەوەر') ||
        normalized.includes('جینۆساید') ||
        normalized.includes('chemistry') ||
        normalized.includes('physics') ||
        normalized.includes('biology') ||
        normalized.includes('genocide')
      );
    };

    const isExcludedForGrade10to12 = (name: string, key?: string) => {
      if (key) return ['science', 'skills'].includes(key);
      const normalized = name.toLowerCase();
      return (
        normalized.includes('زانست') ||
        normalized.includes('کارامەیی') ||
        normalized.includes('science') ||
        normalized.includes('skills')
      );
    };

    let filtered = ALL_SUBJECTS_DEFAULT;
    if (is4to8) {
      filtered = ALL_SUBJECTS_DEFAULT.filter(s => !isExcludedForGrade4to9(s.name, s.key));
    } else if (is10to11) {
      filtered = ALL_SUBJECTS_DEFAULT.filter(s => !isExcludedForGrade10to12(s.name, s.key));
    }
    setSubjects(filtered);
  };

  const handleCopyReport = (customText?: string) => {
    let text = customText;
    if (!text) {
      const formattedAverage = toLangDigits(averageScore, activeLang);
      const emojiStatus = 
        finalStatus === 'passed' ? '🟢 دەرچوو (ناجح) 🎓' :
        finalStatus === 'uboor' ? '🔵 سەرکەوت بۆ قۆناغی تر بە عوبور' : '🔴 دەرنەچوو (پێویستی بە خولی دووەمە) ⚠️';

      text = `━━━━ 👨‍🎓 راپۆرتا ئەنجامێ قوتابی ━━━━\n`;
      text += `👤 ناڤ: ${studentName || 'قوتابی'} \n`;
      text += `🏫 پۆل: ${STAGES[stageId]?.[activeLang] || stageId} \n`;
      text += `📊 تێکڕا: ${formattedAverage}% \n`;
      text += `🏆 ئەنجام: ${emojiStatus} \n`;
      text += `📌 ئەژمارکراوە بەپێی بریاردان و یاساکانی وەزارەتی پەروەردەی هەرێمی کوردستان\n`;
    }
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const isRtl = activeLang !== 'en';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-start items-center py-6 select-none" dir={isRtl ? "rtl" : "ltr"}>
      {activeStep === 0 && (
        <LanguageSelector 
          onSelect={(lang) => {
            setActiveLang(lang);
            setActiveStep(1);
          }}
        />
      )}
      {activeStep === 1 && (
        <StudentSubjectEntry
          activeLang={activeLang}
          studentName={studentName}
          setStudentName={setStudentName}
          stageId={stageId}
          handleStageChange={handleStageChange}
          subjects={subjects}
          checkedSubjects={checkedSubjects}
          setCheckedSubjects={setCheckedSubjects}
          updateSubjectScore={updateSubjectScore}
          getSubjectName={getSubjectName}
          onSubmit={() => setActiveStep(2)}
          onBackToLang={() => setActiveStep(0)}
        />
      )}
      {activeStep === 2 && (
        <VerdictResultsView
          activeLang={activeLang}
          studentName={studentName}
          stageId={stageId}
          activeSubjects={activeSubjects}
          calculation={calculation}
          averageScore={averageScore}
          initialFailedCount={initialFailedCount}
          finalStatus={finalStatus}
          getAssessment={getAssessment}
          updateAssessment={updateAssessment}
          getSubjectName={getSubjectName}
          onModify={() => setActiveStep(1)}
          onShare={handleCopyReport}
          copied={copied}
        />
      )}
      {activeStep > 0 && <Footer activeLang={activeLang} />}
    </div>
  );
}
