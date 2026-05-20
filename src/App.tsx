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
import { SubjectGrade, HelpSystemMode, CalculationResult } from './types';
import { calculateGrades } from './utils/gradeCalculator';
import { Lang, SUBJECT_TRANSLATIONS, STAGES, toLangDigits, LOCALE } from './translations';

const PRESETS = [
  {
    titleKey: 'preset_pass_title',
    descriptionKey: 'preset_pass_desc',
    subjects: [
      { id: '1', key: 'chemistry', name: 'کیمیا', score: 78 },
      { id: '2', key: 'physics', name: 'فیزیا', score: 82 },
      { id: '3', key: 'math', name: 'بیرکاری', score: 65 },
      { id: '4', key: 'biology', name: 'زیندەوەر', score: 70 },
      { id: '5', key: 'english', name: 'ئینگلیزی', score: 74 },
      { id: '6', key: 'kurdish', name: 'کوردی', score: 85 },
    ],
  },
  {
    titleKey: 'preset_uboor_title',
    descriptionKey: 'preset_uboor_desc',
    subjects: [
      { id: '1', key: 'chemistry', name: 'کیمیا', score: 35 },
      { id: '2', key: 'physics', name: 'فیزیا', score: 65 },
      { id: '3', key: 'math', name: 'بیرکاری', score: 55 },
      { id: '4', key: 'biology', name: 'زیندەوەر', score: 70 },
      { id: '5', key: 'english', name: 'ئینگلیزی', score: 60 },
      { id: '6', key: 'kurdish', name: 'کوردی', score: 72 },
    ],
  },
  {
    titleKey: 'preset_single_uboor_title',
    descriptionKey: 'preset_single_uboor_desc',
    subjects: [
      { id: '1', key: 'chemistry', name: 'کیمیا', score: 40 },
      { id: '2', key: 'physics', name: 'فیزیا', score: 68 },
      { id: '3', key: 'math', name: 'بیرکاری', score: 71 },
      { id: '4', key: 'biology', name: 'زیندەوەر', score: 50 },
      { id: '5', key: 'english', name: 'ئینگلیزی', score: 65 },
      { id: '6', key: 'kurdish', name: 'کوردی', score: 75 },
    ],
  },
];

