import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Share2, ArrowLeft, RefreshCw, Zap, TrendingUp, HelpCircle } from 'lucide-react';
import { SubjectGrade, CalculationResult } from '../types';
import { Lang } from './LanguageSelector';
import { STAGES, toLangDigits } from '../translations';

interface VerdictResultsViewProps {
  activeLang: Lang;
  studentName: string;
  stageId: string;
  activeSubjects: SubjectGrade[];
  calculation: CalculationResult;
  averageScore: number;
  initialFailedCount: number;
  finalStatus: 'passed' | 'uboor' | 'failed';
  getAssessment: (id: string) => { s1a1: number; s1a2: number; s2a1: number; s2a2: number };
  updateAssessment: (id: string, field: 's1a1' | 's1a2' | 's2a1' | 's2a2', valueStr: string) => void;
  getSubjectName: (sub: { name: string; key?: string }) => string;
  onModify: () => void;
  onShare: (reportText: string) => void;
  copied: boolean;
}

export default function VerdictResultsView({
  activeLang,
  studentName,
  stageId,
  activeSubjects,
  calculation,
  averageScore,
  initialFailedCount,
  finalStatus,
  getAssessment,
  updateAssessment,
  getSubjectName,
  onModify,
  onShare,
  copied
}: VerdictResultsViewProps) {
  
  // Toggles active bottom icon dashboard
  const [activeBottomCategory, setActiveBottomCategory] = useState<'r1' | 'r2' | null>('r1');

  const dict = {
    kus: {
      passed: 'قوتابی بە سەرکەوتوویی تێپەڕی 🎉',
      uboor: 'قوتابی سەرکەوت بۆ قۆناغی تر بە عوبور (مەرجدار) 🔵',
      failed: 'قوتابی دەرنەچوو (پێویستی بە خولی دووەمە) ⚠️',
      verdict_passed: 'دەرچوو',
      verdict_uboor: 'عوبور (مەرجدار)',
      verdict_failed: 'خولی دووەم',
      average: 'تێکڕای گشتی:',
      copied_msg: 'ڕاپۆرتەکە کۆپی کرا! 📋',
      share: 'مشارکەکردنی ئەنجام 📋',
      edit: 'دەستکاریکردنی نمرەکان ✏️',
      r1_title: 'خولی یەکەم: نمرەی پێویست',
      r1_desc: 'چەند نمرە پێویستە بۆ ڕزگاربوون لە خولی دووەم؟',
      r2_title: 'خولی دووەم: بەشی هەڵسەنگاندن',
      r2_desc: 'نمرەی هەڵسەنگاندن و ئەزموونی پێویستی خولی دووەم',
      r1_safe: 'قوتابی بە تەواوی دەرچووە و پێویستی بە هیچ نمرەیەکی تر نییە بۆ دوورکەوتنەوە لە خولی دووەم! 👏',
      r1_needs: 'بۆ ڕزگاربوون لە خولی دووەم، پێویستە نمرەی ئەم بابەتانەت بگەیەنیتە تێکڕای دەرچوون (٥٠ نمرە):',
      r2_safe: 'قوتابی لە سەرجەم بابەتەکان دەرچووە و پێویستی بە ئامادەکاری نییە بۆ خولی دووەم! 🥳',
      r2_needs: 'بۆ ئەو بابەتانەی دەرنەچوویت، نمرەی هەڵسەنگاندنی بەردەوامی هەردوو وەرزەکان دیاری بکە بۆ ئەوەی بزانیت پێویستە چەند بهێنیت لە ئەزموونی خولی دووەم بۆ دەرچوون:',
      ass1: 'هەڵسەنگاندنی ١',
      ass2: 'هەڵسەنگاندنی ٢',
      sem1: 'وەرزێ ئێکێ',
      sem2: 'وەرزێ دووێ',
      sum_ass: 'کۆی هەڵسەنگاندن:',
      aim: 'نمرەی پێویست لە ئەزموونی خولی دووەم:',
      needed_marks: 'پێویستی بە +{diff} نمرە هەیە بۆ دەرچوون',
      change_lang_btn: 'گۆڕینی زمان 🌐'
    },
    kub: {
      passed: 'قوتابی ب سەرکەفتیانە دەربازبوو 🎉',
      uboor: 'قوتابی دەربازبوو بۆ قۆناغا دی ب مەرجێ عوبورێ 🔵',
      failed: 'قوتابی دەرنەکەفت (پێتڤی ب خولا دووێ یە) ⚠️',
      verdict_passed: 'دەربازبوو (ناجح)',
      verdict_uboor: 'عوبور (مەرجدار)',
      verdict_failed: 'خولا دووێ',
      average: 'تێکڕایێ گشتی:',
      copied_msg: 'راپۆرت ب سەرکەفتیانە کۆپی بوو! 📋',
      share: 'مشارکەکرن و کۆپیکردنا ئەنجامی 📋',
      edit: 'دەستکاریکرنا نمران ✏️',
      r1_title: 'خولا ئێکێ: نمرێن پێتڤی',
      r1_desc: 'چەند نمرە پێتڤین کو نەچیە دەورێ دووێ؟',
      r2_title: 'خولا دووێ: بەشێ هەلسەنگاندنێ',
      r2_desc: 'نمرەیێن هەلسەنگاندنێ و تاقیکردنەوا خولا دووێ',
      r1_safe: 'قوتابی ب تەمامی دەربازبوویە و پێتڤی ب چو نمرەیێن دی نینە بۆ دوورکەفتن ژ خولا دووێ! 👏',
      r1_needs: 'بۆ قورتالبوون ژ خولا دووێ، پێتڤیە نمرەیا ڤان بابەتان بگەهینیە ٥٠ نمران:',
      r2_safe: 'قوتابی یێ دەربازبووی د هەمی بابەتان دا و پێتڤی ب ئامادەکاریێ نینە بۆ خولا دووێ! 🥳',
      r2_needs: 'بۆ بابەتێن کەفتی، نمرەیێن هەلسەنگاندنا بەردەوام یێن هەردوو وەرزان بنڤیسە دا بزانی نمرەیا پێتڤی ل ئەزموونا خولا دووێ چەندە:',
      ass1: 'هەلسەنگاندنا ١',
      ass2: 'هەلسەنگاندنا ٢',
      sem1: 'وەرزێ ئێکێ',
      sem2: 'وەرزێ دووێ',
      sum_ass: 'کۆیا هەلسەنگاندنێ:',
      aim: 'نمرەیا پێتڤی ل تاقیکردنەوا خولا دووێ:',
      needed_marks: 'پێتڤی ب +{diff} نمران هەیە بۆ دەربازبوونێ',
      change_lang_btn: 'گۆهرینا زمانی 🌐'
    },
    ar: {
      passed: 'نجح الطالب واجتاز المرحلة الدراسية بنجاح واجتهاد 🎉',
      uboor: 'تأهل الطالب للمرحلة التالية بقرار العبور لمادة واحدة مقرر 🔵',
      failed: 'لم يجتز الطالب (مؤهل لدخول تاقيكردنات الدور الثاني) ⚠️',
      verdict_passed: 'ناجح',
      verdict_uboor: 'عبور (مقرر متبقي)',
      verdict_failed: 'دور ثاني',
      average: 'المعدل العام:',
      copied_msg: 'تم نسخ تقرير الطالب بنجاح! 📋',
      share: 'مشاركة ونشر النتيجة 📋',
      edit: 'تعديل علامات المواد ✏️',
      r1_title: 'الدور الأول: العلامات المطلوبة',
      r1_desc: 'كم درجة متبقية لتجنب الرسوب والدخول في الدور الثاني؟',
      r2_title: 'الدور الثاني: علامات الأنشطة',
      r2_desc: 'تقييم الأنشطة ودرجة الامتحان التحريري المطلوب للنجاح في الدور الثاني',
      r1_safe: 'الطالب حاصل على علامة النجاح الكامل تماماً ولا يحتاج لدخول الدور الثاني! 👏',
      r1_needs: 'لتلافي الرسوب التام والدور الثاني، يجب زيادة درجات المواد الآتية لتصل لدرجة الصغرى (50 درجة):',
      r2_safe: 'اجتاز الطالب كافة المواد بنجاح، لا توجد مواد متبقية للتحضير منها للدور الثاني! 🥳',
      r2_needs: 'للمواد غير المجتازة، يرجى تعبئة الأنشطة السنوية للفصلين لمعرفة الدرجة المطلوبة في امتحان الدور الثاني:',
      ass1: 'التقييم 1',
      ass2: 'التقييم 2',
      sem1: 'الفصل الأول',
      sem2: 'الفصل الثاني',
      sum_ass: 'النشاط الكلي:',
      aim: 'الدرجة التحررية المطلوبة في الدور الثاني:',
      needed_marks: 'بحاجة إلى زيادة +{diff} درجات للنجاح',
      change_lang_btn: 'تغيير لغة النظام 🌐'
    },
    en: {
      passed: 'Student passed successfully! 🎉',
      uboor: 'Advanced with Carry-Over (subject carried over to next level) 🔵',
      failed: 'Failed (referred to the Second Round core exams) ⚠️',
      verdict_passed: 'Passed',
      verdict_uboor: 'Carry-Over',
      verdict_failed: 'Round 2',
      average: 'Overall Average:',
      copied_msg: 'Report copied to clipboard! 📋',
      share: 'Share & Copy Report 📋',
      edit: 'Modify Raw Grades ✏️',
      r1_title: 'Round 1: Required Marks',
      r1_desc: 'How many marks needed in Round 1 to avoid Round 2?',
      r2_title: 'Round 2: Continuous Assessment',
      r2_desc: 'Add continuous evaluation and check requested written exam goal out of 80',
      r1_safe: 'Student has passed all exams nicely and already avoids the Second Round entirely! 👏',
      r1_needs: 'To avoid the Second school round and qualify directly, these subjects need additional grade marks to reach 50:',
      r2_safe: 'All exams are passed, no failed subjects to prepare for Round 2! 🥳',
      r2_needs: 'For other failed subjects, set your continuous assessments for both semesters to compute the required final written exam grade:',
      ass1: 'Assessment 1',
      ass2: 'Assessment 2',
      sem1: 'First Semester',
      sem2: 'Second Semester',
      sum_ass: 'Total Assessment Settle:',
      aim: 'Required written exam score:',
      needed_marks: 'Needs +{diff} more marks to pass',
      change_lang_btn: 'Change Language 🌐'
    }
  }[activeLang];

  const isRtl = activeLang !== 'en';

  // Find all failed subjects (raw score < 50)
  const failedSubjects = activeSubjects.filter(s => s.score < 50);
  const failedSubjectsForR2 = activeSubjects.filter(sub => {
    if (calculation.status === 'passed' || calculation.status === 'uboor') {
      return false;
    }
    const calcSub = calculation.subjects.find(s => s.id === sub.id);
    if (!calcSub) return sub.score < 50;
    return !calcSub.isPassed || calcSub.helpRuleUsed === '10_marks_rule';
  });

  // The weakest subject is the one with the lowest score. This is designated as the primary candidate for Uboor in Round 2.
  const weakestSubject = failedSubjects.length > 0 
    ? [...failedSubjects].sort((a, b) => a.score - b.score)[0] 
    : null;

  // Calculates teacher appeal / grace advice by simulating optimal official rules first
  const getTeacherGraceAdvice = () => {
    // Failing subjects are those with raw score < 50
    const failing = activeSubjects
      .filter(s => s.score < 50)
      .sort((a, b) => a.score - b.score)
      .map(s => ({
        id: s.id,
        name: getSubjectName(s),
        key: s.key,
        score: s.score,
        need: 50 - s.score,
      }));

    if (failing.length === 0) return [];

    // Recursively generates all combinations of distributing up to a maximum number of decision marks among subjects
    const distributeDecisionMarks = (count: number, marksLeft: number): number[][] => {
      if (count === 0) return [[]];
      if (count === 1) {
        const results: number[][] = [];
        for (let i = 0; i <= marksLeft; i++) {
          results.push([i]);
        }
        return results;
      }
      const results: number[][] = [];
      const subDist = distributeDecisionMarks(count - 1, marksLeft);
      for (const dist of subDist) {
        const sumUsed = dist.reduce((sum, val) => sum + val, 0);
        const rem = marksLeft - sumUsed;
        for (let nextVal = 0; nextVal <= rem; nextVal++) {
          results.push([...dist, nextVal]);
        }
      }
      return results;
    };

    const F = failing.length;
    const decisionDistributions = distributeDecisionMarks(F, 5);

    const getPenalty = (gap: number) => {
      // Cubic penalty to strongly prioritize reducing larger gaps
      return Math.pow(gap, 3);
    };

    let bestAllocation: {
      decisionAlloc: number[];
      uboorIndex: number; // Index of subject getting Uboor, or -1
      uboorAmount: number;
      teacherAlloc: number[];
      totalTeacherHelp: number;
      totalOfficialHelpUsed: number;
      totalPenalty: number;
    } | null = null;

    // We can choose which subject receives Uboor (-1 for none, or indices from 0 to F-1)
    for (let uIdx = -1; uIdx < F; uIdx++) {
      for (const dAlloc of decisionDistributions) {
        let currentTeacherAlloc: number[] = [];
        let currentUboorAmount = 0;
        let totalT = 0;
        let totalD = 0;
        let totalU = 0;
        let currentPenaltyOfAllocation = 0;

        for (let i = 0; i < F; i++) {
          const score = failing[i].score;
          const dMarks = dAlloc[i];
          
          let tMarks = 0;
          let uMarks = 0;
          
          if (i === uIdx) {
            // Uboor subject: needs to reach at least 40 as raw + teacher + decision
            tMarks = Math.max(0, 40 - score - dMarks);
            currentTeacherAlloc.push(tMarks);
            totalT += tMarks;
            
            // The rest is covered by Uboor (capped at 10)
            const remainingForUboor = 50 - (score + tMarks + dMarks);
            uMarks = Math.max(0, Math.min(10, remainingForUboor));
            currentUboorAmount = uMarks;
            totalU += uMarks;
          } else {
            // Normal subject: needs to reach 50
            tMarks = Math.max(0, 50 - score - dMarks);
            currentTeacherAlloc.push(tMarks);
            totalT += tMarks;
          }
          
          totalD += dMarks;

          // Calculate gap and penalty for this subject in this distribution
          const finalScore = score + tMarks + dMarks + uMarks;
          const remainingGap = Math.max(0, 50 - finalScore);
          currentPenaltyOfAllocation += getPenalty(remainingGap);
        }

        const allocObj = {
          decisionAlloc: dAlloc,
          uboorIndex: uIdx,
          uboorAmount: currentUboorAmount,
          teacherAlloc: currentTeacherAlloc,
          totalTeacherHelp: totalT,
          totalOfficialHelpUsed: totalD + totalU,
          totalPenalty: currentPenaltyOfAllocation
        };

        if (bestAllocation === null) {
          bestAllocation = allocObj;
        } else {
        // Choose lowest teacher help needed. In case of tie, choose the one using more official help marks
        if (allocObj.totalTeacherHelp < bestAllocation.totalTeacherHelp) {
          bestAllocation = allocObj;
        } else if (
          allocObj.totalTeacherHelp === bestAllocation.totalTeacherHelp &&
          allocObj.totalOfficialHelpUsed > bestAllocation.totalOfficialHelpUsed
        ) {
          bestAllocation = allocObj;
        }
        }
      }
    }

    if (!bestAllocation) return [];

    const { decisionAlloc, uboorIndex, uboorAmount, teacherAlloc } = bestAllocation;

    return failing.map((s, idx) => {
      const dMarks = decisionAlloc[idx];
      const uMarks = (idx === uboorIndex) ? uboorAmount : 0;
      const tMarks = teacherAlloc[idx];
      const totalHelp = dMarks + uMarks;

      let helpRuleUsed: '5_marks_rule' | '10_marks_rule' | 'none' = 'none';
      if (uMarks > 0) {
        helpRuleUsed = '10_marks_rule';
      } else if (dMarks > 0) {
        helpRuleUsed = '5_marks_rule';
      }

      return {
        id: s.id,
        name: s.name,
        originalScore: s.score,
        neededFromTeacher: tMarks,
        helpRuleUsed,
        helpMarksAdded: totalHelp,
        dMarksUsed: dMarks,
        uMarksUsed: uMarks
      };
    });
  };

  const generateShareReport = () => {
    const formattedAverage = toLangDigits(averageScore, activeLang);
    const stageName = STAGES[stageId]?.[activeLang] || stageId;
    const nameStr = studentName.trim() || (activeLang === 'en' ? 'Anonymous' : 'قوتابی');

    let text = '';
    
    // Status Emoji & Title
    let title = '';
    let statusLabel = '';
    if (activeLang === 'kub') {
      title = `📊 کارناما نمرەیێن قوتابی (پێشنیارکری)`;
      statusLabel = finalStatus === 'passed' ? '🟢 ناجح (دەربازبوو)' : finalStatus === 'uboor' ? '🔵 عوبور (مەرجدار)' : '🔴 پێتڤی ب خولا دووێ یە';
    } else if (activeLang === 'kus') {
      title = `📊 کارنامەی نمرەکانی قوتابی (پێشنیارکراو)`;
      statusLabel = finalStatus === 'passed' ? '🟢 دەرچوو' : finalStatus === 'uboor' ? '🔵 عوبور' : '🔴 پێویستی بە خولی دووەمە';
    } else if (activeLang === 'ar') {
      title = `📊 كارتب مواده الدراسي (المقترح)`;
      statusLabel = finalStatus === 'passed' ? '🟢 ناجح' : finalStatus === 'uboor' ? '🔵 عبور' : '🔴 بحاجة للدور الثاني';
    } else {
      title = `📊 Student Academic Report (Suggested Advice)`;
      statusLabel = finalStatus === 'passed' ? '🟢 Passed' : finalStatus === 'uboor' ? '🔵 Carry-Over (Uboor)' : '🔴 Needs Round 2';
    }

    text += `━━━━━━━ ${title} ━━━━━━━\n\n`;
    text += `👤 ${activeLang === 'en' ? 'Student' : 'قوتابی'}: ${nameStr}\n`;
    text += `🏫 ${activeLang === 'en' ? 'Grade' : 'پۆل'}: ${stageName}\n`;
    text += `📊 ${activeLang === 'en' ? 'Average' : 'تێکڕا'}: ${formattedAverage}%\n`;
    text += `🏆 ${activeLang === 'en' ? 'Status' : 'ئەنجام'}: ${statusLabel}\n\n`;

    // 1. Raw grades list
    let originalGradesHeader = '';
    if (activeLang === 'kub') originalGradesHeader = '📝 نمرەیێن قوتابی یێن ڕاستەقینە:';
    else if (activeLang === 'kus') originalGradesHeader = '📝 نمرەکانی قوتابی یە ڕاستەقینەکان:';
    else if (activeLang === 'ar') originalGradesHeader = '📝 درجات الطالب الأصلية:';
    else originalGradesHeader = '📝 Original Subject Grades:';

    text += `${originalGradesHeader}\n`;
    activeSubjects.forEach(s => {
      text += ` ▪️ ${getSubjectName(s)}: ${toLangDigits(s.score, activeLang)}\n`;
    });
    text += `\n`;

    // 2. Official Decisions / Additions Applied
    const advices = getTeacherGraceAdvice();
    const hasOfficialDecisions = advices.some(a => a.helpMarksAdded > 0);
    
    if (hasOfficialDecisions) {
      let officialHeader = '';
      if (activeLang === 'kub') officialHeader = '⚖️ دابەشکرنا بڕیار و عوبورا فەرمی:';
      else if (activeLang === 'kus') officialHeader = '⚖️ دابەشکردنی بڕیار و عوبۆری فەرمی:';
      else if (activeLang === 'ar') officialHeader = '⚖️ توزيع درجات القرار والعبور الرسمية:';
      else officialHeader = '⚖️ Official Decisions & Carry-Over Allocation:';

      text += `${officialHeader}\n`;
      advices.forEach(a => {
        if (a.helpMarksAdded > 0) {
          let ruleStr = '';
          if (a.dMarksUsed > 0 && a.uMarksUsed > 0) {
            ruleStr = activeLang === 'kub' ? `+${a.dMarksUsed} نمرێن بڕیارێ و +${a.uMarksUsed} نمرێن عوبورێ`
              : activeLang === 'kus' ? `+${a.dMarksUsed} نمرەی بڕیار و +${a.uMarksUsed} نمرەی عوبور`
              : activeLang === 'ar' ? `+${a.dMarksUsed} درجات قرار و +${a.uMarksUsed} درجات عبور`
              : `+${a.dMarksUsed} Decision & +${a.uMarksUsed} Carry-Over`;
          } else if (a.uMarksUsed > 0) {
            ruleStr = activeLang === 'kub' ? `+${a.uMarksUsed} نمرێن بڕیارا عوبورێ`
              : activeLang === 'kus' ? `+${a.uMarksUsed} نمرەی بڕیاری عوبور`
              : activeLang === 'ar' ? `+${a.uMarksUsed} درجات قرار عبور`
              : `+${a.uMarksUsed} Carry-Over marks`;
          } else {
            ruleStr = activeLang === 'kub' ? `+${a.dMarksUsed} نمرێن بڕیارێ`
              : activeLang === 'kus' ? `+${a.dMarksUsed} نمرەی بڕیاری گشتی`
              : activeLang === 'ar' ? `+${a.dMarksUsed} درجات القرار العام`
              : `+${a.dMarksUsed} Decision pool marks`;
          }
          text += `  ✨ ${a.name}: ${toLangDigits(a.originalScore, activeLang)} ➔ بەرزبووەوە بۆ ٥٠ (${ruleStr})\n`;
        }
      });
      text += `\n`;
    }

    // 3. Recommended marks needed from Teacher
    const needsTeacherHelp = advices.some(a => a.neededFromTeacher > 0);
    if (needsTeacherHelp) {
      let teacherHeader = '';
      if (activeLang === 'kub') teacherHeader = '🧑‍🏫 نمرەیێن پێشنیارکری ژلایێ مامۆستایان ڤە:';
      else if (activeLang === 'kus') teacherHeader = '🧑‍🏫 نمرەی پێویستی پێشنیارکراو لە لایەن مامۆستایانەوە:';
      else if (activeLang === 'ar') teacherHeader = '🧑‍🏫 درجات المساعدة الإضافية المطلوبة من المعلمين:';
      else teacherHeader = '🧑‍🏫 Suggested Teacher Grace Assistance:';

      text += `${teacherHeader}\n`;
      advices.forEach(a => {
        if (a.neededFromTeacher > 0) {
          let neededStr = '';
          if (activeLang === 'kub') neededStr = `پێتڤی ب +${a.neededFromTeacher} نمرەیا هەیە ژلایێ مامۆستایی ڤە`;
          else if (activeLang === 'kus') neededStr = `پێویستی بە +${a.neededFromTeacher} نمرە هەیە لە لایەن مامۆستاوە`;
          else if (activeLang === 'ar') neededStr = `بحاجة لـ +${a.neededFromTeacher} درجات مساعدة من المعلم`;
          else neededStr = `Needs +${a.neededFromTeacher} marks from the teacher`;

          text += `  🔹 ${a.name}: ${neededStr}\n`;
        }
      });
      text += `\n`;
    }

    // Footnote
    let footnote = '';
    if (activeLang === 'kub') footnote = '📌 ئەڤ کارنامەیە ب شێوازەکێ ئەندازیاری و زیرەک نمرێن بڕیار و عوبورێ دابەش دکەت دا کو کەمترین هاوکاری ژلایێ مامۆستایان پێویست بیت بۆ سەرکەوتنا قوتابی.';
    else if (activeLang === 'kus') footnote = '📌 ئەم کارنامەیە بە شێوازێکی زیرەک و ماتماتیکی نمرەکانی بڕیار و عوبور دابەش دەکات تاوەکو کەمترین هاوکاری لە مامۆستایانەوە پێویست بێت بۆ دەرچوونی قوتابیەکە.';
    else if (activeLang === 'ar') footnote = '📌 يقوم هذا النظام بتوزيع درجات القرار والعبور بطريقة مثالية وذكية لتقليل وتسهيل درجات المساعدة المطلوبة من المعلمين لضمان نجاح الطالب.';
    else footnote = '📌 This system distributes the official decision pool and carry-over (uboor) rules optimally to minimize the grace marks requested from teachers to pass.';

    text += `${footnote}\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━━━`;
    
    return text;
  };

  // Verdict Colors
  const theme = {
    passed: {
      bg: 'bg-emerald-50/40 border-emerald-150',
      headerBg: 'bg-emerald-600',
      text: 'text-emerald-950',
      iconColor: 'text-emerald-600',
      tag: 'bg-emerald-100 text-emerald-800'
    },
    uboor: {
      bg: 'bg-sky-50/40 border-sky-150',
      headerBg: 'bg-sky-600',
      text: 'text-sky-950',
      iconColor: 'text-sky-600',
      tag: 'bg-sky-100 text-sky-800'
    },
    failed: {
      bg: 'bg-rose-50/40 border-rose-150',
      headerBg: 'bg-rose-600',
      text: 'text-rose-950',
      iconColor: 'text-rose-600',
      tag: 'bg-rose-100 text-rose-800'
    }
  }[finalStatus];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full max-w-2xl mx-auto space-y-6 pb-20 px-4"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* 1. Main simplified Result Verdict Banner */}
      <div className={`bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden text-center p-6 relative`}>
        {/* Dynamic decorative backdrop strip */}
        <div className={`absolute top-0 left-0 right-0 h-2 ${finalStatus === 'passed' ? 'bg-emerald-500' : finalStatus === 'uboor' ? 'bg-sky-500' : 'bg-red-500'}`}></div>

        <div className="mx-auto mb-4 w-12 h-12 rounded-full flex items-center justify-center bg-slate-50 select-none">
          {finalStatus === 'passed' ? (
            <CheckCircle2 size={32} className="text-emerald-500" />
          ) : finalStatus === 'uboor' ? (
            <CheckCircle2 size={32} className="text-sky-500" />
          ) : (
            <AlertCircle size={32} className="text-rose-500" />
          )}
        </div>

        <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 select-none">
          {activeLang === 'en' ? 'FINAL VERDICT' : 'ئەنجامی سەرکەوتن'}
        </h2>
        
        <h1 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
          {dict[finalStatus]}
        </h1>

        {/* Short info block */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
          <div>
            <span className="font-medium text-slate-400 select-none">{activeLang === 'en' ? 'Student: ' : 'قوتابی: '}</span>
            <span className="font-black text-slate-700">{studentName.trim() || (activeLang === 'en' ? 'Anonymous' : 'قوتابی خوێندنگە')}</span>
          </div>
          <div className="text-slate-300">•</div>
          <div>
            <span className="font-medium text-slate-400 select-none">{activeLang === 'en' ? 'Grade: ' : 'پۆل: '}</span>
            <span className="font-extrabold text-slate-700">{STAGES[stageId]?.[activeLang]}</span>
          </div>
          <div className="text-slate-300">•</div>
          <div>
            <span className="font-medium text-slate-400 select-none">{dict.average} </span>
            <span className="font-black text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded-lg">
              {toLangDigits(averageScore, activeLang)}%
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Bottom Category Selector (Two requested icons) */}
      <div className="grid grid-cols-2 gap-3 select-none">
        {/* Icon Option 1 */}
        <button
          type="button"
          onClick={() => setActiveBottomCategory('r1')}
          className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between h-24 relative overflow-hidden active:scale-95 ${activeBottomCategory === 'r1' ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/10' : 'bg-white hover:bg-slate-50 border-slate-250 border-slate-200 text-slate-700'}`}
        >
          <div className="flex justify-between items-start w-full">
            <span className={`p-2 rounded-xl flex items-center justify-center ${activeBottomCategory === 'r1' ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
              <Zap size={18} />
            </span>
            <span className={`text-[10px] font-black uppercase tracking-wider ${activeBottomCategory === 'r1' ? 'text-indigo-200' : 'text-slate-400'}`}>
              ROUND 1
            </span>
          </div>
          <div>
            <span className="font-black text-[13px] block leading-tight">
              {dict.r1_title}
            </span>
            <span className={`text-[10px] block leading-normal mt-0.5 ${activeBottomCategory === 'r1' ? 'text-indigo-150' : 'text-slate-400 font-bold'}`}>
              {dict.r1_desc}
            </span>
          </div>
        </button>

        {/* Icon Option 2 */}
        <button
          type="button"
          onClick={() => setActiveBottomCategory('r2')}
          className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between h-24 relative overflow-hidden active:scale-95 ${activeBottomCategory === 'r2' ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/10' : 'bg-white hover:bg-slate-50 border-slate-250 border-slate-200 text-slate-700'}`}
        >
          <div className="flex justify-between items-start w-full">
            <span className={`p-2 rounded-xl flex items-center justify-center ${activeBottomCategory === 'r2' ? 'bg-white/20 text-white' : 'bg-violet-50 text-violet-600'}`}>
              <TrendingUp size={18} />
            </span>
            <span className={`text-[10px] font-black uppercase tracking-wider ${activeBottomCategory === 'r2' ? 'text-indigo-200' : 'text-slate-400'}`}>
              ROUND 2
            </span>
          </div>
          <div>
            <span className="font-black text-[13px] block leading-tight">
              {dict.r2_title}
            </span>
            <span className={`text-[10px] block leading-normal mt-0.5 ${activeBottomCategory === 'r2' ? 'text-indigo-150' : 'text-slate-400 font-bold'}`}>
              {dict.r2_desc}
            </span>
          </div>
        </button>
      </div>

      {/* 3. Render active details pane based on selection */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeBottomCategory || 'none'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-4"
        >
          {activeBottomCategory === 'r1' && (
            <div className="space-y-3">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 select-none">
                <span className="text-indigo-600 bg-indigo-50 w-7 h-7 rounded-lg flex items-center justify-center">1️⃣</span>
                <span>{dict.r1_title}</span>
              </h3>
              
              {failedSubjects.length === 0 ? (
                <p className="text-xs sm:text-sm text-emerald-600 bg-emerald-50/40 p-4.5 rounded-2xl border border-emerald-100/60 leading-relaxed font-bold">
                  {dict.r1_safe}
                </p>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500 leading-relaxed select-none">
                    {dict.r1_needs}
                  </p>
                  
                  <div className="space-y-3">
                    {failedSubjects.map((sub) => {
                      const reqImprovement = 50 - sub.score;

                      return (
                        <div key={sub.id} className="p-4 bg-slate-50/60 border border-slate-100/60 rounded-3xl flex flex-col gap-3">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-sm font-black text-slate-800">
                              {getSubjectName(sub)}
                            </span>
                            <div className="text-left font-bold text-xs flex items-center gap-1.5">
                              <span className="text-slate-400">({activeLang === 'en' ? 'Current: ' : 'نمرەی ئێستا: '} {toLangDigits(sub.score, activeLang)})</span>
                              <span className="text-indigo-650 font-black bg-indigo-50/50 border border-indigo-100/40 px-2.5 py-1 rounded-xl">
                                +{toLangDigits(reqImprovement, activeLang)} {activeLang === 'en' ? 'Marks Needed' : 'نمرە پێویستە'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeBottomCategory === 'r2' && (() => {
            const remaining5 = Math.max(0, 5 - (calculation?.helpMarksUsed5 || 0));
            return (
              <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 select-none">
                  <span className="text-violet-600 bg-violet-50 w-7 h-7 rounded-lg flex items-center justify-center">2️⃣</span>
                  <span>{dict.r2_title}</span>
                </h3>

                {failedSubjectsForR2.length === 0 ? (
                  <p className="text-xs sm:text-sm text-emerald-600 bg-emerald-50/40 p-4.5 rounded-2xl border border-emerald-100/60 leading-relaxed font-bold">
                    {dict.r2_safe}
                  </p>
                ) : (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-500 leading-relaxed select-none">
                      {dict.r2_needs}
                    </p>

                    {remaining5 > 0 && (
                      <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-2xl text-xs text-amber-900 font-bold flex items-center gap-2">
                        <span>💡</span>
                        <span>
                          {activeLang === 'kub'
                            ? `تە هێشتا ${toLangDigits(remaining5, activeLang)} نمرەیێن بڕیارێ یێن ماین کو دشێی د خولا دووێ دا بکارهینی بۆ هەر بابەتەکێ کەتن دا ب ساناهی دەرباز ببی!`
                            : activeLang === 'kus'
                            ? `تۆ هێشتا ${toLangDigits(remaining5, activeLang)} نمرەی بڕیاری ماوەتەوە کە دەتوانیت لە خولی دووەمدا بەکاریان بهێنیت بۆ بابەتە کەتنەکان تا بە ئاسانی دەرچیت!`
                            : `You still have ${toLangDigits(remaining5, activeLang)} unused decision marks that can be applied in Round 2 to help you pass!`}
                        </span>
                      </div>
                    )}

                    <div className="space-y-3">
                      {failedSubjectsForR2.map((sub) => {
                        const { s1a1, s1a2, s2a1, s2a2 } = getAssessment(sub.id);
                        const currentSum = s1a1 + s1a2 + s2a1 + s2a2;
                        
                        // Normal targets
                        const req50 = Math.max(0, 50 - currentSum);
                        const req40 = Math.max(0, 40 - currentSum);

                        // Targets with leftover decision marks applied
                        const reqWithDec50 = Math.max(0, 50 - currentSum - remaining5);
                        const reqWithDec40 = Math.max(0, 40 - currentSum - remaining5);

                        const calcSub = calculation?.subjects.find(s => s.id === sub.id);
                        const isUboorSubject = weakestSubject?.id === sub.id;
                        
                        let round2Badge = activeLang === 'en' ? 'ROUND 2 EXAM' : 'کۆنتڕۆڵی خولی دووەم';
                        if (isUboorSubject) {
                          if (activeLang === 'kub') {
                            round2Badge = 'بابەتێ عوبورێ (پێتڤی ب ٤٠ نمرەیە)';
                          } else if (activeLang === 'kus') {
                            round2Badge = 'بابەتی عوبور (پێویستی بە ٤٠ نمرەیە)';
                          } else if (activeLang === 'ar') {
                            round2Badge = 'مادة عبور (تحتاج ٤٠ كحد أدنى)';
                          } else {
                            round2Badge = 'CARRY-OVER SUBJECT (NEEDS 40 MIN)';
                          }
                        }

                        return (
                          <div key={sub.id} className={`p-4 border rounded-3xl space-y-4 ${isUboorSubject ? 'bg-indigo-50/35 border-indigo-150/40' : 'bg-slate-50/50 border-slate-150/50'}`}>
                            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                              <span className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                                {getSubjectName(sub)}
                                {isUboorSubject && <span className="animate-pulse w-2 h-2 rounded-full bg-indigo-600"></span>}
                              </span>
                              <span className={`text-[10px] font-black uppercase tracking-wider ${isUboorSubject ? 'text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg' : 'text-slate-400'}`}>
                                {round2Badge}
                              </span>
                            </div>

                            <div className="space-y-4">
                              {/* Semester 1 */}
                              <div className="space-y-2 relative">
                                <div className="absolute inset-y-0 right-0 w-1 bg-indigo-100 rounded-full" />
                                <div className="pr-3">
                                  <label className="text-xs font-black text-indigo-800 flex items-center mb-2">
                                    {dict.sem1}
                                  </label>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                      <label className="text-[10px] font-bold text-slate-500">{dict.ass1}</label>
                                      <input
                                        type="text"
                                        inputMode="decimal"
                                        value={s1a1}
                                        onChange={(e) => updateAssessment(sub.id, 's1a1', e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-black text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none transition-all"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[10px] font-bold text-slate-500">{dict.ass2}</label>
                                      <input
                                        type="text"
                                        inputMode="decimal"
                                        value={s1a2}
                                        onChange={(e) => updateAssessment(sub.id, 's1a2', e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-black text-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none transition-all"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Semester 2 */}
                              <div className="space-y-2 relative">
                                <div className="absolute inset-y-0 right-0 w-1 bg-violet-100 rounded-full" />
                                <div className="pr-3">
                                  <label className="text-xs font-black text-violet-800 flex items-center mb-2">
                                    {dict.sem2}
                                  </label>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                      <label className="text-[10px] font-bold text-slate-500">{dict.ass1}</label>
                                      <input
                                        type="text"
                                        inputMode="decimal"
                                        value={s2a1}
                                        onChange={(e) => updateAssessment(sub.id, 's2a1', e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-black text-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-200 outline-none transition-all"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[10px] font-bold text-slate-500">{dict.ass2}</label>
                                      <input
                                        type="text"
                                        inputMode="decimal"
                                        value={s2a2}
                                        onChange={(e) => updateAssessment(sub.id, 's2a2', e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-black text-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-200 outline-none transition-all"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Dynamic results calculation */}
                            <div className="pt-3 border-t border-slate-100 space-y-3 mt-4">
                              <div className="flex justify-between items-center text-xs text-slate-500 font-bold select-none">
                                <span>{dict.sum_ass}</span>
                                <span className="font-black text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">{toLangDigits(currentSum, activeLang)}</span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] sm:text-xs font-bold">
                                {/* Regular goals */}
                                <div className="p-3 bg-indigo-50/50 border border-indigo-100/40 rounded-2xl space-y-1">
                                  <span className="text-slate-500 block">
                                    {activeLang === 'kub' ? 'بۆ دەرچوونا گشتی (٥٠ نمرە):' : activeLang === 'kus' ? 'بۆ دەرچوونی گشتی (٥٠ نمرە):' : 'For general pass (50 marks):'}
                                  </span>
                                  <span className="font-black text-indigo-750 block text-sm sm:text-base">
                                    🎯 {toLangDigits(req50, activeLang)}
                                  </span>
                                </div>

                                <div className="p-3 bg-violet-50/50 border border-violet-100/40 rounded-2xl space-y-1">
                                  <span className="text-slate-500 block">
                                    {activeLang === 'kub' ? 'بۆ مانا ب عوبور (٤٠ نمرە):' : activeLang === 'kus' ? 'بۆ تێپەڕین بە عوبور (٤٠ نمرە):' : activeLang === 'ar' ? 'للبقاء بالعبور (٤٠ درجة):' : 'For passing with Carry-Over (40 marks):'}
                                  </span>
                                  <span className="font-black text-violet-750 block text-sm sm:text-base">
                                    ✨ {toLangDigits(req40, activeLang)}
                                  </span>
                                </div>

                                {/* Goals with leftover decision marks if available */}
                                {remaining5 > 0 && (
                                  <div className="col-span-1 sm:col-span-2 p-3 bg-amber-50/40 border border-amber-100/40 rounded-2xl space-y-2">
                                    <span className="text-amber-800 block text-[10px] uppercase tracking-wider font-extrabold select-none">
                                      🛡️ {activeLang === 'kub' ? `ئەگەر بڕیارا مای (${remaining5} نمرە) بهێتە بکارئینان:` : activeLang === 'kus' ? `ئەگەر بڕیاری ماوە (${remaining5} نمرە) بەکاربهێنرێت:` : `If remaining pool (${remaining5} marks) is used:`}
                                    </span>
                                    <div className="flex flex-wrap justify-between gap-2 text-[11px] sm:text-xs text-slate-700">
                                      <span className="flex items-center gap-1.5">
                                        {activeLang === 'kub' ? 'دەرچوون:' : 'دەرچوون:'} <strong className="text-indigo-650 font-black">{toLangDigits(reqWithDec50, activeLang)}</strong>
                                      </span>
                                      <span className="flex items-center gap-1.5">
                                        {activeLang === 'kub' ? 'عوبور (مەرجدار):' : 'عوبور:'} <strong className="text-violet-650 font-black">{toLangDigits(reqWithDec40, activeLang)}</strong>
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Weak subject encouraging prompt */}
                              <div className="text-[10px] text-slate-400 italic text-right mt-2">
                                {activeLang === 'kub'
                                  ? '💡 بابەتەکێ لاواز هەبیت، بگەهینە ٤٠ دا ببیە عوبور!'
                                  : activeLang === 'kus'
                                  ? '💡 ئەگەر بابەتێکی لاوازت هەیە، تەنها بیگەیەنە ٤٠ تا ببیتە عوبور!'
                                  : '💡 For weak subjects, just aim for 40 total to pass via Carry-Over (Uboor)!'}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </motion.div>
      </AnimatePresence>

      {/* Dynamic Teacher appeal helper banner (Above share action as requested) */}
      {failedSubjects.length > 0 && (() => {
        const advices = getTeacherGraceAdvice();

        let titleText = '';
        let appealIntro = '';

        if (activeLang === 'kub') {
          titleText = 'پێشنیازا دڵسۆزانە ژ مامۆستای:';
          appealIntro = `🙋‍♂️ مامۆستایێن هێژا، ئەگەر بڕیارێن فەرمی (وەک نمرێن بڕیارێ یان عوبورێ) ل سەر لاوازترین بابەتان بهێنە جێبەجێکرن، ئەڤە قوتابی تنێ پێویستی ب نمرێن پێشنیارکری هەیە ژلایێ هەوە ڤە د ڤان بابەتێن خوارێ دا دا کو ب تەمامی ناجح ببیت و نەچیتە دەورێ دووێ:`;
        } else if (activeLang === 'kus') {
          titleText = 'کەمترین پێشنیازی پێویست لە مامۆستا:';
          appealIntro = `🙋‍♂️ مامۆستایانی بەڕێز، ئەگەر بڕیارە فەرمییەکان بەکاربهێنرێن لەسەر لاوازترین بابەتەکان (وەکو نمرەی بڕیار و عوبور)، ئەوا قوتابی تەنها پێویستی بە یارمەتی مامۆستایان دەبێت لەم بابەتانەی خوارەوەدا تاوەکو بە تەواوی دەرچێت و نەچێتە خولی دووەم:`;
        } else if (activeLang === 'ar') {
          titleText = 'أقل درجة مساعدة مطلوبة من المعلم:';
          appealIntro = `🙋‍♂️ أساتذتنا الكرام، إذا تم تطبيق القرارات الرسمية على المواد الأكثر تعثراً (مثل درجات القرار والعبور)، فإن الطالب يحتاج فقط لدعمكم في المواد المتبقية المذكورة أدناه لكي ينجح بالكامل ويتجنب الدور الثاني:`;
        } else {
          titleText = 'Min Grace Marks Advice:';
          appealIntro = `🙋‍♂️ Dear Teachers, if official rules (Decision Pool and Carry-Over) are applied to the weakest subjects first, the student will only need your assistance in the following remaining subjects to pass Round 1 successfully:`;
        }

        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-gradient-to-r from-amber-50 to-orange-50/60 border border-amber-200/60 rounded-3xl shadow-sm space-y-3 text-right relative overflow-hidden text-right animate-fade-in"
          >
            {/* Soft decorative light indicator */}
            <div className="absolute top-0 right-0 left-0 h-1 bg-amber-400"></div>

            <div className={`flex items-center gap-2 font-black text-amber-900 text-xs sm:text-sm ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
              <span className="p-1 rounded-lg bg-amber-100 text-amber-700">🧑‍🏫</span>
              <span>
                {titleText}
              </span>
            </div>
            
            <div className="text-xs sm:text-sm font-black text-slate-800 leading-relaxed bg-white/70 backdrop-blur-sm p-4 rounded-2xl border border-amber-100/50 space-y-2.5">
              <p>{appealIntro}</p>
              
              <div className="border-t border-dashed border-amber-200/60 pt-2.5 space-y-2 font-bold text-[11px] sm:text-xs">
                {advices.map((sub) => {
                  const reqMarks = sub.neededFromTeacher;
                  
                  if (reqMarks > 0) {
                    const marksStr = activeLang === 'kub' 
                      ? `پێتڤی ب +${toLangDigits(reqMarks, 'kub')} نمرەیان هەیە 🧑‍🏫`
                      : activeLang === 'kus'
                        ? `پێویستی بە +${toLangDigits(reqMarks, 'kus')} نمرە هەیە 🧑‍🏫`
                        : activeLang === 'ar'
                          ? `بحاجة إلى +${toLangDigits(reqMarks, 'ar')} درجات مساعدة 🧑‍🏫`
                          : `Needs +${toLangDigits(reqMarks, 'en')} marks 🧑‍🏫`;

                    return (
                      <div key={sub.id} className="flex justify-between items-center bg-amber-500/10 hover:bg-amber-500/15 p-2.5 px-3.5 rounded-xl border border-amber-500/15 transition-colors">
                        <span className="text-slate-800 font-black text-xs sm:text-sm">{sub.name}</span>
                        <span className="bg-amber-200 text-amber-950 px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-black">{marksStr}</span>
                      </div>
                    );
                  } else {
                    // Fully solved by official decisions
                    let helpMsg = '';
                    if (sub.dMarksUsed > 0 && sub.uMarksUsed > 0) {
                      helpMsg = activeLang === 'kub' ? `ب بڕیارا گشتی (${sub.dMarksUsed}) و عوبورێ (${sub.uMarksUsed})`
                        : activeLang === 'kus' ? `بە بڕیاری گشتی (${sub.dMarksUsed}) و عوبور (${sub.uMarksUsed})`
                        : activeLang === 'ar' ? `بقرار المساعدة (${sub.dMarksUsed}) والعبور (${sub.uMarksUsed})`
                        : `via Decision (${sub.dMarksUsed}) & Carry-Over (${sub.uMarksUsed})`;
                    } else if (sub.uMarksUsed > 0) {
                      helpMsg = activeLang === 'kub' ? `ب بڕیارا عوبورێ (${sub.uMarksUsed} نمرە)`
                        : activeLang === 'kus' ? `بە بڕیاری عوبور (${sub.uMarksUsed} نمرە)`
                        : activeLang === 'ar' ? `بقرار العبور (${sub.uMarksUsed} درجات)`
                        : `via Carry-Over (${sub.uMarksUsed} marks)`;
                    } else if (sub.dMarksUsed > 0) {
                      helpMsg = activeLang === 'kub' ? `ب بڕیارا گشتی (${sub.dMarksUsed} نمرە)`
                        : activeLang === 'kus' ? `بە بڕیاری گشتی (${sub.dMarksUsed} نمرە)`
                        : activeLang === 'ar' ? `بقرار المساعدة العام (${sub.dMarksUsed} درجات)`
                        : `via Decision Pool (${sub.dMarksUsed} marks)`;
                    } else {
                      return null;
                    }

                    return (
                      <div key={sub.id} className="flex justify-between items-center bg-emerald-500/5 hover:bg-emerald-500/10 p-2.5 px-3.5 rounded-xl border border-emerald-500/10 transition-colors opacity-85">
                        <span className="text-slate-700 font-bold text-xs sm:text-sm">{sub.name}</span>
                        <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-black">✨ {helpMsg}</span>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </motion.div>
        );
      })()}

      {/* 4. Main Verdict actions */}
      <div className="flex flex-col gap-2 pt-2">
        {/* Share Result */}
        <motion.button
          whileHover={{ translateY: -1 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onShare(generateShareReport())}
          className="w-full py-4 bg-indigo-600 hover:bg-slate-900 border border-indigo-700/10 text-white text-xs sm:text-sm font-black rounded-3xl transition-all shadow-md shadow-indigo-600/5 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Share2 size={16} />
          <span>{copied ? dict.copied_msg : dict.share}</span>
        </motion.button>

        {/* Edit Subjects / Back */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onModify}
            className="py-3.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-2xl transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <ArrowLeft size={14} />
            <span>{dict.edit}</span>
          </button>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="py-3.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-2xl transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <RefreshCw size={14} />
            <span>{dict.change_lang_btn}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
