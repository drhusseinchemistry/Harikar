import { SubjectGrade, SubjectResult, CalculationResult, HelpSystemMode } from '../types';

/**
 * Calculates student academic results based on Kurdish school grace/help marks.
 */
export function calculateGrades(
  inputSubjects: SubjectGrade[],
  helpMode: HelpSystemMode = 'total_pool',
  availableDecisionMarks: number = 5
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
  })).filter(s => s.score < 50).sort((a, b) => a.score - b.score);

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
  const F = failingSubjects.length;

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

  const decisionDistributions = distributeDecisionMarks(F, availableDecisionMarks);

  const getPenalty = (gap: number) => {
    // Cubic penalty to strongly prioritize reducing larger gaps
    return Math.pow(gap, 3);
  };

  let bestAllocation: {
    decisionAlloc: number[];
    uboorIndex: number;
    uboorAmount: number;
    subjectsPassed: number;
    truePasses: number;
    totalPenalty: number;
    totalOfficialHelpUsed: number;
  } | null = null;

  for (let uIdx = -1; uIdx < F; uIdx++) {
    for (const dAlloc of decisionDistributions) {
      // Validate: Cannot allocate more decision marks than needed to pass
      let isValid = true;
      for (let i = 0; i < F; i++) {
        const need = 50 - failingSubjects[i].score;
        if (dAlloc[i] > need) {
          isValid = false;
          break;
        }
      }
      if (!isValid) continue;

      let uAmount = 0;
      if (uIdx !== -1) {
        const uSub = failingSubjects[uIdx];
        const scoreWithD = uSub.score + dAlloc[uIdx];
        
        // Eligible for Uboor only if the score after applying decision marks is at least 40
        if (scoreWithD >= 40) {
          const needAfterD = 50 - scoreWithD;
          uAmount = Math.min(10, needAfterD);
        } else {
          continue;
        }
      }

      // Calculate passed subjects and penalties
      let currentPenalty = 0;
      let officialHelpUsed = 0;
      let subjectsPassed = 0;
      let truePasses = 0;
      for (let i = 0; i < F; i++) {
        const dMarks = dAlloc[i];
        const uMarks = (i === uIdx) ? uAmount : 0;
        const finalScore = failingSubjects[i].score + dMarks + uMarks;
        if (finalScore >= 50) {
          subjectsPassed++;
          if (uMarks === 0) {
            truePasses++;
          }
        }
        const remainingGap = Math.max(0, 50 - finalScore);
        currentPenalty += getPenalty(remainingGap);
        officialHelpUsed += dMarks + uMarks;
      }

      // Uboor can ONLY be used if it results in the student passing the year.
      // If the student still fails the year, Uboor cannot be applied.
      if (subjectsPassed < F && uIdx !== -1) {
        continue;
      }

      const allocObj = {
        decisionAlloc: dAlloc,
        uboorIndex: uIdx,
        uboorAmount: uAmount,
        subjectsPassed,
        truePasses,
        totalPenalty: currentPenalty,
        totalOfficialHelpUsed: officialHelpUsed
      };

      if (bestAllocation === null) {
        bestAllocation = allocObj;
      } else {
        if (allocObj.subjectsPassed > bestAllocation.subjectsPassed) {
          bestAllocation = allocObj;
        } else if (allocObj.subjectsPassed === bestAllocation.subjectsPassed) {
          if (allocObj.truePasses > bestAllocation.truePasses) {
            bestAllocation = allocObj;
          } else if (allocObj.truePasses === bestAllocation.truePasses) {
            if (allocObj.totalPenalty < bestAllocation.totalPenalty) {
              bestAllocation = allocObj;
            } else if (
              allocObj.totalPenalty === bestAllocation.totalPenalty &&
              allocObj.totalOfficialHelpUsed > bestAllocation.totalOfficialHelpUsed
            ) {
              bestAllocation = allocObj;
            }
          }
        }
      }
    }
  }

  const help5Alloc: Record<string, number> = {};
  const help10Alloc: Record<string, number> = {};

  if (bestAllocation) {
    const { decisionAlloc, uboorIndex, uboorAmount } = bestAllocation;
    for (let i = 0; i < F; i++) {
      const sub = failingSubjects[i];
      if (decisionAlloc[i] > 0) {
        help5Alloc[sub.id] = decisionAlloc[i];
      }
      if (i === uboorIndex && uboorAmount > 0) {
        help10Alloc[sub.id] = uboorAmount;
      }
    }
  }

  // Build the subject results list
  const results: SubjectResult[] = inputSubjects.map((s) => {
    const d_val = help5Alloc[s.id] || 0;
    const u_val = help10Alloc[s.id] || 0;
    
    let helpRuleUsed: 'none' | '5_marks_rule' | '10_marks_rule' = 'none';
    let finalScore = s.score + d_val + u_val;
    let isPassed = finalScore >= 50;

    if (u_val > 0) {
      helpRuleUsed = '10_marks_rule';
    } else if (d_val > 0) {
      helpRuleUsed = '5_marks_rule';
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

  const unresolvedFailing = results.filter(s => !s.isPassed);
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