export default function App() {
  const [activeLang, setActiveLang] = useState<Lang>('kus');
  const [studentName, setStudentName] = useState<string>('');
  const [stageId, setStageId] = useState<string>('10th');
  
  const [subjects, setSubjects] = useState<SubjectGrade[]>([
    { id: '1', key: 'chemistry', name: 'کیمیا', score: 35 },
    { id: '2', key: 'physics', name: 'فیزیا', score: 72 },
    { id: '3', key: 'math', name: 'بیرکاری', score: 65 },
    { id: '4', key: 'biology', name: 'زیندەوەر', score: 80 },
    { id: '5', key: 'computer', name: 'کۆمپیوتەر', score: 90 },
    { id: '6', key: 'genocide', name: 'جینۆساید', score: 75 },
    { id: '7', key: 'human_rights', name: 'مافەکانی مرۆڤ', score: 88 },
    { id: '8', key: 'sports', name: 'وەرزش', score: 95 },
    { id: '9', key: 'art', name: 'هونەر', score: 92 },
    { id: '10', key: 'english', name: 'ئینگلیزی', score: 58 },
    { id: '11', key: 'arabic', name: 'عەرەبی', score: 63 },
    { id: '12', key: 'kurdish', name: 'کوردی', score: 70 },
    { id: '13', key: 'religion', name: 'ئایین', score: 98 },
    { id: '14', key: 'social', name: 'کۆمەڵایەتی', score: 67 },
  ]);

  const [helpMode, setHelpMode] = useState<HelpSystemMode>('total_pool');
  const [activeTab, setActiveTab] = useState<'calculator' | 'rules'>('calculator');
  const [copied, setCopied] = useState(false);

  // State for Round 2 assessments (10 marks each, defaulting to max 10/10)
  const [assessments, setAssessments] = useState<Record<string, { a1: number; a2: number }>>({});

  const getAssessment = (id: string) => {
    return assessments[id] || { a1: 10, a2: 10 };
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

  const getSubjectName = (sub: { name: string; key?: string }) => {
    if (sub.key && SUBJECT_TRANSLATIONS[sub.key]) {
      return SUBJECT_TRANSLATIONS[sub.key][activeLang];
    }
    return sub.name;
  };

  const handleStageChange = (newStageId: string) => {
    setStageId(newStageId);

    const is4to8 = ['4th', '5th', '6th', '7th', '8th'].includes(newStageId);
    const is10to11 = ['10th', '11th'].includes(newStageId);

    const isExcludedForGrade4to9 = (subName: string, subKey?: string) => {
      if (subKey) {
        return ['biology', 'chemistry', 'physics', 'genocide'].includes(subKey);
      }
      const normalized = subName.toLowerCase();
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

    const isExcludedForGrade10to12 = (subName: string, subKey?: string) => {
      if (subKey) {
        return ['science', 'skills'].includes(subKey);
      }
      const normalized = subName.toLowerCase();
      return (
        normalized.includes('زانست') ||
        normalized.includes('کارامەیی') ||
        normalized.includes('کارامایی') ||
        normalized.includes('science') ||
        normalized.includes('skills')
      );
    };

    if (is4to8) {
      setSubjects(prev => prev.filter(s => !isExcludedForGrade4to9(s.name, s.key)));
    } else if (is10to11) {
      setSubjects(prev => prev.filter(s => !isExcludedForGrade10to12(s.name, s.key)));
    }
  };

  // Run solver calculations
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

  const finalStatus = useMemo(() => {
    if (calculation.status === 'failed') return 'failed';
    const hasUboor = calculation.subjects.some(s => s.helpMarksAdded > 0 && s.helpRuleUsed === '10_marks_rule');
    return hasUboor ? 'uboor' : 'passed';
  }, [calculation]);

  // Handle subject changes
  const updateSubjectName = (id: string, name: string) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, name, key: undefined } : s));
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
    const subName = activeLang === 'en' ? `New Subject ${newId}` : activeLang === 'ar' ? `مادة جديدة ${newId}` : `بابەتی نوێ ${newId}`;
    setSubjects(prev => [
      ...prev,
      { id: newId, name: subName, score: 50 }
    ]);
  };

  const applyPreset = (presetSubjects: SubjectGrade[]) => {
    const cloned = presetSubjects.map(s => ({ ...s, id: `${Math.random()}` }));
    setSubjects(cloned);
  };

  const clearAllSubjects = () => {
    setSubjects([]);
  };

  const isRtl = activeLang !== 'en';

  // Localized interactive explanation steps timeline
  const explanationStepsLocalized = useMemo(() => {
    const steps: { title: string; details: string; type: 'success' | 'info' | 'warning' }[] = [];
    const total = subjects.length;
    if (total === 0) {
      return [
        {
          title: {
            kus: 'هیچ بابەتێک نییە',
            kub: 'هیچ بابەتەک نینە',
            ar: 'لا توجد أي مادة',
            en: 'No Subjects Added'
          }[activeLang],
          details: {
            kus: 'تکایە سەرەتا چەند بابەتێک و نمرەکانیان داخڵ بکە.',
            kub: 'هیڤیە ل دەسپێکێ چەند بابەتان و نمرەیێن وان بنویسی.',
            ar: 'الرجاء إدخال عدة مواد دراسية ومعدلاتها أولاً.',
            en: 'Please add some school subjects and their grades to begin.'
          }[activeLang],
          type: 'warning' as const
        }
      ];
    }

    // 1. Initial State
    const overviewTitle = {
      kus: 'بارودۆخی سەرەتایی نمرەکان',
      kub: 'بارودۆخێ دەسپێکیێ نمرە یا بابەتان',
      ar: 'ملخص الدرجات الأولية والمستوى',
      en: 'Initial Grades Status Summary'
    }[activeLang];

    const overviewDetails = {
      kus: `تۆ کۆی گشتی ${toLangDigits(total, activeLang)} بابەتت داخڵکردووە. لەمانە ${toLangDigits(total - initialFailedCount, activeLang)} بابەت سەرکەوتوو بوون (٥٠ یان زیاتر) و ${toLangDigits(initialFailedCount, activeLang)} بابەت ژێر نمرەی دەرچوونن (کەمتر لە ٥٠).`,
      kub: `تە کۆ گشتی ${toLangDigits(total, activeLang)} بابەتان داخیلکرینە. ژ ڤان ${toLangDigits(total - initialFailedCount, activeLang)} بابەت دەرباز بووینە (٥٠ یان پتر) و ${toLangDigits(initialFailedCount, activeLang)} بابەت بن نمرەیا سەرکەفتنێ نە (کێمتر ژ ٥٠).`,
      ar: `لقد قمت بإدخال ${toLangDigits(total, activeLang)} مادة دراسية. من بينها، نجحت في ${toLangDigits(total - initialFailedCount, activeLang)} مادة (بدرجة ٥٠ فما فوق) وهناك ${toLangDigits(initialFailedCount, activeLang)} مادة تحت درجة النجاح (أقل من ٥٠).`,
      en: `You have entered a total of ${toLangDigits(total, activeLang)} subjects. Out of which, ${toLangDigits(total - initialFailedCount, activeLang)} are already passing (50 or above) and ${toLangDigits(initialFailedCount, activeLang)} are below the passing threshold (under 50).`
    }[activeLang];

    steps.push({
      title: overviewTitle,
      details: overviewDetails,
      type: initialFailedCount === 0 ? 'success' : 'info'
    });

    if (initialFailedCount === 0) {
      steps.push({
        title: {
          kus: 'بەرئەنجام: قوتابی ناجح بوو (دەرچوو) 🎉',
          kub: 'بەرئەنجام: قوتابی ب تەمامی ناجح بوو 🎉',
          ar: 'النتيجة: الطالب ناجح تماماً 🎉',
          en: 'Result: Decisive Pass achieved! 🎉'
        }[activeLang],
        details: {
          kus: 'پیرۆزە! سەرجەم بابەتەکان دەرچوون بێ ئەوەی پێویستیان بە هیچ نمرەیەکی یاسایی هەبێت.',
          kub: 'پیرۆزە! هەمی بابەتان د نمرەیێن خۆ فەرمی دا دەربازبووینە بێی پێتڤی بوون ب چو نمرەیێن یارمەتیێ.',
          ar: 'تهانينا! لقد اجتزت جميع المواد بعلاماتك الخاصة دون الحاجة لأي درجات قرار أو مساعدة.',
          en: 'Congratulations! All subjects have successfully passed on raw performance without needing any legal grade boost.'
        }[activeLang],
        type: 'success'
      });
      return steps;
    }

    // 2. Add subject-specific intervention explanations
    calculation.subjects.forEach(r => {
      const origSub = subjects.find(s => s.id === r.id);
      const subName = getSubjectName(origSub || r);
      const d = r.helpRuleUsed === '5_marks_rule' ? r.helpMarksAdded : (r.helpRuleUsed === '10_marks_rule' && r.originalScore < 40 ? Math.max(0, 40 - r.originalScore) : 0);
      const u = r.helpRuleUsed === '10_marks_rule' ? r.helpMarksAdded - d : 0;

      if (r.isPassed && r.helpMarksAdded > 0) {
        if (d > 0 && u > 0) {
          steps.push({
            title: {
              kus: `🔥 جێبەجێکردنی هاوبەشی (بڕیار + عوبور) بۆ ${subName}`,
              kub: `🔥 جێبەجێکرنا هەڤپشک (بریار + عوبور) بۆ بابەتێ ${subName}`,
              ar: `🔥 تطبيق متبادل (القرار + العبور) لمادة ${subName}`,
              en: `🔥 Dual Rule Action (Grace + Carry-over) for ${subName}`
            }[activeLang],
            details: {
              kus: `نمرەی بابەتی "${subName}" سەرەتا کەمتر بوو لە ٤٠ (${toLangDigits(r.originalScore, activeLang)} نمرە)، سیستەمەکە پێداچوونەوەی مەرجەکی کرد: سەرەتا ${toLangDigits(d, activeLang)} نمرەی بڕیاری بۆ دابینکر تا بگاتە ٤٠، و پاشان ${toLangDigits(u, activeLang)} نمرەی عوبوری بۆ تەرخانکرا تا بگاتە ٥٠ و سەرکەوتووانە دەربچێت!`,
              kub: `نمرەیا بابەتێ "${subName}" د دەسپێکێ دا ژ ٤٠ کێمتر بوو (${toLangDigits(r.originalScore, activeLang)} نمرە)، سیستەمی بڕیاردا: د سەرەتادا ${toLangDigits(d, activeLang)} نمرێن لێبۆرینێ بۆ تەرخانکرن دا بگەهیتە ٤٠، پاشی ${toLangDigits(u, activeLang)} نمرێن عوبورێ پێ بەخشین دا بگەهیتە ٥٠ و دەرباز ببیت!`,
              ar: `درجة المادة "${subName}" كانت أقل من ٤٠ (${toLangDigits(r.originalScore, activeLang)} درجة)، فراجع النظام حالتها: تم تخصيص ${toLangDigits(d, activeLang)} درجات قرار لتصل لـ ٤٠، ثم ${toLangDigits(u, activeLang)} درجات عبور لتصل لـ ٥٠ واجتيازها بنجاح!`,
              en: `The score in "${subName}" was originally under 40 (${toLangDigits(r.originalScore, activeLang)} marks). The system initialized dual help: first applied ${toLangDigits(d, activeLang)} decision marks to touch 40, and then allocated ${toLangDigits(u, activeLang)} carry-over marks to hit 50 and secure a complete pass!`
            }[activeLang],
            type: 'success'
          });
        } else if (u > 0) {
          steps.push({
            title: {
              kus: `جێبەجێکردنی یاسای عوبور بۆ ${subName}`,
              kub: `جێبەجێکرنا یاسایا عوبورێ بۆ لێبۆرینا بابەتێ ${subName}`,
              ar: `تطبيق قانون العبور لمادة ${subName}`,
              en: `Carry-over Rule Execution for ${subName}`
            }[activeLang],
            details: {
              kus: `بەهۆی دابینکردنی ${toLangDigits(u, activeLang)} نمرەی یارمەتی خۆڕا لە ژێر ناوی عوبور (پەڕینەوە)، نمرەی "${subName}" لە ${toLangDigits(r.originalScore, activeLang)} بەرزکرایەوە بۆ ٥٠ و بە سەرکەوتوویی تێپەڕی.`,
              kub: `ژ بەر تەرخانکرنا ${toLangDigits(u, activeLang)} نمرێن دەربازکرنێ دبن ناڤێ عوبورێ دا، نمرەیا "${subName}" ژ ${toLangDigits(r.originalScore, activeLang)} هاتە بەرزکرن بۆ ٥٠ نمران و سەرکەفتیانە دەربازبوو.`,
              ar: `بسبب تخصيص ${toLangDigits(u, activeLang)} درجات مساعدة تحت قاعدة عبور المواد، ارتفعت علامة "${subName}" من ${toLangDigits(r.originalScore, activeLang)} لتصبح ٥٠ وتعتبر معبرة بنجاح.`,
              en: `By providing ${toLangDigits(u, activeLang)} carry-over help marks, your score in "${subName}" was boosted from ${toLangDigits(r.originalScore, activeLang)} up to 50 for a carrying pass.`
            }[activeLang],
            type: 'success'
          });
        } else if (d > 0) {
          steps.push({
            title: {
              kus: `جێبەجێکردنی بڕیاری ${toLangDigits(d, activeLang)} پێنج نمرە بۆ ${subName}`,
              kub: `جێبەجێکرنا بڕیارا وەزارەتێ یا هاریكار كرم ب ${toLangDigits(d, activeLang)} پێنج نمران بۆ ${subName}`,
              ar: `منح قرارات المساعدة بـ ${toLangDigits(d, activeLang)} نمر قرارات لمادة ${subName}`,
              en: `Awarding ${toLangDigits(d, activeLang)} Decision Grace Marks for ${subName}`
            }[activeLang],
            details: {
              kus: `بەپێی بڕیاری فەرمی ڕێکخستنی نمرەکان، ${toLangDigits(d, activeLang)} نمرەی بڕیار بەخشرا بە بابەتی "${subName}" لە نمرەی ${toLangDigits(r.originalScore, activeLang)} بۆ دەرچوون گەیشتە ٥٠.`,
              kub: `ل سەر بڕیارێن وەزارەتی یێن چاکسازیێ، ${toLangDigits(d, activeLang)} نمرێن بڕیارێ هاتنە بەخشین بۆ بابەتێ "${subName}" ژ نمرەیا دەسپێکێ ${toLangDigits(r.originalScore, activeLang)} دا بگەهیتە ٥٠ و ناجح ببیت.`,
              ar: `استناداً إلى اللائحة الرسمية لإنقاذ الدرجات، تم منح المادة "${subName}" عدد ${toLangDigits(d, activeLang)} درجات قرار إضافية لتصل من ${toLangDigits(r.originalScore, activeLang)} إلى ٥٠ درجة للنجاح.`,
              en: `Based on the official grading code, ${toLangDigits(d, activeLang)} grace decision marks were awarded to "${subName}" to elevate it from ${toLangDigits(r.originalScore, activeLang)} to exactly 50.`
            }[activeLang],
            type: 'success'
          });
        }
      } else if (!r.isPassed && (r.originalScore < 50)) {
        steps.push({
          title: {
            kus: `⚠️ یارمەتی یاسایی ناتوانێت ${subName} دەرچوێنێت`,
            kub: `⚠️ هاریکاریا یاسایی نەشێت بابەتێ ${subName} دەرباز کەت`,
            ar: `⚠️ حدود المساعدة تصعب اجتياز مادة ${subName}`,
            en: `⚠️ Legal Grace Cannot Save ${subName}`
          }[activeLang],
          details: {
            kus: `بابەتی "${subName}" بەهۆی نزمی نمرەکەیەوە (${toLangDigits(r.originalScore, activeLang)})، دگەل نمرێن بڕیار و عوبور دبیتە ${toLangDigits(r.finalScore, activeLang)}، بۆیە تە پێتڤی ب ${toLangDigits(50 - r.finalScore, activeLang)} نمرێن دی هەبوون ل خولا ئێکێ دا ناجح بی.`,
            kub: `بابەتێ "${subName}" ژ بەر نزمیا نمرەیێ (${toLangDigits(r.originalScore, activeLang)})، دگەل هەمی نمرێن بریارێ و عوبورێ گەهشتە تەنیا ${toLangDigits(r.finalScore, activeLang)}، و تە هێش پێتڤی ب ${toLangDigits(50 - r.finalScore, activeLang)} نمرێن دی هەبوون ل خولا ئێکێ هەتا ناجح بی.`,
            ar: `مادة "${subName}" وبسبب علامتها المتدنية (${toLangDigits(r.originalScore, activeLang)} درجة)، تصل مع كامل المساعدة المتاحة إلى ${toLangDigits(r.finalScore, activeLang)} فقط، لذا كنت بحاجة لنحو ${toLangDigits(50 - r.finalScore, activeLang)} درجات إضافية للنجاح من الدور الأول.`,
            en: `Subject "${subName}" has a raw score of ${toLangDigits(r.originalScore, activeLang)}. Under maximum allowed grace, its score maxes out at ${toLangDigits(r.finalScore, activeLang)}, keeping it ${toLangDigits(50 - r.finalScore, activeLang)} marks short of a passing grade of 50 in Round 1.`
          }[activeLang],
          type: 'warning'
        });
      }
    });

    // 3. Final Result verdict step
    const finalFailing = calculation.subjects.filter(s => !s.isPassed);
    const isUboorFinal = calculation.subjects.some(s => s.helpMarksAdded > 0 && s.helpRuleUsed === '10_marks_rule') && finalFailing.length === 0;

    if (finalFailing.length === 0) {
      if (isUboorFinal) {
        steps.push({
          title: {
            kus: 'بەرئەنجام: سەرکەوت بۆ قۆناغی تر بە عوبور (مەرجدار) 🔵',
            kub: 'بەرئەنجام: دەربازبو بۆ قۆناغا دی ب مەرجێ عوبورێ 🔵',
            ar: 'النتيجة النهائية: معبر ومؤهل للمرحلة التالية 🔵',
            en: 'Final Verdict: Promoted carrying over one subject 🔵'
          }[activeLang],
          details: {
            kus: 'پیرۆزە! قوتابی توانی بە یارمەتی نمرەکانی بڕیار و عوبور بۆ یەک بابەت تێپەڕ ببێت و مەرجدار سەرکەوێت.',
            kub: 'پیرۆزە! قوتابی شیا ب لێبورینا نمرێن عوبورێ بۆ بابەتەکی، سەرکەفتیانە بگەهیتە قۆناغا دی یا خاندنێ.',
            ar: 'تهانينا! حقق الطالب متطلبات الانتقال إلى المرحلة التالية مع عبور مادة واحدة مستوفية لشروط الوزارة.',
            en: 'Congratulations! This student advances to the next academic level carrying over one failed subject under carry-over regulations.'
          }[activeLang],
          type: 'success'
        });
      } else {
        steps.push({
          title: {
            kus: 'بەرئەنجام: قوتابی ناجح بوو (دەرچوو) 🎉',
            kub: 'بەرئەنجام: قوتابی ب تەمامی ناجح بوو 🎉',
            ar: 'النتيجة النهائية: الطالب ناجح تماماً 🎉',
            en: 'Final Verdict: Full Pass! 🎉'
          }[activeLang],
          details: {
            kus: 'پیرۆزە! قوتابی توانی بە یارمەتی نمرە فەرمییەکان، سەرجەم بابەتەکانی تێپەڕێنێت و بە سەرکەوتوویی بوو بە ناجح.',
            kub: 'پیرۆزە! قوتابی شیا ل سەر نمرەیێن فەرمی، سەرجەم بابەتێن خاندنێ دەرباز بکەت و ب عێزەتڤانە ناجح ببیت.',
            ar: 'ألف مبروك! استطاع الطالب تجاوز كل المواد بنجاح بفضل قرارات المساعدة والاستفادة من النظم الوزارية.',
            en: 'Outstanding achievement! Under official help channels, the student successfully passed all required subjects and achieved promotion.'
          }[activeLang],
          type: 'success'
        });
      }
    } else {
      steps.push({
        title: {
          kus: 'بەرئەنجام: قوتابی دەرنەچوو (دەمێنێتەوە لە پۆلی خۆیدا) ⚠️',
          kub: 'بەرئەنجام: قوتابی دەرنەکەفت (د دۆسیەیا خۆ دا دۆباره دکەت) ⚠️',
          ar: 'النتيجة النهائية: الطالب راسب ويعيد الصف ⚠️',
          en: 'Final Verdict: Student fails and repeats the grade ⚠️'
        }[activeLang],
        details: {
          kus: `سیستەمی قوتابخانەکان: ئەگەر قوتابی ل تەنانەت یەک بابەت دەرنەچوو بێت دوای زیادکردنی بڕیاری هاوکاری، دەکەوێت و دەمێنێتەوە ل پۆلى خۆیدا (ڕاسیب). بابەتە کەتنەکان: ${finalFailing.map(f => `${getSubjectName(f)} (نمرەی کۆتایی: ${toLangDigits(f.finalScore, activeLang)})`).join('، ')}.`,
          kub: `قانونێ قوتابخانان د بێژیت کەتن د بابەتەکی دا پشتی هەمی بریاران دێ بیتە مایەوە و دوورکەفتن ژ رێنجا تێپەڕبوونێ. بابەتێن کەفتی: ${finalFailing.map(f => `${getSubjectName(f)} (نمرەیا دوماهیێ: ${toLangDigits(f.finalScore, activeLang)})`).join('، ')}.`,
          ar: `لوائح التعليم والمدارس: إن بقي الطالب راسباً في مادة واحدة على الأقل بالرغم من القرار، يستمر بالرسوب ويعيد صفه. المواد المتبقية: ${finalFailing.map(f => `${getSubjectName(f)} (النهاية: ${toLangDigits(f.finalScore, activeLang)})`).join('، ')}.`,
          en: `Academic evaluation guide states if a student remains below grade in even one subject after all grace help, they fail to progress and repeat. Failing subjects: ${finalFailing.map(f => `${getSubjectName(f)} (Final mark: ${toLangDigits(f.finalScore, activeLang)})`).join(', ')}.`
        }[activeLang],
        type: 'warning'
      });
    }

    return steps;
  }, [subjects, calculation, activeLang, initialFailedCount]);

  // Generate localized share report copy
  const handleCopyReport = () => {
    const dStyle = (val: number | string) => toLangDigits(val, activeLang);

    const emojiStatus = 
      finalStatus === 'passed' ? 
        { kus: '🟢 دەرچوو (ناجح) 🎓', kub: '🟢 دەربازبوو ب سەرکەفتیانە 🎓', ar: '🟢 ناجح بامتياز واجتياز 🎓', en: '🟢 Decisive Pass 🎓' }[activeLang] : 
      finalStatus === 'uboor' ? 
        { kus: '🔵 سەرکەوت بۆ قۆناغی تر بە عوبور (مەرجدار)', kub: '🔵 دەربازبوو ب مەرجێ عوبورێ (پەڕینەوە)', ar: '🔵 ناجح مع عبور مادة واحدة (مقرر)', en: '🔵 Advanced with Carry-Over' }[activeLang] : 
        { kus: '🔴 دەرنەچوو (ڕاسیب) ⚠️', kub: '🔴 دەرنەکەفت (دووبارەکرنا سالێ) ⚠️', ar: '🔴 راسب ومستمر بالإعادة ⚠️', en: '🔴 Failed (Grade Retained) ⚠️' }[activeLang];

    let text = `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += {
      kus: ` 👨‍🎓 ڕاپۆرتی ئەنجامی قوتابی: ${studentName || 'نەناسراو'}\n`,
      kub: ` 👨‍🎓 راپۆرتا ئەنجامێ قوتابی: ${studentName || 'نەنیاس'}\n`,
      ar: ` 👨‍🎓 تقرير وتدقيق درجات الطالب: ${studentName || 'غير مسجل'}\n`,
      en: ` 👨‍🎓 Student Report Card: ${studentName || 'Anonymous'}\n`
    }[activeLang];

    text += {
      kus: ` 🏫 قۆناغ: ${STAGES[stageId]?.[activeLang] || stageId}\n`,
      kub: ` 🏫 قۆناغ: ${STAGES[stageId]?.[activeLang] || stageId}\n`,
      ar: ` 🏫 المرحلة الدراسية: ${STAGES[stageId]?.[activeLang] || stageId}\n`,
      en: ` 🏫 Academic Grade: ${STAGES[stageId]?.[activeLang] || stageId}\n`
    }[activeLang];

    text += {
      kus: ` 📊 تێکڕای گشتی نمرەکان: ${dStyle(averageScore)}٪\n`,
      kub: ` 📊 تێکڕایێ گشتیێ نمران: ${dStyle(averageScore)}٪\n`,
      ar: ` 📊 المعدل العام للدرجات: ${dStyle(averageScore)}%\n`,
      en: ` 📊 Academic General Average: ${dStyle(averageScore)}%\n`
    }[activeLang];

    text += {
      kus: ` 📝 بارودۆخی کۆتایی: ${emojiStatus}\n`,
      kub: ` 📝 دەستکەفتا کۆتایی: ${emojiStatus}\n`,
      ar: ` 📝 الحالة الأكاديمية النهائية: ${emojiStatus}\n`,
      en: ` 📝 Final Academic Verdict: ${emojiStatus}\n`
    }[activeLang];

    text += {
      kus: ` ⚙️ مۆد: ${helpMode === 'per_subject' ? 'یارمەتی ٥ نمرەی جیاواز بۆ هەر بابەتێک' : 'کۆی گشتی ٥ نمرە بۆ کۆی بابەتەکان'} + ١٠ نمرەی بابەتێکی تاک\n`,
      kub: ` ⚙️ مود: ${helpMode === 'per_subject' ? 'سەربەخۆ ٥ نمرێن بابەتان' : 'کۆمکرنا ٥ نمران لسەر هەمی بابەتان'} + ١٠ نمرێن بابەتەکێ گشتی\n`,
      ar: ` ⚙️ الخيار المفعل: ${helpMode === 'per_subject' ? 'توزيع ٥ درجات قرار منفصلة' : '٥ درجات مجمعة للكل'} + ١٠ درجات مادة العبور\n`,
      en: ` ⚙️ Mode: ${helpMode === 'per_subject' ? 'Separate 5-grade grace marks per subject' : '5-grade total cumulative grace pool'} + 10-mark single carry-over\n`
    }[activeLang];

    text += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    text += {
      kus: `📚 لیستی بابەتەکان:\n`,
      kub: `📚 لیستا بابەتێن خاندنێ:\n`,
      ar: `📚 قائمة درجات المواد التفصيلية:\n`,
      en: `📚 Detailed Subject Grade Sheet:\n`
    }[activeLang];

    calculation.subjects.forEach((sub, idx) => {
      const origSub = subjects.find(s => s.id === sub.id) || sub;
      const subName = getSubjectName(origSub);

      let helperText = '';
      if (sub.helpMarksAdded > 0) {
        helperText = {
          kus: ` (لەگەڵ +${dStyle(sub.helpMarksAdded)} نمرەی بڕیار 👈 نمرەی سەرەکی ${dStyle(sub.originalScore)})`,
          kub: ` (دگەل لێبۆرینا +${dStyle(sub.helpMarksAdded)} بریارێن فەرمی 👈 نمرەیا سەرەکی ${dStyle(sub.originalScore)})`,
          ar: ` (مع إضافة +${dStyle(sub.helpMarksAdded)} قرار مساعدة 👈 العلمية الأصلية ${dStyle(sub.originalScore)})`,
          en: ` (including +${dStyle(sub.helpMarksAdded)} grace decision marks 👈 Raw score was ${dStyle(sub.originalScore)})`
        }[activeLang];
      }

      const statusIcon = sub.isPassed ? '✅' : '❌';
      
      text += {
        kus: ` ${dStyle(idx + 1)}. ${statusIcon} ${subName}: ${dStyle(sub.finalScore)} نمرە ${helperText}\n`,
        kub: ` ${dStyle(idx + 1)}. ${statusIcon} ${subName}: ${dStyle(sub.finalScore)} نمرە ${helperText}\n`,
        ar: ` ${dStyle(idx + 1)}. ${statusIcon} ${subName}: ${dStyle(sub.finalScore)} درجات ${helperText}\n`,
        en: ` ${dStyle(idx + 1)}. ${statusIcon} ${subName}: ${dStyle(sub.finalScore)} score ${helperText}\n`
      }[activeLang];

      if (!sub.isPassed) {
        let r1Help = '';
        const score = sub.originalScore;
        if (score < 35) {
          const to35 = 35 - score;
          const to50 = 50 - score;
          r1Help = {
            kus: `پێویستت بە ${dStyle(to35)} نمرەی تر هەبوو لە خولی یەکەمدا بۆ عوبوری مەرجدار (ببێتە ٣٥)، یان ${dStyle(to50)} نمرە بۆ دەرچوونی تەواو (ببێتە ٥٠)`,
            kub: `پێتڤی ب دروستکرنا ${dStyle(to35)} نمرێن دی هەبوون ل دەورێ ئێکێ بۆ عوبورێ مەرجدار (ببیتە ٣٥)، یان ${dStyle(to50)} دەربازبوونا تەمام (ببیتە ٥٠)`,
            ar: `كنت بحاجة لـ ${dStyle(to35)} درجات إضافية بالدور الأول للعبور المقرر (لتصل ٣٥)، أو ${dStyle(to50)} درجات للنجاح الكامل (لتصل ٥٠)`,
            en: `you needed ${dStyle(to35)} more marks in Round 1 for carrying status (score 35), or ${dStyle(to50)} marks for standard pass (to reach 50)`
          }[activeLang];
        } else if (score < 40) {
          const to40 = 40 - score;
          const to50 = 50 - score;
          r1Help = {
            kus: `پێویستت بە ${dStyle(to40)} نمرەی تر هەبوو لە خولی یەکەمدا بۆ عوبوری سادە (ببێتە ٤٠)، یان ${dStyle(to50)} نمرە بۆ دەرچوونی تەواو (ببێتە ٥٠)`,
            kub: `پێتڤی ب دروستکرنا ${dStyle(to40)} نمرێن دی هەبوون بۆ عوبورێ (ببیتە ٤٠)، یان ${dStyle(to50)} بۆ دەربازبوونا تەمام (ببیتە ٥٠)`,
            ar: `كنت بحاجة لـ ${dStyle(to40)} درجات إضافية بالدور الأول للعبور (لتصل ٤٠)، أو ${dStyle(to50)} درجات للنجاح الكامل (لتصل ٥٠)`,
            en: `you needed ${dStyle(to40)} more marks in Round 1 for carrying (score 40), or ${dStyle(to50)} marks for standard pass (to reach 50)`
          }[activeLang];
        } else if (score < 45) {
          const to45 = 45 - score;
          const to50 = 50 - score;
          r1Help = {
            kus: `پێویستت بە ${dStyle(to45)} نمرەی تر هەبوو لە خولی یەکەم بۆ چانسی ئاسانتری یارمەتی (ببێتە ٤٥)، یان ${dStyle(to50)} نمرە بۆ دەرچوونی تەواو (ببێتە ٥٠)`,
            kub: `پێتڤی ب ب کێم کێم ${dStyle(to45)} نمرێن تر هەبوون بۆ چانسەکێ دەست پێ بوونا ئاسانتر (ببیتە ٤٥)، یان ${dStyle(to50)} بۆ دەربازبوونا تەمام (ببیتە ٥٠)`,
            ar: `كنت بحاجة لـ ${dStyle(to45)} درجات إضافية لضمان فرصة أسهل بقرار المساعدة (لتصل ٤٥)، أو ${dStyle(to50)} درجات للنجاح التام (لتصل ٥٠)`,
            en: `you needed ${dStyle(to45)} more marks in Round 1 to unlock helper grace points (score 45), or ${dStyle(to50)} marks for standard pass (to reach 50)`
          }[activeLang];
        } else {
          const to50 = 50 - score;
          r1Help = {
            kus: `تەنها پێویستت بە ${dStyle(to50)} نمرەی تر هەبوو لە خولی یەکەم بۆ دەرچوونی تەواو (ببێتە ٥٠) و ڕێگری لە دەوری دووەم`,
            kub: `بتنێ پێتڤی ب زێدەکرنا ${dStyle(to50)} نمرێن تر هەبوون ل دەورێ ئێکێ بۆ تێپەڕ بوونا تەمام (ببیتە ٥٠) و قورتالبوون ژ خولا دووێ`,
            ar: `تنقصك فقط ${dStyle(to50)} درجات إضافية بالدور الأول للنجاح الكامل وتفادي التحويل للدور الثاني`,
            en: `you were short of just ${dStyle(to50)} marks in Round 1 to secure a complete pass and fully escape the second round`
          }[activeLang];
        }

        const isUboorEligible = !!sub.isUboorEligibleInRound2;
        const ass = getAssessment(sub.id);
        const totalAssessment = ass.a1 + ass.a2;
        const targetScore = isUboorEligible ? 40 : 50;
        const reqFrom80 = Math.max(0, targetScore - totalAssessment);

        const uboorLabel = isUboorEligible 
          ? { kus: `عوبور (ببێتە ٤٠)`, kub: `مەرجی عوبورێ (ببیتە ٤٠)`, ar: `العبور الصفي (الهدف ٤٠)`, en: `Carry-over (target score 40)` }[activeLang]
          : { kus: `دەرچوونی تەواو (ببێتە ٥٠)`, kub: `تێپەڕبوونا تەمام (ببیتە ٥٠)`, ar: `النجاح الكامل (الهدف ٥٠)`, en: `Standard Pass (target score 50)` }[activeLang];

        text += {
          kus: `   📍 خولی یەکەم: ئەگەر « ${r1Help} »، نەدەچوویتە دەوری دوو.\n`,
          kub: `   📍 دەورێ ئێکێ: گەر « ${r1Help} »، نەدچوو خولا دووێ.\n`,
          ar: `   📍 الدور الأول: إن « ${r1Help} »، لما تطلبت تصفية المادة بالدور الثاني.\n`,
          en: `   📍 Round 1: If « ${r1Help} », you would have skipped the second round.\n`
        }[activeLang];

        text += {
          kus: `   📝 خولی دووەم: دەبێت نمرەت لە تاقیکردنەوەی خولی دووەمدا کەمتر نەبێت لە « ${dStyle(reqFrom80)} لەسەر ٨٠ » (بۆ ئەوەی کۆی گشتی بە خولی دووەم لەگەڵ نمرەی هەڵسەنگاندن بگاتە ${dStyle(targetScore)} وەک ${uboorLabel}).\n`,
          kub: `   📝 دەورێ دووەم: پێتڤیە نمرەیا تە ل دەورێ دووێ ل سەر جەرەباندنێ کێمتر نەبیت ژ « ${dStyle(reqFrom80)} ژ سەر ٨٠ » (دا کۆم گشتی دگەل عەمەلی بگەهیتە ${dStyle(targetScore)} وەک ${uboorLabel}).\n`,
          ar: `   📝 الدور الثاني: يجب ألا تقل درجتك التحريرية عن « ${dStyle(reqFrom80)} من أصل ٨٠ » (لكي يبلغ المجموع الكلي مع درجة التقييم حاجز ${dStyle(targetScore)} بما يصنف كـ ${uboorLabel}).\n`,
          en: `   📝 Round 2 written exam: Must score at least « ${dStyle(reqFrom80)} out of 80 » (to drive the cumulative grade to ${dStyle(targetScore)} for a ${uboorLabel}).\n`
        }[activeLang];

        const usedDecision = calculation.helpMarksUsed5;
        const remainingDecision = Math.max(0, 5 - usedDecision);
        const wasUboorUsedByOther = calculation.subjects.some(s => s.id !== sub.id && s.isPassed && s.helpRuleUsed === '10_marks_rule');
        const isUboorAvailable = !wasUboorUsedByOther;
        const targetThreshold = isUboorAvailable ? 40 : 50;
        const neededHelp = Math.max(0, targetThreshold - sub.originalScore);
        const teacherMarksVal = Math.max(0, neededHelp - remainingDecision);

        if (remainingDecision > 0 && teacherMarksVal > 0) {
          text += {
            kus: `   ✨ ڕێگای ئاسان بۆ دەرچوون لە خولی یەکەم: چونکە هێشتا ${dStyle(remainingDecision)} نمرەی بڕیارت ماوە بۆ ئەم بابەتە، لە خولی یەکەمدا تەنها پێویستە مامۆستا ${dStyle(teacherMarksVal)} نمرەت پێ بدات، لەگەڵ ${dStyle(remainingDecision)} نمرەکەی بڕیار دەبێتە ${dStyle(neededHelp)} نمرە ${isUboorAvailable ? `بۆ گەییشتن بە عوبور (٤٠) ` : ''}و ڕاستەوخۆ دەبیتە ناجح لە خولی یەکەم!\n\n`,
            kub: `   ✨ ڕێكا ئاسان بۆ دەربازبوونێ ل خولا ئێکێ: ژبەرکو هێشتا ${dStyle(remainingDecision)} نمرێن بریارێ بۆ ڤی یێت ماین، ل خولا ئێکێ تنێ پێتڤی ب ${dStyle(teacherMarksVal)} نمرەیە مامۆستا بدەتە تە، دگەل ${dStyle(remainingDecision)} نمرێن بریارێ دێ بنە ${dStyle(neededHelp)} نمرە ${isUboorAvailable ? `بۆ گەهشتنا عوبورێ (٤٠) ` : ''}و دێ بیە ناجح ل خولا ئێکێ!\n\n`,
            ar: `   ✨ طريقة ميسرة للنجاح في الدور الأول: بما أنه متبقي لديك ${dStyle(remainingDecision)} درجات قرار للمادة، فأنت بحاجة فقط إلى ${dStyle(teacherMarksVal)} درجات من الأستاذ في الدور الأول؛ لتجتمع مع الـ ${dStyle(remainingDecision)} القرار وتصبح إجمالاً ${dStyle(neededHelp)} درجات ${isUboorAvailable ? `للوصول لعتبة العبور (٤٠) ` : ''}وتنجح مباشرة بالدور الأول!\n\n`,
            en: `   ✨ Easy Path to Pass in Round 1: Since you still have ${remainingDecision} decision marks left, you only need the teacher to give you ${teacherMarksVal} more marks in Round 1. Combined with your remaining decision marks, this makes ${neededHelp} marks ${isUboorAvailable ? `to reach the Carry-Over threshold of 40 ` : ''}and pass directly in Round 1!\n\n`
          }[activeLang];
        } else {
          text += `\n`;
        }
      }
    });

    if (calculation.totalHelpMarksUsed > 0) {
      text += {
        kus: `\n🎯 نمرەی هاوکاری بەکارهاتوو لە خولی یەکەمدا: ${dStyle(calculation.totalHelpMarksUsed)} نمرە\n`,
        kub: `\n🎯 نمرێن هاریکاریێ یێن بەکارهاتی ل خولا ئێکێ: ${dStyle(calculation.totalHelpMarksUsed)} نمرە\n`,
        ar: `\n🎯 مجموع علامات وقرارات المساعدة المستعملة بالدور الأول: ${dStyle(calculation.totalHelpMarksUsed)} درجة\n`,
        en: `\n🎯 Total help decision marks rendered in Round 1: ${dStyle(calculation.totalHelpMarksUsed)} marks\n`
      }[activeLang];
    }

    text += {
      kus: `\n🌐 ئەژمارکراوە لە ڕێگەی "ڕێبه‌ری ئه‌لیكترۆنی بۆ نمره‌كان و ڕێسای عوبور"`,
      kub: `\n🌐 هاتیە ئەژمارکرن ژ ڕێکا "ڕێبەر پێزانی ئەلیكترۆنی بۆ نمرەکان و یاسایا عوبورێ"`,
      ar: `\n🌐 تم التدقيق والاحتساب بنجاح عبر "النظام الإلكتروني الرسمي للدرجات والعبور والترشيح"`,
      en: `\n🌐 Computed and verified via "The Electronic Kurdish School Grade & Carry-over Portal"`
    }[activeLang];

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased selection:bg-indigo-500 selection:text-white" dir={isRtl ? "rtl" : "ltr"}>
      
      {/* Top Banner with dynamic stats indicators */}
      <div className="bg-sky-950 text-white text-xs py-2.5 px-4 flex justify-between items-center shadow-inner font-mono border-b border-sky-900/40 shrink-0">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{LOCALE.official_indicator[activeLang]}</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-sky-200">
          <span>{LOCALE.year_indicator[activeLang]}</span>
          <span>{LOCALE.last_updated[activeLang]}</span>
        </div>
      </div>

      {/* Language Bar Wrapper */}
      <div className="bg-slate-100 border-b border-slate-200 py-2.5 shrink-0 select-none">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-bold">
            <Settings size={14} className="animate-spin-slow text-slate-500" />
            <span>{LOCALE.language_select_lbl[activeLang]}</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <button
              id="lang-kus"
              onClick={() => setActiveLang('kus')}
              className={`px-3.5 py-1.5 rounded-lg font-bold border transition-all duration-150 active:scale-95 ${activeLang === 'kus' ? 'bg-amber-500 text-white border-amber-600 shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'}`}
            >
              کوردى (سۆرانی) ☀️
            </button>
            <button
              id="lang-kub"
              onClick={() => setActiveLang('kub')}
              className={`px-3.5 py-1.5 rounded-lg font-bold border transition-all duration-150 active:scale-95 ${activeLang === 'kub' ? 'bg-orange-500 text-white border-orange-600 shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'}`}
            >
              کوردى (بادينى) ⛰️
            </button>
            <button
              id="lang-ar"
              onClick={() => setActiveLang('ar')}
              className={`px-3.5 py-1.5 rounded-lg font-bold border transition-all duration-150 active:scale-95 ${activeLang === 'ar' ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'}`}
            >
              العربية 🌴
            </button>
            <button
              id="lang-en"
              onClick={() => setActiveLang('en')}
              className={`px-3.5 py-1.5 rounded-lg font-bold border transition-all duration-150 active:scale-95 ${activeLang === 'en' ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'}`}
            >
              English 🇬🇧
            </button>
          </div>
        </div>
      </div>

      {/* Main Brand Header */}
      <header className="bg-white border-b border-slate-200 relative overflow-hidden shrink-0 pb-1">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-yellow-400 to-emerald-500"></div>
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/10 shrink-0">
              <BookOpen size={30} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-800 text-xs px-2.5 py-0.5 rounded-full font-bold border border-indigo-200/50">
                  {LOCALE.school_system_badge[activeLang]}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight tracking-tight mt-1.5">
                {LOCALE.title[activeLang]}
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-1 leading-relaxed max-w-3xl">
                {LOCALE.system_description[activeLang]}
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex bg-slate-100 p-1 rounded-xl self-stretch md:self-auto select-none border border-slate-200/40">
            <button 
              id="tab-calculator"
              onClick={() => setActiveTab('calculator')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4.5 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 ${activeTab === 'calculator' ? 'bg-white text-sky-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <BookOpen size={14} />
              <span>{LOCALE.tab_calculator[activeLang]}</span>
            </button>
            <button 
              id="tab-rules"
              onClick={() => setActiveTab('rules')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4.5 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 ${activeTab === 'rules' ? 'bg-white text-sky-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <HelpCircle size={14} />
              <span>{LOCALE.tab_rules[activeLang]}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Container */}
      <main className="grow max-w-7xl w-full mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'calculator' ? (
            <motion.div 
              key="calculator-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              
              {/* Left Column Controls */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* 1. Presets */}
                <section id="presets-card" className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs select-none">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="text-amber-500 shrink-0" size={18} />
                    <h2 className="text-sm sm:text-base font-black text-slate-800">{LOCALE.preset_title[activeLang]}</h2>
                  </div>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                    {LOCALE.preset_desc[activeLang]}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {PRESETS.map((p, idx) => {
                      const tagResult = calculateGrades(p.subjects, helpMode);
                      const baseColor = 
                        tagResult.status === 'passed' ? 'border-emerald-250 bg-emerald-50/20 hover:bg-emerald-50 text-emerald-950' :
                        tagResult.subjects.some(s => s.helpMarksAdded > 0 && s.helpRuleUsed === '10_marks_rule') ? 'border-sky-200 bg-sky-50/20 hover:bg-sky-50 text-sky-950' :
                        'border-red-200 bg-red-50/20 hover:bg-red-50 text-red-950';

                      const statusText = 
                        tagResult.status === 'passed' ? 
                          (tagResult.subjects.some(s => s.helpMarksAdded > 0 && s.helpRuleUsed === '10_marks_rule') ? 
                            { kus: 'عوبور', kub: 'عوبور', ar: 'عبور', en: 'Carry-Over' }[activeLang] : 
                            { kus: 'دەرچوو', kub: 'دەربازبوو', ar: 'ناجح', en: 'Passed' }[activeLang]) : 
                          { kus: 'دەرنەچوو', kub: 'کەفتی', ar: 'راسب', en: 'Failed' }[activeLang];

                      return (
                        <button 
                          key={p.titleKey}
                          id={`preset-${idx}`}
                          onClick={() => applyPreset(p.subjects)}
                          className={`text-right p-3.5 rounded-xl border text-xs leading-normal transition-all duration-150 hover:translate-y-[-2px] hover:shadow-xs flex flex-col justify-between h-full active:scale-[0.98] ${baseColor}`}
                        >
                          <div>
                            <span className="font-extrabold block text-slate-900 text-xs sm:text-sm mb-1">
                              {LOCALE[p.titleKey][activeLang]}
                            </span>
                            <span className="text-slate-500 block text-[11px] leading-relaxed">
                              {LOCALE[p.descriptionKey][activeLang]}
                            </span>
                          </div>
                          <div className="flex justify-between items-center w-full mt-3 pt-2 border-t border-slate-200/30">
                            <span className="font-bold text-[10px] uppercase tracking-wider text-slate-600">
                              {statusText}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>

                {/* 2. Student Info Details */}
                <section id="student-info-card" className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                    <GraduationCap size={20} className="text-sky-600" />
                    <h2 className="text-base sm:text-lg font-black text-slate-800">{LOCALE.student_info_title[activeLang]}</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label id="lbl-student-name" className="block text-xs font-bold text-slate-600 mb-1.5">{LOCALE.student_name_lbl[activeLang]}</label>
                      <input 
                        id="input-student-name"
                        type="text" 
                        placeholder={LOCALE.student_name_placeholder[activeLang]}
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl px-4 py-3 text-sm transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label id="lbl-student-level" className="block text-xs font-bold text-slate-600 mb-1.5">{LOCALE.student_level_lbl[activeLang]}</label>
                      <select 
                        id="select-student-level"
                        value={stageId}
                        onChange={(e) => handleStageChange(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl px-4 py-3 text-sm transition-all outline-none"
                      >
                        <option value="4th">{STAGES['4th'][activeLang]}</option>
                        <option value="5th">{STAGES['5th'][activeLang]}</option>
                        <option value="6th">{STAGES['6th'][activeLang]}</option>
                        <option value="7th">{STAGES['7th'][activeLang]}</option>
                        <option value="8th">{STAGES['8th'][activeLang]}</option>
                        <option value="10th">{STAGES['10th'][activeLang]}</option>
                        <option value="11th">{STAGES['11th'][activeLang]}</option>
                      </select>
                    </div>
                  </div>
                </section>

                {/* 3. Main Grade Inputs Dashboard */}
                <section id="subject-grades-card" className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs relative">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Percent size={20} className="text-sky-600" />
                        <h2 className="text-base sm:text-lg font-black text-slate-800">{LOCALE.subject_grades_title[activeLang]}</h2>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {LOCALE.subject_grades_desc[activeLang]}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-stretch sm:self-auto select-none">
                      <button 
                        id="btn-add-subject"
                        onClick={addNewSubject}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-sky-950 hover:bg-sky-900 active:scale-95 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs"
                      >
                        <Plus size={16} />
                        <span>{LOCALE.add_subject_btn[activeLang]}</span>
                      </button>
                      <button 
                        id="btn-clear-all"
                        onClick={clearAllSubjects}
                        className="flex items-center justify-center gap-1 bg-rose-50 hover:bg-rose-100 active:scale-95 text-rose-700 border border-rose-200/40 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                        <span className="hidden sm:inline">{LOCALE.clear_all_btn[activeLang]}</span>
                      </button>
                    </div>
                  </div>

                  {subjects.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200 px-4">
                      <BookOpen size={40} className="text-slate-300 mx-auto mb-3" />
                      <h3 className="font-bold text-slate-700 text-sm sm:text-base">{LOCALE.empty_list_title[activeLang]}</h3>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4 leading-relaxed">
                        {LOCALE.empty_list_desc[activeLang]}
                      </p>
                      <button 
                        id="btn-empty-add-subject"
                        onClick={addNewSubject}
                        className="inline-flex items-center gap-2 bg-sky-950 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-sky-900 transition-all shadow-xs"
                      >
                        <Plus size={16} />
                        <span>{LOCALE.empty_add_first[activeLang]}</span>
                      </button>
                    </div>
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

                          let d_needed = 0;
                          let u_needed = 0;
                          if (isTrulyPassed && helpRuleUsed === '10_marks_rule') {
                            d_needed = Math.max(0, 40 - sub.score);
                            u_needed = 50 - sub.score - d_needed;
                          } else if (isTrulyPassed && helpRuleUsed === '5_marks_rule') {
                            d_needed = helpMarksAdded;
                          }

                          const usedDecision = calculation.helpMarksUsed5;
                          const remainingDecision = Math.max(0, 5 - usedDecision);
                          const wasUboorUsedByOther = calculation.subjects.some(s => s.id !== sub.id && s.isPassed && s.helpRuleUsed === '10_marks_rule');
                          const isUboorAvailable = !wasUboorUsedByOther;
                          const targetThreshold = isUboorAvailable ? 40 : 50;
                          const neededHelp = Math.max(0, targetThreshold - sub.score);
                          const teacherMarksVal = Math.max(0, neededHelp - remainingDecision);

                          let failedNoticeText = "";
                          if (isFailedInitially && !isTrulyPassed) {
                            const diff35 = Math.max(0, 35 - sub.score);
                            const diff40 = Math.max(0, 40 - sub.score);
                            const diff45 = Math.max(0, 45 - sub.score);
                            const diff50 = Math.max(0, 50 - sub.score);

                            if (activeLang === 'en') {
                              if (sub.score < 35) {
                                failedNoticeText = `You need ${diff35} more marks in Round 1 to qualify for Carry-Over (reaches 35), or ${diff50} marks to achieve a standard pass.`;
                              } else if (sub.score < 40) {
                                failedNoticeText = `You need ${diff40} more marks in Round 1 for standard Carry-Over (reaches 40), or ${diff50} marks to achieve a standard pass.`;
                              } else if (sub.score < 45) {
                                failedNoticeText = `You need ${diff45} more marks in Round 1 to unlock easier grace assist (reaches 45), or ${diff50} marks to pass.`;
                              } else {
                                failedNoticeText = `You are short of only ${diff50} marks to achieve a standard raw pass without needing any systemic support.`;
                              }
                            } else if (activeLang === 'ar') {
                              if (sub.score < 35) {
                                failedNoticeText = `تحتاج إلى ${toLangDigits(diff35, activeLang)} درجات لتأهيل العبور (وصولاً لـ ٣٥)، أو ${toLangDigits(diff50, activeLang)} درجات للنجاح الكامل.`;
                              } else if (sub.score < 40) {
                                failedNoticeText = `تحتاج إلى ${toLangDigits(diff40, activeLang)} درجات للعبور (وصولاً لـ ٤٠)، أو ${toLangDigits(diff50, activeLang)} درجات للنجاح.`;
                              } else if (sub.score < 45) {
                                failedNoticeText = `تحتاج إلى ${toLangDigits(diff45, activeLang)} درجات لتفعيل مساعدة أسهل (وصولاً لـ ٤٥)، أو ${toLangDigits(diff50, activeLang)} درجات للنجاح.`;
                              } else {
                                failedNoticeText = `ينقصك فقط ${toLangDigits(diff50, activeLang)} درجات للنجاح الصرف دون أي مساعدة.`;
                              }
                            } else if (activeLang === 'kub') {
                              if (sub.score < 35) {
                                failedNoticeText = `تە پێتڤی ب ${toLangDigits(diff35, activeLang)} نمرێن دی هەبوون ل دەورێ ئێکێ بۆ عوبورێ مەرجدار (ببیتە ٣٥)، یان ${toLangDigits(diff50, activeLang)} نمران بۆ دەربازبوونا تەمام (ببیتە ٥٠).`;
                              } else if (sub.score < 40) {
                                failedNoticeText = `تە پێتڤی ب ${toLangDigits(diff40, activeLang)} نمرێن دی هەبوون بۆ عوبورێ (ببیتە ٤٠)، یان ${toLangDigits(diff50, activeLang)} بۆ دەربازبوونا تەمام (ببیتە ٥٠).`;
                              } else if (sub.score < 45) {
                                failedNoticeText = `تە پێتڤی ب کێم کێم ${toLangDigits(diff45, activeLang)} نمرێن تر هەبوون بۆ چانسەکێ دەست پێ بوونا ئاسانتر (ببیتە ٤٥)، یان ${toLangDigits(diff50, activeLang)} بۆ دەربازبوونا تەمام (ببیتە ٥٠).`;
                              } else {
                                failedNoticeText = `بتنێ پێتڤی ب زێدەکرنا ${toLangDigits(diff50, activeLang)} نمرێن تر هەبوون ل دەورێ ئێکێ بۆ تێپەڕ بوونا تەمام (ببیتە ٥٠) و قورتالبوون ژ خولا دووێ.`;
                              }
                            } else {
                              if (sub.score < 35) {
                                failedNoticeText = `پێویستت بە ${toLangDigits(diff35, activeLang)} نمرەیە بۆ دەرچوونی عوبور (بگەی بە ٣٥)، یان ${toLangDigits(diff50, activeLang)} نمرە بۆ دەرچوونی تەواو.`;
                              } else if (sub.score < 40) {
                                failedNoticeText = `پێویستت بە ${toLangDigits(diff40, activeLang)} نمرەی تر هەیە بۆ عوبوری سادە (بگەی بە ٤٠)، یان ${toLangDigits(diff50, activeLang)} نمرە بۆ دەرچوونی تەواو.`;
                              } else if (sub.score < 45) {
                                failedNoticeText = `پێویستت بە ${toLangDigits(diff45, activeLang)} نمرەیە لە خولی یەکەمدا بۆ چانسی ئاسانتری بڕیار (بگەی بە ٤٥)، یان ${toLangDigits(diff50, activeLang)} نمرە بۆ دەرچوونی تەواو.`;
                              } else {
                                failedNoticeText = `تەنها پێویستت بە ${toLangDigits(diff50, activeLang)} نمرەی تر هەیە لە خولی یەکەمدا بۆ دەرچوونی تەواوی بێ بڕیار.`;
                              }
                            }
                          }

                          return (
                            <motion.div 
                              key={sub.id}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.15 }}
                              className={`p-4 rounded-xl border transition-all duration-150 ${
                                sub.score >= 50 
                                  ? 'bg-white border-slate-200 hover:border-slate-300' 
                                  : isTrulyPassed 
                                    ? 'bg-emerald-50/15 border-emerald-100 hover:border-emerald-200' 
                                    : 'bg-red-50/30 border-red-100 hover:border-red-200'
                              }`}
                            >
                              <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
                                
                                <div className="flex-1 flex gap-3 items-center">
                                  <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0 font-mono">
                                    {toLangDigits(index + 1, activeLang)}
                                  </span>
                                  <input 
                                    id={`input-subject-name-${sub.id}`}
                                    type="text"
                                    value={getSubjectName(sub)}
                                    onChange={(e) => updateSubjectName(sub.id, e.target.value)}
                                    placeholder={LOCALE.placeholder_subject_name[activeLang]}
                                    className="grow bg-transparent border-0 focus:border-b focus:border-sky-500 focus:ring-0 text-xs sm:text-sm font-bold text-slate-800 placeholder-slate-400 p-1"
                                  />
                                </div>

                                <div className="flex-1 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                                  {/* Visual Slider */}
                                  <div className="grow flex items-center gap-2 select-none">
                                    <span className="text-[10px] text-slate-450 font-mono">{toLangDigits(0, activeLang)}</span>
                                    <input 
                                      id={`slider-subject-${sub.id}`}
                                      type="range"
                                      min="0"
                                      max="100"
                                      value={sub.score}
                                      onChange={(e) => updateSubjectScore(sub.id, e.target.value)}
                                      className="h-1.5 grow bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-950" 
                                    />
                                    <span className="text-[10px] text-slate-455 font-mono">{toLangDigits(100, activeLang)}</span>
                                  </div>

                                  {/* Modifier Shortcuts */}
                                  <div className="flex items-center gap-1 justify-center shrink-0 select-none">
                                    <button 
                                      id={`btn-modifier-40-${sub.id}`}
                                      onClick={() => setFixedScore(sub.id, 40)}
                                      className="bg-red-50 hover:bg-red-100 text-rose-800 text-[11px] font-black px-2 py-1 rounded border border-red-100 font-mono transition-colors"
                                    >
                                      {toLangDigits(40, activeLang)}
                                    </button>
                                    <button 
                                      id={`btn-modifier-45-${sub.id}`}
                                      onClick={() => setFixedScore(sub.id, 45)}
                                      className="bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-black px-2 py-1 rounded border border-amber-100 font-mono transition-colors"
                                    >
                                      {toLangDigits(45, activeLang)}
                                    </button>
                                    <button 
                                      id={`btn-modifier-49-${sub.id}`}
                                      onClick={() => setFixedScore(sub.id, 49)}
                                      className="bg-teal-50 hover:bg-teal-100 text-teal-800 text-[11px] font-black px-2 py-1 rounded border border-teal-100 font-mono transition-colors"
                                    >
                                      {toLangDigits(49, activeLang)}
                                    </button>
                                    <button 
                                      id={`btn-modifier-50-${sub.id}`}
                                      onClick={() => setFixedScore(sub.id, 50)}
                                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-black px-2 py-1 rounded border border-emerald-100 font-mono transition-colors"
                                    >
                                      {toLangDigits(50, activeLang)}
                                    </button>
                                  </div>

                                  {/* Numerical Grade Box */}
                                  <div className="flex items-center gap-2 justify-end shrink-0 self-end sm:self-auto">
                                    <div className="relative">
                                      <input 
                                        id={`input-grade-${sub.id}`}
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={sub.score}
                                        onChange={(e) => updateSubjectScore(sub.id, e.target.value)}
                                        className={`w-14 text-center font-bold text-xs p-1.5 rounded-lg border focus:ring-1 outline-none text-slate-800 ${isFailedInitially ? 'border-red-300 bg-red-50 focus:ring-red-550' : 'border-slate-200 bg-slate-50 focus:ring-sky-500'}`}
                                      />
                                      <span className="absolute -top-1.5 -left-1 text-[8px] bg-slate-900 text-slate-200 px-1 rounded-sm scale-[0.85] font-bold">
                                        {LOCALE.badge_score[activeLang]}
                                      </span>
                                    </div>

                                    {/* Evaluation tag */}
                                    <span className={`w-28 text-center px-1 py-1.5 rounded-lg text-[10px] font-bold block overflow-ellipsis overflow-hidden whitespace-nowrap ${
                                      sub.score >= 50 
                                        ? 'bg-green-105 text-green-900 border border-green-200/50' 
                                        : isTrulyPassed 
                                          ? 'bg-emerald-100 text-emerald-950 border border-emerald-200/50' 
                                          : 'bg-red-100 text-red-950 border border-red-200/30'
                                    }`}>
                                      {sub.score >= 50 
                                        ? LOCALE.status_passed[activeLang] 
                                        : isTrulyPassed 
                                          ? LOCALE.status_passed_help[activeLang] 
                                          : LOCALE.status_failed[activeLang]}
                                    </span>

                                    <button 
                                      id={`btn-delete-${sub.id}`}
                                      onClick={() => removeSubject(sub.id)}
                                      className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                                      title={LOCALE.tooltip_delete[activeLang]}
                                    >
                                      <Trash2 size={15} />
                                    </button>
                                  </div>

                                </div>

                              </div>

                              {isFailedInitially && (
                                <div className="mt-4 pt-4 border-t border-slate-200/50 space-y-3 shrink-0">
                                  <div className={`rounded-xl border p-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${isTrulyPassed ? 'bg-emerald-50/60 border-emerald-100 text-emerald-950' : 'bg-amber-50/50 border-amber-100 text-amber-950'}`}>
                                    <div className="text-[11px] font-semibold leading-relaxed flex-1 w-full">
                                      {isTrulyPassed ? (
                                        helpRuleUsed === '10_marks_rule' ? (
                                          <span>
                                            🎉 <strong className="font-extrabold text-emerald-900">{LOCALE.passed_joint_help[activeLang]}</strong> {LOCALE.initial_score_was[activeLang]} <span className="underline font-bold font-mono">{toLangDigits(sub.score, activeLang)}</span> {activeLang === 'en' ? `with ${toLangDigits(d_needed, activeLang)} grace + ${toLangDigits(u_needed, activeLang)} carry-over reaches ` : `لەگەڵ ${toLangDigits(d_needed, activeLang)} نمرەی بڕیار و ${toLangDigits(u_needed, activeLang)} نمرەی عوبور دەگۆڕێت بۆ `}<span className="bg-emerald-150 text-emerald-900 px-1.5 py-0.5 rounded font-mono font-bold">{toLangDigits(50, activeLang)}</span> {LOCALE.with_additional_marks[activeLang]}
                                          </span>
                                        ) : (
                                          <span>
                                            🎉 <strong className="font-extrabold text-emerald-900">{LOCALE.passed_decision_only[activeLang]}</strong> {LOCALE.initial_score_was[activeLang]} <span className="underline font-bold font-mono">{toLangDigits(sub.score, activeLang)}</span> {activeLang === 'en' ? `with ${toLangDigits(d_needed, activeLang)} grace marks reaches ` : `لەگەڵ ${toLangDigits(d_needed, activeLang)} نمرەی یارمەتی بڕیار دەبێتە `}<span className="bg-emerald-150 text-emerald-900 px-1.5 py-0.5 rounded font-mono font-bold">{toLangDigits(50, activeLang)}</span> {LOCALE.with_additional_marks[activeLang]}
                                          </span>
                                        )
                                      ) : (
                                        <div className="space-y-2 w-full">
                                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                                            <span>
                                              ⚠️ <strong className="font-extrabold text-amber-900">{LOCALE.r1_title_single_fail[activeLang]}</strong> {LOCALE.initial_score_was[activeLang]} <span className="bg-rose-100/80 text-rose-900 px-1.5 py-0.5 rounded font-mono font-bold">{toLangDigits(sub.score, activeLang)}</span>
                                            </span>
                                            {unsavedFailedCount > 1 && (
                                              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded-md leading-relaxed">
                                                {LOCALE.failed_multi_warning[activeLang]}
                                              </span>
                                            )}
                                          </div>
                                          <div className="mt-1 text-[11px] font-semibold block leading-relaxed text-amber-900 bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
                                            📌 <strong>{LOCALE.r1_notice_prefix[activeLang]}</strong> {failedNoticeText}
                                          </div>
                                          {remainingDecision > 0 && teacherMarksVal > 0 && (
                                            <div className="mt-2 text-[11px] font-semibold block leading-relaxed bg-indigo-500/10 text-indigo-950 p-2.5 rounded-lg border border-indigo-500/20 shadow-sm">
                                              <div className="flex items-center gap-1.5 text-indigo-900 font-bold mb-1">
                                                <Sparkles size={13} className="text-indigo-600 shrink-0 animate-pulse" />
                                                <span>
                                                  {activeLang === 'kub' ? 'ڕێکا زێدەکرنا نمران بۆ دەربازبوونێ ل خولا ئێکێ:' : 
                                                   activeLang === 'kus' ? 'ڕێگای ئاسان بۆ دەرچوون لە خولی یەکەم:' : 
                                                   activeLang === 'ar' ? 'طريقة ميسرة للنجاح في الدور الأول:' : 
                                                   'Easy Path to Pass in Round 1:'}
                                                </span>
                                              </div>
                                              <div className="text-[10.5px] leading-relaxed">
                                                {activeLang === 'kub' ? (
                                                  <>ژبەرکو هێشتا <span className="underline decoration-indigo-500 font-extrabold font-mono text-indigo-900">{toLangDigits(remainingDecision, activeLang)}</span> نمرێن بریارێ بۆ ڤی یێت ماین، ل خولا ئێکێ تنێ پێتڤی ب <span className="bg-indigo-100 text-indigo-950 px-1.5 py-0.5 rounded font-mono font-extrabold border border-indigo-200">{toLangDigits(teacherMarksVal, activeLang)}</span> نمرەیە مامۆستا بدەتە تە، دگەل <span className="underline decoration-indigo-500 font-extrabold font-mono text-indigo-900">{toLangDigits(remainingDecision, activeLang)}</span> نمرێن بریارێ دێ بنە <span className="bg-indigo-100 text-indigo-950 px-1.5 py-0.5 rounded font-mono font-extrabold border border-indigo-200">{toLangDigits(neededHelp, activeLang)}</span> نمرە {isUboorAvailable ? 'بۆ گەهشتنا عوبورێ (٤٠) ' : ''}و دێ بیە ناجح!</>
                                                ) : activeLang === 'kus' ? (
                                                  <>چونکە هێشتا <span className="underline decoration-indigo-500 font-extrabold font-mono text-indigo-900">{toLangDigits(remainingDecision, activeLang)}</span> نمرەی بڕیارت ماوە بۆ ئەم بابەتە، لە خولی یەکەمدا تەنها پێویستە مامۆستا <span className="bg-indigo-100 text-indigo-950 px-1.5 py-0.5 rounded font-mono font-extrabold border border-indigo-200">{toLangDigits(teacherMarksVal, activeLang)}</span> نمرەت پێ بدات، لەگەڵ <span className="underline decoration-indigo-500 font-extrabold font-mono text-indigo-900">{toLangDigits(remainingDecision, activeLang)}</span> نمرەکەی بڕیار دەبێتە <span className="bg-indigo-100 text-indigo-950 px-1.5 py-0.5 rounded font-mono font-extrabold border border-indigo-200">{toLangDigits(neededHelp, activeLang)}</span> نمرە {isUboorAvailable ? 'بۆ گەییشتن بە عوبور (٤٠) ' : ''}و ڕاستەوخۆ دەبیتە ناجح لە خولی یەکەم!</>
                                                ) : activeLang === 'ar' ? (
                                                  <>بما أنه متبقي لديك <span className="underline decoration-indigo-500 font-extrabold font-mono text-indigo-900">{toLangDigits(remainingDecision, activeLang)}</span> درجات قرار للمادة، فأنت بحاجة فقط إلى <span className="bg-indigo-100 text-indigo-950 px-1.5 py-0.5 rounded font-mono font-extrabold border border-indigo-200">{toLangDigits(teacherMarksVal, activeLang)}</span> درجات من الأستاذ في الدور الأول؛ لتجتمع مع الـ <span className="underline decoration-indigo-500 font-extrabold font-mono text-indigo-900">{toLangDigits(remainingDecision, activeLang)}</span> القرار وتصبح إجمالاً <span className="bg-indigo-100 text-indigo-950 px-1.5 py-0.5 rounded font-mono font-extrabold border border-indigo-200">{toLangDigits(neededHelp, activeLang)}</span> درجات {isUboorAvailable ? 'للوصول لعتبة العبور (٤٠) ' : ''}وتنجح مباشرة!</>
                                                ) : (
                                                  <>Since you still have <span className="underline decoration-indigo-500 font-extrabold font-mono text-indigo-900">{remainingDecision}</span> decision marks left, you only need the teacher to give you <span className="bg-indigo-100 text-indigo-950 px-1.5 py-0.5 rounded font-mono font-extrabold border border-indigo-200">{teacherMarksVal}</span> more marks in Round 1. Combined with your remaining decision marks, this makes <span className="bg-indigo-100 text-indigo-950 px-1.5 py-0.5 rounded font-mono font-extrabold border border-indigo-200">{neededHelp}</span> marks {isUboorAvailable ? 'to reach the Carry-Over threshold of 40 ' : ''}and pass!</>
                                                )}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap ${isTrulyPassed ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'}`}>
                                      {isTrulyPassed ? LOCALE.badge_exempt[activeLang] : LOCALE.badge_prepare_r2[activeLang]}
                                    </span>
                                  </div>

                                  {/* Round 2 Continuous assessments input */}
                                  {!isTrulyPassed && (
                                    <div className="bg-slate-50/80 border border-slate-205 rounded-xl p-3.5 space-y-4">
                                      <div className="flex items-center gap-2 text-xs font-bold text-slate-705">
                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-505"></span>
                                        <span>{LOCALE.r2_assessment_header[activeLang]}</span>
                                      </div>
                                      
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Assessment 1 */}
                                        <div className="p-2.5 bg-white rounded-lg border border-slate-200/40 space-y-1.5">
                                          <div className="flex justify-between items-center text-[11px]">
                                            <span className="font-bold text-slate-600">{LOCALE.r2_ass_1[activeLang]}</span>
                                            <span className="font-bold text-sky-700 font-mono">{toLangDigits(getAssessment(sub.id).a1, activeLang)} / {toLangDigits(10, activeLang)}</span>
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

                                        {/* Assessment 2 */}
                                        <div className="p-2.5 bg-white rounded-lg border border-slate-200/40 space-y-1.5">
                                          <div className="flex justify-between items-center text-[11px]">
                                            <span className="font-bold text-slate-600">{LOCALE.r2_ass_2[activeLang]}</span>
                                            <span className="font-bold text-sky-700 font-mono">{toLangDigits(getAssessment(sub.id).a2, activeLang)} / {toLangDigits(10, activeLang)}</span>
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

                                      {/* Final Equation of calculation */}
                                      <div className="bg-indigo-50/40 border border-indigo-100 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                                        <div className="space-y-1">
                                          <p className="text-[11.5px] font-extrabold text-indigo-950">
                                            {LOCALE.r2_total_ass[activeLang]} <span className="text-indigo-750 font-mono text-sm font-black">{(getAssessment(sub.id).a1 + getAssessment(sub.id).a2)}</span> {activeLang === 'en' ? 'marks' : 'نمرە'}
                                          </p>
                                          <p className="text-[10px] text-slate-500 leading-relaxed max-w-lg">
                                            {isUboorEligible ? (
                                              <span className="text-emerald-805 font-bold block space-y-1">
                                                <span>{LOCALE.r2_uboor_eligible_desc[activeLang]}</span>
                                                {unsavedFailedCount > 1 && (
                                                  <span className="text-rose-800 bg-rose-50 border border-rose-100 p-1 px-1.5 rounded mt-1 block font-bold text-[9px]">
                                                    {LOCALE.r2_multi_fail_notice[activeLang]}
                                                  </span>
                                                )}
                                              </span>
                                            ) : (
                                              <span className="block space-y-1 font-medium">
                                                <span>{LOCALE.r2_exam_out_of_80[activeLang]}</span>
                                                {unsavedFailedCount > 1 && (
                                                  <span className="text-amber-900 bg-amber-50 border border-amber-205 p-1 px-1.5 rounded mt-1 block font-bold text-[9px]">
                                                    {LOCALE.r2_multi_fail_general_notice[activeLang]}
                                                  </span>
                                                )}
                                              </span>
                                            )}
                                          </p>
                                        </div>
                                        <div className="bg-white rounded-xl p-3 border border-indigo-100 text-center shrink-0 min-w-[155px] flex flex-col justify-center">
                                          <span className="block text-[9.5px] text-slate-500 font-extrabold mb-0.5 leading-none">
                                            {isUboorEligible ? LOCALE.r2_target_exam80_lbl[activeLang] : LOCALE.r2_target_exam80_standard_lbl[activeLang]}
                                          </span>
                                          <span className="text-2xl font-black text-indigo-600 font-mono">
                                            {toLangDigits(Math.max(0, (isUboorEligible ? 40 : 50) - (getAssessment(sub.id).a1 + getAssessment(sub.id).a2)), activeLang)}
                                          </span>
                                          <span className="text-[9px] block text-slate-400 font-extrabold mt-0.5 leading-tight">
                                            {isUboorEligible ? LOCALE.r2_target_score_helper_uboor[activeLang] : LOCALE.r2_target_score_helper_standard[activeLang]}
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

              {/* Right Column Stats & Timelines */}
              <div className="lg:col-span-4 space-y-8">
                
                {/* 1. Legal Protocol info card */}
                <section id="system-rule-info-card" className="bg-radial from-slate-50 to-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1 px-1.5 bg-indigo-100 text-indigo-950 rounded-lg text-[9.5px] font-black uppercase">
                      {LOCALE.ministry_badge_txt[activeLang]}
                    </div>
                    <h2 className="text-xs sm:text-sm font-extrabold text-slate-800">{LOCALE.ministry_rules_header[activeLang]}</h2>
                  </div>
                  <div className="space-y-3.5 text-xs leading-relaxed text-slate-600">
                    <p className="font-semibold text-slate-700">
                      {LOCALE.ministry_rules_intro[activeLang]}
                    </p>
                    <div className="bg-indigo-50/50 rounded-xl p-3 border border-indigo-100/50 space-y-2 text-[11px] text-indigo-950 font-semibold">
                      <p className="font-bold text-indigo-900">{LOCALE.ministry_rules_example_title[activeLang]}</p>
                      <ul className="list-disc list-inside space-y-1.5 px-0.5 font-medium leading-relaxed">
                        <li>{LOCALE.ministry_rules_ex_1[activeLang]}</li>
                        <li>{LOCALE.ministry_rules_ex_2[activeLang]}</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* 2. Decision Outcome Display */}
                <section id="decision-result-card" className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
                  <div className={`absolute top-0 right-0 left-0 h-2 
                    ${finalStatus === 'passed' ? 'bg-emerald-500' : 
                      finalStatus === 'uboor' ? 'bg-sky-500' : 'bg-rose-500'}`}
                  />

                  <div className="text-center pt-2 select-none">
                    <span className="text-[9.5px] uppercase font-bold text-slate-400 tracking-wider block">
                      {LOCALE.final_verdict_lbl[activeLang]}
                    </span>
                    
                    <div className="my-5 flex justify-center">
                      {finalStatus === 'passed' ? (
                        <div className="w-16 h-16 rounded-full bg-emerald-100 border-4 border-emerald-50 flex items-center justify-center text-emerald-600 animate-bounce">
                          <Award size={36} className="stroke-[2.5]" />
                        </div>
                      ) : finalStatus === 'uboor' ? (
                        <div className="w-16 h-16 rounded-full bg-sky-100 border-4 border-sky-50 flex items-center justify-center text-sky-600">
                          <Columns size={36} className="stroke-[2.5]" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-red-100 border-4 border-red-50 flex items-center justify-center text-red-600">
                          <AlertTriangle size={36} className="stroke-[2.5]" />
                        </div>
                      )}
                    </div>

                    <h3 className={`text-xl sm:text-2xl font-black leading-snug 
                      ${finalStatus === 'passed' ? 'text-emerald-800' : finalStatus === 'uboor' ? 'text-sky-850' : 'text-rose-800'}`}
                    >
                      {finalStatus === 'passed' ? LOCALE.passed_header_verdict[activeLang] : finalStatus === 'uboor' ? LOCALE.uboor_header_verdict[activeLang] : LOCALE.failed_header_verdict[activeLang]}
                    </h3>

                    <p className="text-slate-500 text-xs mt-2 max-w-xs mx-auto leading-relaxed">
                      {studentName ? `${LOCALE.student_dear[activeLang]} [${studentName}] ` : `${LOCALE.the_student_male[activeLang]} `} 
                      {finalStatus === 'passed' ? LOCALE.passed_verdict_reason[activeLang] : finalStatus === 'uboor' ? LOCALE.uboor_verdict_reason[activeLang] : LOCALE.failed_verdict_reason[activeLang]}
                    </p>
                  </div>

                  {/* Analytics Metrics */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl scale-95 my-5 border border-slate-100 select-none">
                    <div className="text-center border-inline-end border-slate-200">
                      <span className="block text-[9.5px] text-slate-400 font-bold leading-none mb-1">{LOCALE.average_lbl[activeLang]}</span>
                      <span className="font-extrabold text-slate-800 font-mono text-sm">{toLangDigits(averageScore, activeLang)}{activeLang === 'en' ? '%' : '٪'}</span>
                    </div>
                    <div className="text-center border-inline-end border-slate-200">
                      <span className="block text-[9.5px] text-slate-400 font-bold leading-none mb-1">{LOCALE.fails_lbl[activeLang]}</span>
                      <span className={`font-extrabold text-xs sm:text-sm font-mono ${calculation.failedSubjectsCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {toLangDigits(calculation.failedSubjectsCount, activeLang)} {LOCALE.fails_badge_plural[activeLang]}
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="block text-[9.5px] text-slate-400 font-bold leading-none mb-1">{LOCALE.help_used_lbl[activeLang]}</span>
                      <span className="font-extrabold text-slate-800 font-mono text-xs sm:text-sm text-sky-700">+{toLangDigits(calculation.totalHelpMarksUsed, activeLang)}</span>
                    </div>
                  </div>

                  {/* Copy button */}
                  <div className="mt-4 shrink-0">
                    <button 
                      id="btn-copy-report"
                      onClick={handleCopyReport}
                      className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 active:scale-95 border border-slate-800 text-white font-black text-xs py-3 rounded-xl transition-all shadow-2xs"
                    >
                      {copied ? (
                        <>
                          <ClipboardCheck size={16} className="text-emerald-400" />
                          <span>{LOCALE.copied_success_notice[activeLang]}</span>
                        </>
                      ) : (
                        <>
                          <Share2 size={16} />
                          <span>{LOCALE.copy_report_btn[activeLang]}</span>
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-center text-slate-400 mt-2.5 leading-snug">
                      {LOCALE.copy_button_hint[activeLang]}
                    </p>
                  </div>
                </section>

                {/* 3. Helper step-by-step Timeline */}
                <section id="help-steps-timeline-card" className="bg-slate-900 text-slate-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>
                  
                  <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
                    <Sparkles className="text-amber-400 shrink-0" size={18} />
                    <h3 className="text-xs sm:text-sm font-black">{LOCALE.timeline_header_title[activeLang]}</h3>
                  </div>

                  <div className="space-y-4">
                    {explanationStepsLocalized.map((step, idx) => {
                      let colorClass = 'border-slate-805 text-slate-300 bg-slate-800/25';
                      let dotColor = 'bg-slate-600';
                      
                      if (step.type === 'success') {
                        colorClass = 'border-emerald-950/80 text-emerald-100 bg-emerald-950/20';
                        dotColor = 'bg-emerald-555';
                      } else if (step.type === 'warning') {
                        colorClass = 'border-yellow-950/80 text-yellow-100 bg-yellow-955/20';
                        dotColor = 'bg-amber-500';
                      }

                      return (
                        <div 
                          key={`${step.title}-${idx}`}
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

                  <div className="mt-5 pt-3 border-t border-slate-800 text-center select-none">
                    <span className="text-[9.5px] text-slate-450 font-medium">
                      {LOCALE.timeline_footer_note[activeLang]}
                    </span>
                  </div>
                </section>

                {/* Subject Grade Details Post-calculation comparison */}
                <section id="results-comparison-card" className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
                  <h3 className="text-xs font-black text-slate-705 mb-3 block">{LOCALE.comparison_title[activeLang]}</h3>
                  {calculation.subjects.length === 0 ? (
                    <span className="text-slate-400 text-xs block text-center min-h-[50px] py-4">{LOCALE.no_comparison_data[activeLang]}</span>
                  ) : (
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {calculation.subjects.map((sub) => {
                        const statusColor = sub.isPassed ? 'text-green-700 bg-green-50' : 'text-rose-700 bg-rose-50';
                        const origSub = subjects.find(s => s.id === sub.id) || sub;
                        return (
                          <div key={sub.id} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg text-xs">
                            <span className="font-bold text-slate-850">{getSubjectName(origSub)}</span>
                            <div className="flex items-center gap-2 select-none">
                              {sub.helpMarksAdded > 0 ? (
                                <div className="text-left font-bold block">
                                  <span className="line-through text-slate-400 text-[10px] ml-1 font-mono">{toLangDigits(sub.originalScore, activeLang)}</span>
                                  <span className="font-black text-sky-700 font-mono ml-1">{toLangDigits(sub.finalScore, activeLang)}</span>
                                  <span className="bg-sky-100/80 text-sky-850 scale-90 px-1 py-0.5 rounded text-[9.5px] font-bold">+{toLangDigits(sub.helpMarksAdded, activeLang)} {LOCALE.badge_grace_short[activeLang]}</span>
                                </div>
                              ) : (
                                <span className="font-bold font-mono text-slate-600">{toLangDigits(sub.finalScore, activeLang)}</span>
                              )}
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-black ${statusColor}`}>
                                {sub.isPassed ? LOCALE.badge_exempt_short[activeLang] : LOCALE.badge_fail_short[activeLang]}
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
              transition={{ duration: 0.2 }}
              className="max-w-4xl mx-auto space-y-8 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs"
            >
              
              <div className="text-center border-b border-slate-100 pb-6 max-w-xl mx-auto select-none">
                <span className="bg-sky-100 text-sky-800 text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider">
                  {LOCALE.ministry_badge_txt[activeLang]}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2.5">{LOCALE.rules_guide_heading[activeLang]}</h2>
                <p className="text-slate-500 text-xs sm:text-sm mt-1.5 leading-relaxed">
                  {LOCALE.rules_guide_desc[activeLang]}
                </p>
              </div>

              {/* Grid outline detailing the official rules */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 select-none">
                
                {/* Rule 5 */}
                <div id="rule-desc-1" className="p-5 rounded-xl bg-amber-50/50 border border-amber-100 space-y-3">
                  <div className="flex items-center gap-2 border-b border-amber-200/50 pb-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold font-mono text-base">{toLangDigits(5, activeLang)}</div>
                    <h3 className="font-black text-amber-950 text-base">{LOCALE.rule_5_title[activeLang]}</h3>
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed font-semibold">
                    {LOCALE.rule_5_desc[activeLang]}
                  </p>
                  <div className="p-3 bg-white/75 rounded-lg text-[11px] space-y-1.5 font-bold">
                    <span className="block text-slate-800">{LOCALE.rule_5_ex_title[activeLang]}</span>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 scale-[0.95] origin-top-right">
                      <li>{LOCALE.rule_5_line_1[activeLang]}</li>
                      <li>{LOCALE.rule_5_line_2[activeLang]}</li>
                      <li>{LOCALE.rule_5_line_3[activeLang]}</li>
                    </ul>
                  </div>
                </div>

                {/* Rule 10 */}
                <div id="rule-desc-2" className="p-5 rounded-xl bg-sky-50/50 border border-sky-100 space-y-3">
                  <div className="flex items-center gap-2 border-b border-sky-200/50 pb-2.5">
                    <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold font-mono text-base">{toLangDigits(10, activeLang)}</div>
                    <h3 className="font-black text-sky-950 text-base">{LOCALE.rule_10_title[activeLang]}</h3>
                  </div>
                  <p className="text-xs text-sky-900 leading-relaxed font-semibold">
                    {LOCALE.rule_10_desc[activeLang]}
                  </p>
                  <div className="p-3 bg-white/75 rounded-lg text-[11px] space-y-1.5 font-bold">
                    <span className="block text-slate-800">{LOCALE.rule_10_ex_title[activeLang]}</span>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 scale-[0.95] origin-top-right">
                      <li>{LOCALE.rule_10_line_1[activeLang]}</li>
                      <li>{LOCALE.rule_10_line_2[activeLang]}</li>
                      <li>{LOCALE.rule_10_line_3[activeLang]}</li>
                    </ul>
                  </div>
                </div>

              </div>

              {/* Status Matrix */}
              <section id="academic-status-matrix" className="bg-slate-50 rounded-xl p-5 border border-slate-200 select-none">
                <h3 className="font-black text-slate-800 text-sm mb-4">{LOCALE.matrix_title[activeLang]}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div className="p-4 bg-white rounded-lg border-inline-start-4 border-emerald-500 shadow-3xs">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded">{LOCALE.matrix_pass_lbl[activeLang]}</span>
                    <h4 className="font-black text-sm text-slate-900 mt-2">{LOCALE.matrix_pass_header[activeLang]}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      {LOCALE.matrix_pass_desc[activeLang]}
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-lg border-inline-start-4 border-rose-500 shadow-3xs">
                    <span className="bg-rose-100 text-rose-800 text-[10px] font-black px-2 py-0.5 rounded">{LOCALE.matrix_fail_lbl[activeLang]}</span>
                    <h4 className="font-black text-sm text-slate-900 mt-2">{LOCALE.matrix_fail_header[activeLang]}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      {LOCALE.matrix_fail_desc[activeLang]}
                    </p>
                  </div>

                </div>
              </section>

              {/* Return Button */}
              <div className="flex justify-center pt-4">
                <button 
                  id="btn-return-calc"
                  onClick={() => setActiveTab('calculator')}
                  className="bg-sky-950 text-white font-extrabold text-xs px-6 py-3 rounded-xl hover:bg-sky-900 active:scale-95 transition-all shadow-xs"
                >
                  {LOCALE.btn_return[activeLang]}
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Aesthetic Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 shrink-0 mt-12 text-center text-xs text-slate-500 space-y-2 select-none">
        <p className="max-w-md mx-auto leading-relaxed font-semibold">
          {LOCALE.footer_text[activeLang]}
        </p>
        <div className="flex justify-center gap-4 text-slate-400 font-mono text-[11px]">
          <span>{LOCALE.footer_credit_1[activeLang]}</span>
          <span>•</span>
          <span>{LOCALE.footer_credit_2[activeLang]}</span>
        </div>
      </footer>

    </div>
  );
}
