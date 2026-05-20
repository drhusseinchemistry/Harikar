import { SubjectGrade, SubjectResult, CalculationResult, HelpSystemMode } from '../types';

/**
 * Calculates student academic results based on Kurdish school grace/help marks.
 */
export function calculateGrades(
  inputSubjects: SubjectGrade[],
  helpMode: HelpSystemMode = 'per_subject'
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

  // Initial stats
  const initialFailed = inputSubjects.filter((s) => s.score < 50);
  const failingIndices = inputSubjects
    .map((s, idx) => ({ s, idx }))
    .filter((item) => item.s.score < 50)
    .map((item) => item.idx);

  explanationSteps.push({
    title: 'بارودۆخی سەرەتایی نمرەکان',
    details: `تۆ کۆی گشتی ${totalSubjects} بابەتت داخڵکردووە. لەمانە ${totalSubjects - initialFailed.length} بابەت سەرکەوتوو بوون (٥٠ یان زیاتر) و ${initialFailed.length} بابەت ژێر نمرەی دەرچوونن (کەمتر لە ٥٠).`,
    type: initialFailed.length === 0 ? 'success' : 'info',
  });

  if (failingIndices.length === 0) {
    return {
      subjects: inputSubjects.map((s) => ({
        id: s.id,
        name: s.name || 'بابەتی بێ ناو',
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
      explanationSteps: [
        {
          title: 'بەرئەنجام: قوتابی ناجح بوو (دەرچوو) 🎉',
          details: 'پیرۆزە! سەرجەم بابەتەکان دەرچوون بێ ئەوەی پێویستیان بە هیچ نمرەیەکی یاسایی هەبێت.',
          type: 'success',
        },
      ],
    };
  }

  // Solver for the absolute optimal allocation
  let bestIdx10 = -1;
  let bestSavedIndices: number[] = [];
  let bestDecisionAlloc: Record<number, number> = {};
  let bestUboorAlloc: Record<number, number> = {};
  let bestMetric = {
    savedCount: -1,
    decisionUsed: 999,
    savedOriginalSum: -1,
    sumScores: -1,
  };

  const getSubsetMetric = (savedSet: number[], decisionMap: Record<number, number>) => {
    const savedCount = savedSet.length;
    let decisionUsed = 0;
    for (const d of Object.values(decisionMap)) decisionUsed += d;

    let savedOriginalSum = 0;
    for (const idx of savedSet) {
      savedOriginalSum += inputSubjects[idx].score;
    }

    let sumScores = 0;
    for (let i = 0; i < totalSubjects; i++) {
      if (savedSet.includes(i)) {
        sumScores += 50;
      } else {
        sumScores += inputSubjects[i].score;
      }
    }

    return { savedCount, decisionUsed, savedOriginalSum, sumScores };
  };

  const isBetter = (a: typeof bestMetric, b: typeof bestMetric) => {
    if (a.savedCount !== b.savedCount) {
      return a.savedCount > b.savedCount;
    }
    // Prioritize saving subjects with HIGHER original scores so that
    // the ones with lower scores go to Round 2 ("کەمترین نمرەی هەیە دەرواتە دەوری دوو").
    if (a.savedOriginalSum !== b.savedOriginalSum) {
      return a.savedOriginalSum > b.savedOriginalSum;
    }
    if (a.decisionUsed !== b.decisionUsed) {
      return a.decisionUsed < b.decisionUsed; // fewer decision marks is better
    }
    return a.sumScores > b.sumScores; // higher sum scores is better
  };

  // Candidates for idx10: -1 (no Uboor is used at all) or any failing index
  const idx10Candidates = [-1, ...failingIndices];

  for (const idx10 of idx10Candidates) {
    if (helpMode === 'per_subject') {
      // 'per_subject' mode - each subject has separate up to 5 decision marks
      const savedSet: number[] = [];
      const decisionMap: Record<number, number> = {};
      const uboorMap: Record<number, number> = {};

      for (const i of failingIndices) {
        const s_i = inputSubjects[i].score;
        if (i === idx10) {
          if (s_i >= 35) {
            savedSet.push(i);
            const d_i = Math.max(0, 40 - s_i);
            decisionMap[i] = d_i;
            uboorMap[i] = 50 - s_i - d_i;
          }
        } else {
          if (s_i >= 45) {
            savedSet.push(i);
            decisionMap[i] = 50 - s_i;
            uboorMap[i] = 0;
          }
        }
      }

      // RULE: If Uboor is used (idx10 !== -1), all initially failing subjects must be saved in Round 1!
      if (idx10 !== -1 && savedSet.length < failingIndices.length) {
        continue;
      }

      const metric = getSubsetMetric(savedSet, decisionMap);
      if (isBetter(metric, bestMetric)) {
        bestMetric = metric;
        bestIdx10 = idx10;
        bestSavedIndices = savedSet;
        bestDecisionAlloc = decisionMap;
        bestUboorAlloc = uboorMap;
      }
    } else {
      // 'total_pool' mode - maximum 5 decision marks across all subjects
      // Restruction: At most ONE subject can receive decision help > 0
      // Generate subsets of failingIndices to try to save them
      const subsets: number[][] = [[]];
      for (const idx of failingIndices) {
        const len = subsets.length;
        for (let j = 0; j < len; j++) {
          subsets.push([...subsets[j], idx]);
        }
      }

      for (const S of subsets) {
        let isFeasible = true;
        const decisionMap: Record<number, number> = {};
        const uboorMap: Record<number, number> = {};
        let totalDecision = 0;
        let subjectsWithDecision = 0;

        for (const i of S) {
          const s_i = inputSubjects[i].score;
          if (i === idx10) {
            if (s_i < 35) {
              isFeasible = false;
              break;
            }
            const d_i = Math.max(0, 40 - s_i);
            decisionMap[i] = d_i;
            uboorMap[i] = 50 - s_i - d_i;
            totalDecision += d_i;
            if (d_i > 0) {
              subjectsWithDecision++;
            }
          } else {
            const d_i = 50 - s_i;
            decisionMap[i] = d_i;
            uboorMap[i] = 0;
            totalDecision += d_i;
            if (d_i > 0) {
              subjectsWithDecision++;
            }
          }
        }

        // RULE: If Uboor is used (idx10 !== -1), all initially failing subjects must be saved in Round 1!
        if (idx10 !== -1 && S.length < failingIndices.length) {
          isFeasible = false;
        }

        // Under user's constraint: At most one subject can receive decision help
        if (isFeasible && totalDecision <= 5 && subjectsWithDecision <= 1) {
          const metric = getSubsetMetric(S, decisionMap);
          if (isBetter(metric, bestMetric)) {
            bestMetric = metric;
            bestIdx10 = idx10;
            bestSavedIndices = S;
            bestDecisionAlloc = decisionMap;
            bestUboorAlloc = uboorMap;
          }
        }
      }
    }
  }

  // SPECIAL CASE: Only one failing subject and we couldn't save it because score < 35
  let singleIdx = -1;
  const hasSingleUnsavedFailingSubject = failingIndices.length === 1 && bestSavedIndices.length === 0;
  if (hasSingleUnsavedFailingSubject) {
    singleIdx = failingIndices[0];
    bestIdx10 = singleIdx;
    bestDecisionAlloc[singleIdx] = 5;
    bestUboorAlloc[singleIdx] = 10;
  }

  // Construct results
  const wasUboorUsedInRound1 = bestSavedIndices.some(idx => (bestUboorAlloc[idx] || 0) > 0);

  // Find the index of the best candidate for Uboor in Round 2 if multiple exist
  // We prefer the weakest (lowest score) unsaved subject to help it with the 40-mark Uboor threshold
  let bestRound2UboorIdx = -1;
  if (!wasUboorUsedInRound1) {
    let minUnsavedScore = 101;
    for (let i = 0; i < totalSubjects; i++) {
      if (!bestSavedIndices.includes(i)) {
        if (inputSubjects[i].score < minUnsavedScore) {
          minUnsavedScore = inputSubjects[i].score;
          bestRound2UboorIdx = i;
        }
      }
    }
  }

  const results: SubjectResult[] = inputSubjects.map((s, idx) => {
    const isSaved = bestSavedIndices.includes(idx);
    const d_val = bestDecisionAlloc[idx] || 0;
    const u_val = bestUboorAlloc[idx] || 0;
    
    // If saved, final score is boosted to 50. If unsaved but single failing subject, display s_A + 15
    const finalScore = isSaved 
      ? 50 
      : (hasSingleUnsavedFailingSubject && idx === singleIdx ? s.score + d_val + u_val : s.score);

    let ruleUsed: 'none' | '5_marks_rule' | '10_marks_rule' = 'none';
    if (d_val > 0 && u_val > 0) {
      ruleUsed = '10_marks_rule';
    } else if (u_val > 0) {
      ruleUsed = '10_marks_rule';
    } else if (d_val > 0) {
      ruleUsed = '5_marks_rule';
    }

    return {
      id: s.id,
      name: s.name || 'بابەتی بێ ناو',
      originalScore: s.score,
      helpMarksAdded: d_val + u_val,
      helpRuleUsed: ruleUsed,
      finalScore: finalScore,
      isPassed: finalScore >= 50,
      isUboorEligibleInRound2: !isSaved && !wasUboorUsedInRound1 && idx === bestRound2UboorIdx,
    };
  });

  // Calculate help used
  let helpMarksUsed5 = 0;
  let helpMarksUsed10 = 0;
  results.forEach((r, idx) => {
    helpMarksUsed5 += bestDecisionAlloc[idx] || 0;
    helpMarksUsed10 += bestUboorAlloc[idx] || 0;
  });

  // Build beautiful explanation steps
  results.forEach((r) => {
    const d = bestDecisionAlloc[inputSubjects.findIndex(s => s.id === r.id)] || 0;
    const u = bestUboorAlloc[inputSubjects.findIndex(s => s.id === r.id)] || 0;

    if (r.isPassed && (d > 0 || u > 0)) {
      if (d > 0 && u > 0) {
        explanationSteps.push({
          title: `🔥 جێبەجێکردنی هاوبەشی (بڕیار + عوبور) بۆ ${r.name}`,
          details: `نمرەی بابەتی "${r.name}" سەرەتا کەمتر بوو لە ٤٠ (${r.originalScore} نمرە)، سیستەمەکە پێداچوونەوەی مەرجەکی کرد: سەرەتا ${d} نمرەی بڕیاری بۆ دابینکر تا بگاتە ٤٠، و پاشان ${u} نمرەی عوبوری بۆ تەرخانکرا تا بگاتە ٥٠ و سەرکەوتووانە دەربچێت!`,
          type: 'success',
        });
      } else if (u > 0) {
        explanationSteps.push({
          title: `جێبەجێکردنی یاسای عوبور بۆ ${r.name}`,
          details: `بەهۆی دابینکردنی ${u} نمرەی یارمەتی خۆڕا لە ژێر ناوی عوبور (پەڕینەوە)، نمرەی "${r.name}" لە ${r.originalScore} بەرزکرایەوە بۆ ٥٠ و بە سەرکەوتوویی تێپەڕی.`,
          type: 'success',
        });
      } else if (d > 0) {
        explanationSteps.push({
          title: `جێبەجێکردنی بڕیاری ${d} پێنج نمرە بۆ ${r.name}`,
          details: `بەپێی بڕیاری فەرمی ڕێکخستنی نمرەکان، ${d} نمرەی بڕیار بەخشرا بە بابەتی "${r.name}" لە نمرەی ${r.originalScore} بۆ دەرچوون گەیشتە ٥٠.`,
          type: 'success',
        });
      }
    } else if (!r.isPassed && (d > 0 || u > 0)) {
      // Single unsaved failing subject case
      explanationSteps.push({
        title: `⚠️ یارمەتی یاسایی ناتوانێت ${r.name} دەرچوێنێت`,
        details: `بابەتی "${r.name}" بەهۆی نزمی نمرەکەیەوە (${r.originalScore})، دگەل نمرێن بڕیار و عوبور دبیتە ${r.finalScore}، بۆیە تە پێتڤی ب ${50 - r.finalScore} نمرێن دی هەبوون ل خولا ئێکێ دا ناجح بی.`,
        type: 'warning',
      });
    }
  });

  // Determine final status
  const finalFailing = results.filter((s) => !s.isPassed);
  const status = finalFailing.length === 0 ? 'passed' : 'failed';

  if (status === 'passed') {
    explanationSteps.push({
      title: 'بەرئەنجام: قوتابی ناجح بوو (دەرچوو) 🎉',
      details: 'پیرۆزە! قوتابی توانی بە یارمەتی نمرە فەرمییەکان، سەرجەم بابەتەکانی تێپەڕێنێت و بە سەرکەوتوویی بوو بە ناجح.',
      type: 'success',
    });
  } else {
    explanationSteps.push({
      title: 'بەرئەنجام: قوتابی دەرنەچوو (دەمێنێتەوە لە پۆلی خۆیدا) ⚠️',
      details: `سیستەمی قوتابخانەکان: ئەگەر قوتابی ل تەنانەت یەک بابەت دەرنەچوو بێت دوای زیادکردنی بڕیاری هاوکاری، دەکەوێت و دەمێنێتەوە ل پۆلى خۆیدا (ڕاسیب). بابەتە کەتنەکان: ${finalFailing
        .map((f) => `${f.name} (نمرەی کۆتایی: ${f.finalScore})`)
        .join('، ')}.`,
      type: 'warning',
    });
  }

  return {
    subjects: results,
    status,
    totalHelpMarksUsed: helpMarksUsed5 + helpMarksUsed10,
    helpMarksUsed5,
    helpMarksUsed10,
    failedSubjectsCount: finalFailing.length,
    explanationSteps,
  };
}
