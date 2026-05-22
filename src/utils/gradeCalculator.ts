import { SubjectGrade, SubjectResult, CalculationResult, HelpSystemMode } from '../types';

/**
 * Calculates student academic results based on Kurdish school grace/help marks.
 */
export function calculateGrades(
  inputSubjects: SubjectGrade[],
  helpMode: HelpSystemMode = 'total_pool'
): CalculationResult {
  const explanationSteps: CalculationResult['explanationSteps'] = [];

  const totalSubjects = inputSubjects.length;
  if (totalSubjects === 0) {
    return {
      subjects: [],
      status: 'failed',
      totalHelpMarksUsed: 0,
      helpMarksUsed5: 0,
      helpMarksUsed10: 0,
      failedSubjectsCount: 0,
      explanationSteps: [
        {
          title: 'هیچ بابەتێک نییە',
          details: 'تکایە سەرەتا چەند بابەتێک و نمرەکانیان داخڵ بکە.',
          type: 'warning',
        },
      ],
    };
  }

  // 1. Find all failing subjects (score < 50)
  const failingSubjects = inputSubjects.map((s, idx) => ({
    id: s.id,
    name: s.name || 'بابەتی بێ ناو',
    key: s.key,
    score: s.score,
    idx
  })).filter(s => s.score < 50);

  if (failingSubjects.length === 0) {
    explanationSteps.push({
      title: 'بەرئەنجام: قوتابی ناجح بوو (دەرچوو) 🎉',
      details: 'پیرۆزە! سەرجەم بابەتەکان دەرچوون بێ ئەوەی پێویستیان بە هیچ نمرەیەکی یاسایی هەبێت.',
      type: 'success',
    });

    return {
      subjects: inputSubjects.map((s) => ({
        id: s.id,
        name: s.name || 'بابەتی بێ ناو',
        key: s.key,
        originalScore: s.score,
        helpMarksAdded: 0,
        helpRuleUsed: 'none',
        finalScore: s.score,
        isPassed: true,
      })),
      status: 'passed',
      totalHelpMarksUsed: 0,
      helpMarksUsed5: 0,
      helpMarksUsed10: 0,
      failedSubjectsCount: 0,
      explanationSteps,
    };
  }

  // We have a 5-mark general decision pool
  let remaining5Pool = 5;
  const help5Alloc: Record<string, number> = {}; // id -> marks added from 5 pool
  const help10Alloc: Record<string, number> = {}; // id -> marks added from 10 pool (Uboor)

  // Sort failing subjects by score descending (closest to 50 first) to prioritize the 5-mark pool
  const sortedFailing = [...failingSubjects].sort((a, b) => b.score - a.score);

  // Apply 5-mark pool greedily to subjects that can be completely saved (reach 50)
  for (const s of sortedFailing) {
    const need = 50 - s.score;
    if (need <= remaining5Pool) {
      help5Alloc[s.id] = need;
      remaining5Pool -= need;
    }
  }

  // For any remaining failing subjects, see if we can apply the 10-mark Uboor rule.
  // The Uboor rule can be applied to at most 1 subject whose score is between 40 and 49 (needing <= 10 marks).
  // We prioritize the subject closest to 50 for the Uboor rule to maximize passing rate.
  const activeFailing = failingSubjects.filter(s => !help5Alloc[s.id]);
  const sortedRemainingFailing = [...activeFailing].sort((a, b) => b.score - a.score);

  if (sortedRemainingFailing.length > 0) {
    const candidate = sortedRemainingFailing[0];
    const need = 50 - candidate.score;
    if (need <= 10 && candidate.score >= 40) {
      help10Alloc[candidate.id] = need;
    }
  }

  // Build the subject results list
  const results: SubjectResult[] = inputSubjects.map((s) => {
    const d_val = help5Alloc[s.id] || 0;
    const u_val = help10Alloc[s.id] || 0;
    
    let helpRuleUsed: 'none' | '5_marks_rule' | '10_marks_rule' = 'none';
    let finalScore = s.score;
    let isPassed = s.score >= 50;

    if (d_val > 0) {
      helpRuleUsed = '5_marks_rule';
      finalScore = s.score + d_val; // 50
      isPassed = true;
    } else if (u_val > 0) {
      helpRuleUsed = '10_marks_rule';
      finalScore = s.score + u_val; // 50 (Uboor helped)
      isPassed = true;
    }

    return {
      id: s.id,
      name: s.name || 'بابەتی بێ ناو',
      key: s.key,
      originalScore: s.score,
      helpMarksAdded: d_val + u_val,
      helpRuleUsed,
      finalScore,
      isPassed,
    };
  });

  const unresolvedFailing = results.filter(s => !s.isPassed || s.helpRuleUsed === 'none' && s.originalScore < 50);
  const uboorCount = results.filter(s => s.helpRuleUsed === '10_marks_rule').length;

  let status: 'passed' | 'uboor' | 'failed' = 'passed';
  if (unresolvedFailing.length > 0) {
    status = 'failed';
  } else if (uboorCount > 0) {
    status = 'uboor';
  }

  // Build beautiful explanation steps
  explanationSteps.push({
    title: 'بارودۆخی سەرەتایی بابەتەکان',
    details: `تۆ کۆی گشتی ${totalSubjects} بابەتت دیاریکردووە. لەمانە ${totalSubjects - failingSubjects.length} بابەت سەرکەوتوو بوون (٥٠ نمرە یان زیاتر) و ${failingSubjects.length} بابەت ژێر نمرەی دەرچوونن کە پێویستە چارەسەر ببن.`,
    type: failingSubjects.length === 0 ? 'success' : 'info',
  });

  // Describe help applied
  results.forEach((r) => {
    if (r.helpMarksAdded > 0) {
      if (r.helpRuleUsed === '10_marks_rule') {
        explanationSteps.push({
          title: `💎 جێبەجێکردنی بڕیاری ١٠ نمرەی عوبور بۆ ${r.name}`,
          details: `بابەتی "${r.name}" بەهۆی ئەوەی کە نمرەکەی ٤٠ یان زیاتر بوو (${r.originalScore} نمرە)، بڕیاری ١٠ نمرەی یاسایی عوبوری بۆ جێبەجێ کرا. بە کۆمکرنا نمرێن پێویست گەیشتە ٥٠ و وەک عوبور تۆمارکرا بۆ دەورێ دووێ.`,
          type: 'success',
        });
      } else if (r.helpRuleUsed === '5_marks_rule') {
        explanationSteps.push({
          title: `✨ جێبەجێکردنی بڕیاری پێنج نمرە بۆ ${r.name}`,
          details: `بابەتی "${r.name}" بە بەکارهێنانی ${r.helpMarksAdded} نمرە لە کۆی ٥ نمرەکەی بڕیاری گشتی، نمرەکەی لە ${r.originalScore} بەرزبووەوە بۆ ٥٠ و سەرکەوتووانە بە تەواوی تێپەڕی کو ناچێتە خولی دووەم.`,
          type: 'success',
        });
      }
    }
  });

  if (status === 'passed') {
    explanationSteps.push({
      title: 'بەرئەنجام: قوتابی بە تەواوی دەرچوو 🎉',
      details: 'پیرۆزە! قوتابی بە هاوکاری بڕیاری پێنج نمرە توانی سەرجەم بابەتەکانی تێپەڕێنێت و هیچ بابەتێکی نەچووە خولی دووەم.',
      type: 'success',
    });
  } else if (status === 'uboor') {
    explanationSteps.push({
      title: 'بەرئەنجام: قوتابی بە عوبور (مەرجدار) سەرکەوت بۆ قۆناغی نوێ 🔵',
      details: 'پیرۆزە! قوتابی بە هاوکاری یەک بابەتی عوبور سەرکەوت بۆ قۆناغی داهاتوو، بەڵام پێویستە تاقیکردنەوەی خولی دووەم بۆ بابەتی عوبورەکە ئەنجام بدات.',
      type: 'success',
    });
  } else {
    explanationSteps.push({
      title: 'بەرئەنجام: قوتابی پێویستی بە خولی دووەمە ⚠️',
      details: `بەپێی بڕیاردانی فەرمی وەزارەت، بەهۆی دەرنەچوون و مانەوەی بابەتە لاوازەکان، قوتابی پێویستی بە خولی دووەم هەیە بۆ بابەتە کەتنەکان.`,
      type: 'warning',
    });
  }

  const helpMarksUsed5 = results.filter(r => r.helpRuleUsed === '5_marks_rule').reduce((sum, r) => sum + r.helpMarksAdded, 0);
  const helpMarksUsed10 = results.filter(r => r.helpRuleUsed === '10_marks_rule').reduce((sum, r) => sum + r.helpMarksAdded, 0);

  const totalFailed = results.filter((s) => !s.isPassed || s.helpRuleUsed === '10_marks_rule').length;

  return {
    subjects: results,
    status,
    totalHelpMarksUsed: helpMarksUsed5 + helpMarksUsed10,
    helpMarksUsed5,
    helpMarksUsed10,
    failedSubjectsCount: totalFailed,
    explanationSteps,
  };
}

