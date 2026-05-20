export interface SubjectGrade {
  id: string;
  name: string;
  key?: string; // Optional key used for translation lookup (e.g. 'chemistry')
  score: number; // 0 - 100
}

export interface SubjectResult {
  id: string;
  name: string;
  key?: string; // Translation lookup key
  originalScore: number;
  helpMarksAdded: number; // Marks added by help rules
  helpRuleUsed: 'none' | '5_marks_rule' | '10_marks_rule';
  finalScore: number;
  isPassed: boolean;
  isUboorEligibleInRound2?: boolean; // True if this subject can pass with 40 in Round 2
}

export type HelpSystemMode = 'per_subject' | 'total_pool';

export interface CalculationResult {
  subjects: SubjectResult[];
  status: 'passed' | 'uboor' | 'failed';
  totalHelpMarksUsed: number;
  helpMarksUsed5: number;
  helpMarksUsed10: number;
  failedSubjectsCount: number;
  explanationSteps: {
    title: string;
    details: string;
    type: 'success' | 'info' | 'warning';
  }[];
}
