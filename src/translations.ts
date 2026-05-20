export type Lang = 'kus' | 'kub' | 'ar' | 'en';

export const SUBJECT_TRANSLATIONS: Record<string, Record<Lang, string>> = {
  chemistry: {
    kus: 'کیمیا',
    kub: 'کیمیا',
    ar: 'كيمياء',
    en: 'Chemistry'
  },
  physics: {
    kus: 'فیزیا',
    kub: 'فیزیا',
    ar: 'فيزياء',
    en: 'Physics'
  },
  math: {
    kus: 'بیرکاری',
    kub: 'بیرکاری',
    ar: 'رياضيات',
    en: 'Mathematics'
  },
  biology: {
    kus: 'زیندەوەر',
    kub: 'زیندەوەر',
    ar: 'أحياء',
    en: 'Biology'
  },
  computer: {
    kus: 'کۆمپیوتەر',
    kub: 'کۆمپیوتەر',
    ar: 'حاسوب',
    en: 'Computer Science'
  },
  genocide: {
    kus: 'جینۆساید',
    kub: 'جینۆساید',
    ar: 'إبادة جماعية',
    en: 'Genocide'
  },
  human_rights: {
    kus: 'مافەکانی مرۆڤ',
    kub: 'مافێن مرۆڤی',
    ar: 'حقوق الإنسان',
    en: 'Human Rights'
  },
  sports: {
    kus: 'وەرزش',
    kub: 'وەرزش',
    ar: 'رياضة',
    en: 'Sports'
  },
  art: {
    kus: 'هونەر',
    kub: 'هونەر',
    ar: 'فنية',
    en: 'Art'
  },
  english: {
    kus: 'ئینگلیزی',
    kub: 'ئینگلیزی',
    ar: 'إنكليزي',
    en: 'English'
  },
  arabic: {
    kus: 'عەرەبی',
    kub: 'عەرەبی',
    ar: 'عربي',
    en: 'Arabic'
  },
  kurdish: {
    kus: 'کوردی',
    kub: 'کوردی',
    ar: 'كردي',
    en: 'Kurdish'
  },
  religion: {
    kus: 'ئایین',
    kub: 'ئایین',
    ar: 'تربية إسلامية',
    en: 'Religion'
  },
  social: {
    kus: 'کۆمەڵایەتی',
    kub: 'جڤاکی',
    ar: 'اجتماعيات',
    en: 'Social Studies'
  },
  science: {
    kus: 'زانست',
    kub: 'زانست',
    ar: 'علوم',
    en: 'Science'
  },
  skills: {
    kus: 'کارامەیی',
    kub: 'کارامەیی',
    ar: 'مهارات الحیاة',
    en: 'Life Skills'
  }
};

export const STAGES: Record<string, Record<Lang, string>> = {
  '4th': {
    kus: 'پۆلی چوارەم',
    kub: 'پۆلا چوارێ',
    ar: 'الصف الرابع الابتدائي',
    en: '4th Grade'
  },
  '5th': {
    kus: 'پۆلی پێنجەم',
    kub: 'پۆلا پێنجێ',
    ar: 'الصف الخامس الابتدائي',
    en: '5th Grade'
  },
  '6th': {
    kus: 'پۆلی شەشەم',
    kub: 'پۆلا شەشێ',
    ar: 'الصف السادس الابتدائي',
    en: '6th Grade'
  },
  '7th': {
    kus: 'پۆلی حەفتەم',
    kub: 'پۆلا حەفتێ',
    ar: 'الصف السابع الأساسي',
    en: '7th Grade'
  },
  '8th': {
    kus: 'پۆلی هەشتەم',
    kub: 'پۆلا هەشتێ',
    ar: 'الصف الثامن الأساسي',
    en: '8th Grade'
  },
  '10th': {
    kus: 'پۆلی دەیەم',
    kub: 'پۆلا دەهێ',
    ar: 'الصف العاشر الإعدادي',
    en: '10th Grade'
  },
  '11th': {
    kus: 'پۆلی یازدەیەم',
    kub: 'پۆلا یازدێ',
    ar: 'الصف الحادي عشر الإعدادي',
    en: '11th Grade'
  }
};

export const toLangDigits = (val: number | string, lang: Lang): string => {
  if (lang === 'en') return String(val);
  const digits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(val).replace(/[0-9]/g, (w) => digits[parseInt(w, 10)]);
};

export const LOCALE: Record<string, Record<Lang, string>> = {
  title: {
    kus: 'ڕێساکانی تێپەڕبوون و بڕیاری عوبور',
    kub: 'ڕێساکێن تێپەڕبوون و بریارێن عوبورێ',
    ar: 'قواعد النجاح وقرار العبور والترقية',
    en: 'Grades & Uboor Calculator'
  },
  subtitle: {
    kus: 'ڕێساکانی تێپەڕبوون و بڕیاری عوبور لە قوتابخانەکانی کوردستان',
    kub: 'ڕێساکێن لێبوورین و تێپەڕبوونێ ل قوتابخانەیێن کوردستانێ',
    ar: 'النظام الرسمي لاحتساب درجات وقرار العبور في مدارس كردستان',
    en: 'Official Kurdistan school grading, grace marks, and carry-over calculator'
  },
  system_description: {
    kus: 'سیستەمی فەرمی پەروەردەی هەرێم: نمرەی ٣٥ بە یارمەتی ٥ نمرەی بڕیار دەبێتە ٤٠ و بە ١٠ نمرەی عوبور دەگۆڕێت بۆ ٥٠.',
    kub: 'سیستەمێ فەرمیێ پەروەردێ: نمرەیا ٣٥ ب هاریکاریا ٥ نمرێن بریاری دبیتە ٤٠ و ب ١٠ نمرێن عوبورێ دهێتە گوهرین بۆ ٥٠.',
    ar: 'نظام التعليم الرسمي للإقليم: الحصول على درجة ٣٥ بمساعدة ٥ درجات قرار تصبح ٤٠، وبإضافة ١٠ درجات عبور تصبح ٥٠ للنجاح.',
    en: 'Official Kurdish educational protocol: Grade 35 with 5 decision marks becomes 40, and with 10 carry-over marks becomes 50 for a passing status.'
  },
  school_system_badge: {
    kus: 'سیستەمی قوتابخانەکان',
    kub: 'سیستەمێ قوتابخانان',
    ar: 'نظام المدارس الكردية',
    en: 'Kurdish School System'
  },
  official_indicator: {
    kus: 'سیستەمی فەرمی ئەژمارکردنی ئەنجامی خوێندن',
    kub: 'سیستەمێ فەرمیێ ئەژمارکرنا ئەنجامێن خاندنێ',
    ar: 'النظام الرسمي لاحتساب وتدقيق نتائج الطلاب',
    en: 'Official Academic Results Evaluation System'
  },
  year_indicator: {
    kus: 'کاتی مێژوویی: ٢٠٢٦',
    kub: 'دەمێ مێژوویی: ٢٠٢٦',
    ar: 'السنة الدراسية: ٢٠٢٦',
    en: 'Academic Year: 2026'
  },
  last_updated: {
    kus: 'کۆتایی چاککردنەوە: ٢٠٢٦-٠٥-٢٠',
    kub: 'دوماهی نووکرن کاتی: ٢٠٢٦-٠٥-٢٠',
    ar: 'تاريخ التحديث: ٢٠٢٦/٠٥/٢٠',
    en: 'Last Updated: 2026-05-20'
  },
  tab_calculator: {
    kus: 'ئەژمێریاری نمرەکان',
    kub: 'ئەژمارکارێ نمران',
    ar: 'حاسبة الدرجات',
    en: 'Grades Calculator'
  },
  tab_rules: {
    kus: 'شیکردنەوەی یاساکان',
    kub: 'شلوڤەکرنا یاسایان',
    ar: 'شرح القوانين والقرارات',
    en: 'Regulations Guide'
  },
  preset_title: {
    kus: 'تاقیکردنەوەی حالەتە پێشوەختەکان (Select Presets)',
    kub: 'تاقیکرنا بابەتێن ل بەر دەست (Presets)',
    ar: 'اختبار الحالات ومستويات الطلاب (تحديد المسبق)',
    en: 'Try Sample Student Profiles (Presets)'
  },
  preset_desc: {
    kus: 'بە کلیک لەسەر هەر قوتابییەک ببینە چۆن بڕیاری ٥ نمرە و ١٠ نمرەی بابەتەکان ئەنجامی دەرچوونیان دەگۆڕێت:',
    kub: 'ب کلیک د سەر هەر قوتابیەکێ دا ببینە کا بریارا ٥ نمران و ١٠ نمرێن عوبورێ چەوا بابەتان دگەهینیتە دەرچوونێ:',
    ar: 'اضغط على أي من نماذج الطلاب أدناه لترى كيف تؤثر قرارات الـ ٥ درجات والـ ١٠ درجات على حالتهم الدراسية:',
    en: 'Click on any template below to witness how the 5-mark decision and 10-mark carry-over adjust their academic status:'
  },
  preset_pass_title: {
    kus: '🏆 ناجح بە تەواوی',
    kub: '🏆 سەرکەفتی ب دەستکەفتەکا باش',
    ar: '🏆 ناجح تماماً بالكامل',
    en: '🏆 Excellent Pass (No Help Needed)'
  },
  preset_pass_desc: {
    kus: 'قوتابییەکی پۆلی گشتی کە سەرجەم بابەتەکانی بەبێ یارمەتی نمرە دەرچووە.',
    kub: 'قوتابیەکێ کۆ گشتی بابەتێن وی بێی چ هاریکاریێن فرە تێپەڕ بووین.',
    ar: 'طالب في الصف العام اجتاز جميع المواد الدراسية دون الحاجة لأي درجات مساعدة.',
    en: 'A standard grade student who passed all school subjects successfully without any legal help.'
  },
  preset_uboor_title: {
    kus: '⚡ ڕزگاربوو بە (٥ بڕیار + ١٠ مەرجی عوبور)',
    kub: '⚡ پاراستی ب (٥ بریار + ١٠ مەرجێن عوبورێ)',
    ar: '⚡ ناجح بمساعدة (٥ قرار + ١٠ بعبور مروط)',
    en: '⚡ Saved by (5 Grace + 10 Carry-over)'
  },
  preset_uboor_desc: {
    kus: 'قوتابییەک یەک بابەتی ٣٥ ھەیە دەرئەچێت چونکە ٥ نمرەی فەرمی و ١٠ نمرەی عوبور دەبێتە ٥٠.',
    kub: 'قوتابیەک کۆ ئێک بابەتێ وی ٣٥ نمرە یە، ب هاریکاریا ٥ فەرمی و ١٠ نمرێن عوبورێ دبیتە ٥٠.',
    ar: 'طالب لديه مادة واحدة بدرجة ٣٥ ينجح لأن إضافة ٥ درجات قرار و١٠ درجات عبور توصله لـ ٥٠.',
    en: 'A student who has one subject score of 35 and passes because 5 grace marks and 10 carry-over marks make it 50.'
  },
  preset_single_uboor_title: {
    kus: '💫 پێدانی ١٠ نمرەی عوبوری بابەتێکی زیادە',
    kub: '💫 مەرجدارکرن ب ١٠ نمرێن عوبورا بابەتەکێ ب تنێ',
    ar: '💫 حماية تامة بمساعد ١٠ درجات عبور',
    en: '💫 Saved by 10 Carry-over Marks'
  },
  preset_single_uboor_desc: {
    kus: 'قوتابییەک کە بابەتێکی لە ٤٠ نمرەیە و تەنها بە بڕیاری ١٠ نمرەی عوبور سەرکەوتوو دەبێت.',
    kub: 'قوتابیەکە کۆ بابەتەکێ وی ٤٠ نمرە هەیە و ب تنێ ب پشت بەستن ب نمرەیا ١٠ عوبورێ هاتیە قورتالکرن.',
    ar: 'طالب لديه مادة واحدة بدرجة ٤٠ ويجتازها بمساعدة ١٠ درجات عبور كاملة للتمرير.',
    en: 'A student who is sitting on a score of 40 in one subject and passes it solely with the 10 carry-over marks.'
  },
  student_info_title: {
    kus: 'زانیاری سەرەتایی قوتابی (Student General Info)',
    kub: 'پێزانینێن ل سەر قوتابی خو هەڤال',
    ar: 'بيانات الطالب العامة ومرحلته الدراسية',
    en: 'Student Information & Grade Level'
  },
  student_name_lbl: {
    kus: 'ناوی قوتابی (ئارەزوومەندانە)',
    kub: 'ناڤێ قوتابی (ژ بژاردەیا تە)',
    ar: 'اسم الطالب (اختياري)',
    en: 'Student Name (Optional)'
  },
  student_name_placeholder: {
    kus: 'بۆ نموونە: دیار ئاسۆ حەسەن',
    kub: 'نموونە: دلاوەر عەلی جەمیل',
    ar: 'مثال: يوسف أحمد علي',
    en: 'e.g. Diyar Aso Hassan'
  },
  student_level_lbl: {
    kus: 'پۆلی خوێندن / قۆناغ (Grade)',
    kub: 'پۆلا قوتابخانێ / قۆناغ',
    ar: 'الصف الدراسي / المرحلة الدراسية',
    en: 'Grade Level'
  },
  subject_grades_title: {
    kus: 'نمرەکانی هەموو بابەتەکان (Subject Grades)',
    kub: 'نمرێن بابەتێن خاندنێ',
    ar: 'درجات ومعدلات المواد الدراسية',
    en: 'Subject Grades'
  },
  subject_grades_desc: {
    kus: 'نمرەی دروستی بابەتەکان لەنێوان (٠ تا ١٠٠) بنووسە. بە بەکارهێنانی دوگمە خێراکان دەتوانیت نمرە هەستیارەکان ڕێکبخەیت.',
    kub: 'نمرەیێن دروستێن بابەتان بنویسە ل سەر باری (٠ تا ١٠٠). ب دوکمێن خێرا دشێی نمرێن دیارکری کۆنتڕۆل بکەی.',
    ar: 'أدخل درجات المواد الدراسية بين (٠ و١٠٠). يمكنك الاستعانة بالأزرار السريعة لتجربة درجات معينة وحالات المساعدة.',
    en: 'Enter grades for each subject from 0 to 100. Use quick assessment shortcuts to set critical threshold points.'
  },
  add_subject_btn: {
    kus: 'بابەتی تر زیاد بکە',
    kub: 'بابەتەکێ دی زێدە بکە',
    ar: 'إضافة مادة دراسية أخرى',
    en: 'Add Custom Subject'
  },
  clear_all_btn: {
    kus: 'سڕینەوەی هەموو',
    kub: 'پاقژکرنا هەمی بابەتان',
    ar: 'مسح جميع المواد',
    en: 'Clear All Subjects'
  },
  empty_list_title: {
    kus: 'لیستی بابەتەکان بەتاڵە',
    kub: 'لیستا بابەتێن تە خالی یە',
    ar: 'قائمة المواد الدراسية فارغة حالياً',
    en: 'The subject list is empty'
  },
  empty_list_desc: {
    kus: 'هیچ بابەتێک زیاد نەکراوە بۆ ئەژمارکردنی ئەنجام. تکایە بابەتێک زیاد بکە یان یەکێک لە قوتابییە نموونەکانی سەرەوە هەڵبژێرە.',
    kub: 'چ بابەت نەهاتینە زێدەکرن بۆ ئەژمارکرنێ. هیڤیە بابەتەکی نوو داخیل بکەی یان ژی قوتابیەکێ نموونە هەلبژیری ل سەر دەستێ چەپێ.',
    ar: 'لم تقم بإضافة أي مواد دراسية لاحتساب النتيجة بعد. الرجاء إضافة مادة أو تحديد أحد النماذج الجاهزة أعلاه.',
    en: 'No subjects have been created yet. Please add a new subject or select one of the pre-defined student profiles above.'
  },
  empty_add_first: {
    kus: 'زیادکردنی یەکەم بابەت',
    kub: 'زێدەکرنا جارا ئێکێ بابەتان',
    ar: 'إضافة أول مادة دراسية',
    en: 'Add Your First Subject'
  },
  placeholder_subject_name: {
    kus: 'ناوی بابەت',
    kub: 'ناڤێ بەشێ خاندنێ',
    ar: 'اسم المادة الدراسية',
    en: 'Subject Name'
  },
  badge_score: {
    kus: 'نمرە',
    kub: 'نمرە',
    ar: 'الدرجة',
    en: 'Score'
  },
  status_passed: {
    kus: 'دەرچوو',
    kub: 'ناجح (دەربازبوو)',
    ar: 'ناجح',
    en: 'Passed'
  },
  status_passed_help: {
    kus: 'دەرچوو بە یارمەتی',
    kub: 'دەربازبوو ب بڕیار',
    ar: 'ناجح بمساعدة قرار',
    en: 'Passed with Help'
  },
  status_failed: {
    kus: 'دەرنەچوو',
    kub: 'دەرنەکەفت (کەفتی)',
    ar: 'راسب / لم يجتز',
    en: 'Failed (Re-sit)'
  },
  tooltip_delete: {
    kus: 'سڕینەوەی بابەت',
    kub: 'ژێبرنا ڤی بابەتی',
    ar: 'مسح هذه المادة',
    en: 'Delete Subject'
  },
  passed_joint_help: {
    kus: 'دەرچوو بە بڕیار و عوبور!',
    kub: 'قورتالبوو ب بریار و عوبورێ!',
    ar: 'اجتاز بنجاح من خلال القرار والعبور معاً!',
    en: 'Passed using Grace & Carry-over!'
  },
  passed_decision_only: {
    kus: 'دەرچوو بە بڕیار!',
    kub: 'سەرکەفت ب رێکا بڕیارا وەزارەتێ!',
    ar: 'اجتاز المادة بالقرار الرسمي بنجاح!',
    en: 'Passed via Ministry Grace Decision!'
  },
  initial_score_was: {
    kus: 'نمرەی سەرەتایی',
    kub: 'نمرەیا سەرەکی یا دەسپێکێ',
    ar: 'الدرجة الأولية كانت',
    en: 'Initial raw score was'
  },
  with_additional_marks: {
    kus: 'دگەل نمرێن یارمەتی گەیشتە ٥٠ و ڕاستەوخۆ دەردەچێت.',
    kub: 'دگەل نمرێن بهشینێ گەهشتە ٥٠ و دەرباز د بیت.',
    ar: 'مع درجات المساعدة تصبح ٥٠ وتجتاز المادة مباشرة.',
    en: 'with helper marks reaches 50 and achieves a successful pass.'
  },
  r1_title_single_fail: {
    kus: 'دەورێ ئێکێ:',
    kub: 'تاقیکرنا خولا ئێکێ:',
    ar: 'الدور الأول وقصور المساعدة:',
    en: 'Round 1 Assessment Output:'
  },
  r1_single_fail_text_1: {
    kus: 'دگەل نمرێن بڕیار و عوبور دبیتە',
    kub: 'کۆ لگەل پێک بڕیاران و عوبورا مەرجدار دگەهیتە',
    ar: 'حتى مع درجات القرار والعبور تصل درجتك إلى',
    en: 'even with grace/carry-over it sum up to'
  },
  r1_single_fail_text_2: {
    kus: 'تە پێتڤی ب بڕێکی تر نمرە هەبوو ل خولا ئێکێ دا ناجح بی.',
    kub: 'تە فالتە پێ پێن نمرێن دی پێویست د بوون ل خولا ئێکێ هەتا ناجح بییی.',
    ar: 'لقد كنت بحاجة للمزيد من الدرجات للتجاوز التام في الدور الأول.',
    en: 'which is short. You needed more marks in Round 1 to achieve success.'
  },
  r1_notice_prefix: {
    kus: 'تێبینی خولی یەکەم (ڕێگری لە دەوری دووەم):',
    kub: 'پێزانینا خولا ئێکێ (ڕێگریکرن ژ خولا دووەم):',
    ar: 'تنبيه الدور الأول (لتلافي الذهاب إلى الدور الثاني):',
    en: 'Round 1 Insight (To prevent going to Round 2):'
  },
  failed_multi_warning: {
    kus: 'دەرنەچووی: نمرەی ئەڤ بابەتە کەمترە لە ٥٠ و پێتڤیە نمرێن عوبورێ تنێ بۆ ئێک بابەت حسێب بکەی و بابەتێ دی دەتنەچووی بیت.',
    kub: 'دەرنەچووی: نمرەیا ڤی بابەتی ژ ٥٠ کێمترە، و یاسایا عوبورێ بتنێ بۆ ئێک بابەت دهێتە ئەژمارکرن، بابەتێ دی دی یێ کەفتی بیت.',
    ar: 'لم يجتز: درجة هذه المادة أقل من ٥٠، وحيث أن العبور مسموح لمادة واحدة فقط، تعتبر المواد الأخرى معيدة ومستمرة للإعادة.',
    en: 'Failed: The score is under 50. Since the carry-over rule can only save at most one subject, secondary failed subjects remain as Re-sit.'
  },
  badge_exempt: {
    kus: 'ڕزگاربوو بە بەخشین ✨',
    kub: 'قورتالبوو ب مەرجێ لێبۆرینێ ✨',
    ar: 'معفى بقرار المساعدة ✨',
    en: 'Exempted via Help Rules ✨'
  },
  badge_prepare_r2: {
    kus: 'ئامادەکاری بۆ دەورێ دووێ 🔄',
    kub: 'رێکخستن بۆ دەورێ دووەم 🔄',
    ar: 'التحويل للدور الثاني 🔄',
    en: 'Prepare for Round 2 🔄'
  },
  r2_assessment_header: {
    kus: 'داخستنی هەردوو نمرەی هەڵسەنگاندنێ (Assessment) - هەر یەک ١٠ نمرە:',
    kub: 'نمرێن هەڵسەنگاندنا بەردەوام (عەمەلی) - هەر یەک ژ ١٠:',
    ar: 'رصد درجتي التقييم الصفي (لكل درجة ١٠ كحد أقصى):',
    en: 'Continuous Class Assessment (Evaluation) - 10 marks per term (Total 20):'
  },
  r2_ass_1: {
    kus: 'هەڵسەنگاندنا ١یەم (١٠ نمرە)',
    kub: 'هەڵسەنگاندنا ئێکێ (١٠ نمرە)',
    ar: 'التقييم المستمر الأول (من ١٠)',
    en: '1st Assessment (Max 10)'
  },
  r2_ass_2: {
    kus: 'هەڵسەنگاندنا ٢یەم (١٠ نمرە)',
    kub: 'هەڵسەنگاندنا دووێ (١٠ نمرە)',
    ar: 'التقييم المستمر الثاني (من ١٠)',
    en: '2nd Assessment (Max 10)'
  },
  r2_total_ass: {
    kus: 'کۆی گشتی ٢٠ نمرەی هەڵسەنگاندن گەیشتە:',
    kub: 'کۆمکرنا هەردوو هەڵسەنگاندنان ژ کۆی ٢٠ گەهشتە:',
    ar: 'مجموع درجتي التقييم المستمر من ٢٠:',
    en: 'Class assessment total from 20 marks:'
  },
  r2_uboor_eligible_desc: {
    kus: 'لەبەر ئەوەی یاسای عوبور هەیە، لێرە تەنها پێویستە نمرەی گشتیت بگاتە ٤٠ بۆ ئەوەی بە دەرچوو ئەژمار بکرێت!',
    kub: 'ژ بەر کو یاسایا عوبورێ هەیە، ل ڤێرە بتنێ گەرەکە نمرەیا تە یا گشتی بگەهیتە ٤٠ دا وەک دەربازبوویێ عوبور حسێب بیت!',
    ar: 'ملاحظة: تتاح لك فرصة العبور لهذه المادة، وبالتالي تحتاج فقط درجة إجمالية ٤٠ لاجتيازها بعبور مبرر!',
    en: 'In light of carry-over privileges, your overall target score is and remains 40 to move to the next grade successfully!'
  },
  r2_multi_fail_notice: {
    kus: 'سەرنج: بەهۆی ئەوەی کە چەند بابەت کەوتوون بۆ خولی دووەم، تەنها ئەم بابەتەیان بە یاسای عوبور (نمرەی ٤٠) دەردەچێت. بابەتی تر پێویستە بگاتە ٥٠!',
    kub: 'تێبینی: ژ بەر هندێ کو پتر ژ بابەتەکێ کەفتینە خولا دووێ، بتنێ ئەڤ بابەتە دشێت سوودمەند بیت ژ نمرەیا ٤٠ (عوبور). بابەتێ دی پێتڤی یە بگەهیتە ٥٠ نمران!',
    ar: 'تنبيه: نظراً لرسوبك في أكثر من واحدة، يمكن لمادة واحدة فقط الاستفادة من درجة العبور (٤٠)، ويجب على الباقي الوصول للـ ٥٠ بالكامل!',
    en: 'Notice: As you have multiple subjects outstanding for Round 2, only this specific subject can benefit from carry-over (grade 40). Other subjects must reach 50!'
  },
  r2_exam_out_of_80: {
    kus: 'تاقیکردنەوەی دەورێ دووەم لەسەر ٨٠ نمرەیە (کۆی گشتی: ٢٠ هەڵسەنگاندن + ٨٠ ئەزموون = ١٠٠)',
    kub: 'ئەزموونا دەورێ دووێ ل سەر ٨٠ نمران دهێتە ئەنجامدان (کۆی گشتی ٢٠ عەمەلی + ٨٠ جەڕباندن = ١٠٠)',
    ar: 'اختبار الدور الثاني التحريري من ٨٠ درجة (المجموع: ٢٠ تقييم مستمر + ٨٠ تحريري = ١٠٠)',
    en: 'The Round 2 written exam is marked out of 80 (Sum: 20 class assessment + 80 written exam = 100)'
  },
  r2_target_exam80_lbl: {
    kus: 'پێویست لەسەر ٨٠ (عوبور)',
    kub: 'پێویست ژ سەر ٨٠ نمران (عوبور)',
    ar: 'المطلوب في التحريري من ٨٠ (للعبور)',
    en: 'Required on 80 (Carry-over)'
  },
  r2_target_exam80_standard_lbl: {
    kus: 'پێویست لە دەورێ دوو لەسەر ٨٠',
    kub: 'پێویست د ئەزموونێدا ژ سەر ٨٠',
    ar: 'المطلوب في التحريري لدور ٢ من ٨٠',
    en: 'Required in Round 2 Exam (out of 80)'
  },
  r2_target_score_helper_uboor: {
    kus: 'نمرەی پێویست لەسەر ٨٠ بۆ دەرچوونی عوبور (ببیتە ٤٠)',
    kub: 'نمرەیا پێتڤی ژ سەر ٨٠ بۆ دەربازبوونا عوبورێ (ببیتە ٤٠)',
    ar: 'الحد الأدنى لدرجة تحريري الدور الثاني لتأمين العبور (الحصول على ٤٠ إجمالاً)',
    en: 'Minimum written mark on 80 to attain carry-over status (Reaches 40 overall)'
  },
  r2_target_score_helper_standard: {
    kus: 'نمرەی پێویست لەسەر ٨٠ بۆ دەرچوونی تەواو (ببیتە ٥٠)',
    kub: 'نمرەیا پێتڤی ژ سەر ٨٠ بۆ دەربازبوونا تەمام (ببیتە ٥٠)',
    ar: 'الحد الأدنى لدرجة تحريري الدور الثاني للنجاح الكامل (الحصول على ٥٠ إجمالاً)',
    en: 'Minimum written mark on 80 to secure a standard pass (Reaches 50 overall)'
  },
  r2_multi_fail_general_notice: {
    kus: 'سەرنج: لەبەر ئەوەی تەنها یەک بابەت دەتوانێت بە یاسای عوبور تێپەڕێت، پێویستە نمرەی گشتی ئەم بابەتەکەت بگاتە ٥٠ بۆ دەرچوون نەک ٤٠، ئەگەرنا بە دەرنەچوو هەژمار دەکرێیت.',
    kub: 'تێبینی: ژ بەر هندێ کو بتنێ یەک بابەت دشێت بە عوبور دەرباز ببیت، نمرەیا ڤی بابەتی ژی پێویستە بگەهیتە ٥٠ بۆ سەرکەفتنێ نەک ٤٠، ئەگەر نە دێ کەفتن هێتە تۆمارکرن.',
    ar: 'تنبيه: بما أن مادة واحدة فقط يسمح لها بالعبور بالترقية، هذه المادة تحتاج ٥٠ درجة كاملة للنجاح وإلا اعتبرت معيداً بالكامل.',
    en: 'Notice: Since at most one subject is allowed to carry over, this subject must reach 50 overall to pass instead of 40, otherwise it results in failure.'
  },
  language_select_lbl: {
    kus: 'زمان هەڵبژێرە:',
    kub: 'زمانێ خۆ هەلبژێرە:',
    ar: 'اختر لغة النظام:',
    en: 'Choose Language:'
  },
  ministry_rules_header: {
    kus: 'یاسای فەرمی بڕیار و پەڕینەوە (عوبور)',
    kub: 'قانوونێن فەرمى یێن بڕیار و عوبورێ',
    ar: 'التعليمات الرسمية للقرارات والعبور والترشيح',
    en: 'Official Grace & Carry-Over Directives'
  },
  ministry_rules_intro: {
    kus: 'قوتابی لە سەرجەم بابەتەکاندا بە شێوەی کۆکراوە تەنها مافی ٥ نمرەی بڕیاری هەیە.',
    kub: 'قوتابی ل سەرجەم بابەتێن خاندنێ ب شێوەیەکێ کۆمکری بتنێ مافێ ٥ نمرەکێن بریارێ هەیە.',
    ar: 'يحق للطالب في جميع المواد الاستفادة بصورة مجتمعة وتراكمية من ما مجموعه ٥ درجات قرار فقط للإنقاذ.',
    en: 'Students are legally entitled to a maximum cumulative pool of 5 grace marks across all subjects.'
  },
  ministry_rules_example_title: {
    kus: '📌 بۆ نموونە:',
    kub: '📌 بۆ نموونە کا چەوا دبیت:',
    ar: '📌 على سبيل المثال لا الحصر:',
    en: '📌 Example Explanations:'
  },
  ministry_rules_ex_1: {
    kus: 'ئەگەر بابەتێک ٣ نمرەی بڕیار بەرێت، بابەتەکەی تری تەنیا مافی ٢ نمرەی بڕیاری دەبێت.',
    kub: 'ئەگەر بابەتەکی ٣ نمرێن بریارێ برن، بابەتێ دی دی بتنێ مافێ ٢ نمرێن دی یێن بریارێ هەیە.',
    ar: 'إذا استهلكت مادة ٣ درجات قرار، يتبقى للمواد الأخرى درجتان فقط للاستفادة منها للتعديل.',
    en: 'If one subject takes 3 grace marks, other failing subjects can collectively use at most 2 remaining grace marks.'
  },
  ministry_rules_ex_2: {
    kus: 'یاسای عوبور تەنها بۆ یەک بابەتە کە نمرەی سەرەتایی کەمتر نەبێت لە ٣٥ (پێویستی بە بڕیار و عوبوری گشتی هەیە).',
    kub: 'یاسایا عوبورێ بتنێ بۆ یەک بابەتە کۆ نمرەیا دەسپێکێ کێمتر نەبیت ژ ٣٥ (پێویست ب بریارا هاری و عوبورێ هەیە).',
    ar: 'قرار العبور متاح لمادة واحدة فقط بشرط ألا تقل درجتها الأولية عن ٣٥ تمهيداً لترقيتها للـ ٤٠ ثم الـ ٥٠.',
    en: 'The carry-over provision applies to at most one subject with raw score >= 35 (with helping grace/carry-over rules).'
  },
  ministry_badge_txt: {
    kus: 'یاسایی',
    kub: 'فەرمی و یاسایی',
    ar: 'قانوني وفني',
    en: 'Legal Protocol'
  },
  final_verdict_lbl: {
    kus: 'ئەنجامی سەرەکیش (Final Verdict)',
    kub: 'ئەنجامێ سەرەکیێ کۆتایی',
    ar: 'الـحـكـم والـنـتـيـجـة الـنـهـائـيـة',
    en: 'Main Academic Status (Final Verdict)'
  },
  passed_header_verdict: {
    kus: 'قوتابی دەرچوو (ناجح) 🎓',
    kub: 'قوتابی ب دەستکەفتیانە ناجح بوو 🎓',
    ar: 'الطالب ناجح ومؤهل للانتقال 🎓',
    en: 'The Student Has Passed 🎓'
  },
  uboor_header_verdict: {
    kus: 'سەرکەوت بۆ قۆناغی تر بە عوبور (مەرجدار) 🔵',
    kub: 'ب دەربازبوونا عوبورێ گەهشتە قۆناغا دی 🔵',
    ar: 'ناجح مع عبور مادة واحدة (مؤهل) 🔵',
    en: 'Passed to next grade with Carry-Over 🔵'
  },
  failed_header_verdict: {
    kus: 'داخەکەم! قوتابی دەرنەچوو ⚠️',
    kub: 'مخابن! قوتابی دەرنەکەفت (کەفتی) ⚠️',
    ar: 'للأسف! الطالب راسب ومستمر بالإعادة ⚠️',
    en: 'Unfortunately, Student has Failed ⚠️'
  },
  student_dear: {
    kus: 'قوتابی خۆشەویست',
    kub: 'قوتابیێ هێژا',
    ar: 'الطالب العزيز',
    en: 'Dearest Student'
  },
  the_student_male: {
    kus: 'ئەم قوتابیە',
    kub: 'ئەڤ قوتابیە',
    ar: 'هذا الطالب',
    en: 'This student'
  },
  passed_verdict_reason: {
    kus: 'سەرجەم بابەتەکانی بە سەرکەوتوویی تێپەڕاند بە هاوکاری یاسایی.',
    kub: 'سەرجەم بابەتێن خاندنێ ب سەرکەفتیانە دەربازکرن بتنێ دگەل هاوکاریا فەرمی.',
    ar: 'قد أكمل جميع المواد واجتازها بنجاح بدعم درجات وقرار الإنقاذ القانونية.',
    en: 'has successfully cleared all subjects in accordance with official Ministry regulations.'
  },
  uboor_verdict_reason: {
    kus: 'سەرکەوت بۆ قۆناغی داهاتوو بە مەرجی عوبورکردنی یەک بابەتی کەتن دوای یارمەتی نمرەکان.',
    kub: 'دەربازبوو بۆ قۆناغا دی دگەل مەرجێ هەبوونا عوبورکرنا پێک بابەتەکێ کەتن.',
    ar: 'انتقل للمرحلة التالية مع عبور مادة واحدة بعهدة النجاح الموقوف بعد رصد درجات المساعدة.',
    en: 'has advanced to the next grade carrying over one subject following the legal mark adjustments.'
  },
  failed_verdict_reason: {
    kus: 'بەهۆی دەرنەچوون و مانەوەی نمرەی کەمتر لە ٥٠ لە بابەتەکاندا، دەکەوێت و دەمێنێتەوە ل پۆلى خۆیدا.',
    kub: 'ژ بەر نەگەهشتنا نمران و کێمبوونا نمرەیا ژ بابەتان کێمتر ژ ٥٠، دێ مینیتە د هەمان پۆلدا.',
    ar: 'بسبب الرسوب وبقاء درجات بعض المواد دون ٥٠ حتى بعد قرارات المساعدة المسموحة، يعتبر معيداً لصفه.',
    en: 'did not meet the progression standards since some subjects are still below 50 even after maximum help, resulting in grade repetition.'
  },
  average_lbl: {
    kus: 'تێکڕا (Average)',
    kub: 'تێکڕای گشتی',
    ar: 'المعدل العام',
    en: 'Average'
  },
  fails_lbl: {
    kus: 'کەتنەکان',
    kub: 'بابەتێن کەتن',
    ar: 'مواد الرسوب',
    en: 'Fails'
  },
  fails_badge_plural: {
    kus: 'بابەت',
    kub: 'بابەت',
    ar: 'مواد',
    en: 'Subjects'
  },
  help_used_lbl: {
    kus: 'یارمەتی بەکارهاتوو',
    kub: 'نمرێن بریارێ یێن بەکارهاتی',
    ar: 'المساعدات المستعملة',
    en: 'Grace Used'
  },
  copy_report_btn: {
    kus: 'ناردنی ڕاپۆرتی ئەنجام بۆ تێلیگرام / کۆپی کردن',
    kub: 'فرێکرنا راپۆرتا ئەنجامان بۆ تیلیگرامێ / کۆپی کرن',
    ar: 'إرسال تقرير النتيجة إلى تليجرام / نسخ التقرير',
    en: 'Copy Full Report / Send to Telegram'
  },
  copied_success_notice: {
    kus: 'ڕاپۆرتی ئەنجام کۆپی کرا!',
    kub: 'راپۆرتا تە ب تەمامی هاتە کۆپی کرن!',
    ar: 'تم نسخ تقرير الطالب بنجاح!',
    en: 'Student Report Copied!'
  },
  copy_button_hint: {
    kus: 'دەتوانیت لە ڕێگەی ناردنەوە بە شێوەیەکی فۆرماتکراو بۆ هاوڕێ و مامۆستاکانت بنێریت.',
    kub: 'دشێی ب شێوازەکێ جوان فرێکەی بۆ هەڤال و مامۆستایێن خۆ یێن رێزدار.',
    ar: 'يمكنك إرسال التقرير النصي المصمم والمفصل مباشرة لزملائك ومدرسيك لمشاركته.',
    en: 'You can share this formatted report with your classmates, parents, or teachers.'
  },
  timeline_header_title: {
    kus: 'ڕوونکردنەوەی بەکارخستنی نمرەکانی یارمەتی (Interactive Help Steps)',
    kub: 'شلوڤەکرنا چەوانیا بکارئینانا نمرێن هاریکاریێ ب هەنگاڤان',
    ar: 'التسلسل المنطقي لاحتساب وتوزيع نمر المساعدة بنجاح',
    en: 'Sequential Allocation Profile for Grace/Carry-Over Marks:'
  },
  timeline_footer_note: {
    kus: 'شیتەڵکارییەکە پشتبەستووە بە ئەلگۆریتمی فەرمی ئەنجومەنی زانکۆکان.',
    kub: 'ئەڤ شلوڤەکرنە پشتبەستی یە ل سەر ئەلگۆریتمێ فەرمیێ پەروەردێ.',
    ar: 'تم احتساب ودعم الموديلات وفقاً لمنطق ولائحة وزارة التربية الرسمية بدقة.',
    en: 'This analytical output is generated strictly according to official Ministry of Education algorithms.'
  },
  comparison_title: {
    kus: 'بەراوردکردنی نمرەکان پێش و دوای هاوکاری:',
    kub: 'هەلسەنگاندن و جیاوازیا نمران بەری بریارێ و پاش بریارێ:',
    ar: 'مقارنة وعرض درجات المشرع قبل وبعد قرارات الإنقاذ والمساعدة:',
    en: 'Score Analysis Before and After System Interventions:'
  },
  no_comparison_data: {
    kus: 'هیچ زانیاریەک بەردەست نییە بۆ نمایش',
    kub: 'چ پێزانین نینن ل سەر ڤی باری دا بنماینین',
    ar: 'لا توجد بيانات متاحة للعرض حالياً',
    en: 'No comparison datasets are available to display'
  },
  badge_grace_short: {
    kus: 'بڕیار',
    kub: 'بریار',
    ar: 'قرار',
    en: 'Grace'
  },
  badge_exempt_short: {
    kus: 'دەرچوو',
    kub: 'ناجح',
    ar: 'اجتاز',
    en: 'Passed'
  },
  badge_fail_short: {
    kus: 'دەکەوێ',
    kub: 'دکەڤیت',
    ar: 'رسوب',
    en: 'Fails'
  },
  rules_guide_heading: {
    kus: 'ڕێنمایی فەرمی یارمەتی نمرەکان و بڕیاری پەڕینەوە',
    kub: 'رێسا و بڕیارێن وەزارەتێ ل سەر عوبورێ و پێنج نمران',
    ar: 'دليل ورؤية القرارات الوزارية لاحتساب الدرجات والدور الثاني',
    en: 'Official Kurdistan Ministry of Education Grading Handbooks'
  },
  rules_guide_desc: {
    kus: 'وردەکاری فەرمی لەسەر چۆنییەتی زیادکردنی نمرەی هاوکاری لە قوتابخانەکانی هەرێمی کوردستان بە نموونەی کرداری.',
    kub: 'وردەکاریێن فەرمی ل سەر زێدەکرنا نمرێن بریارا و عوبورێ ل قوتابخانەیێن کوردستانێ ب نموونان.',
    ar: 'تفاصيل دقيقة مدعومة بأمثلة عملية حول آلية احتساب وتوزيع درجات المساعدة في مدارس إقليم كردستان.',
    en: 'Complete legal explanation on the mechanics of school grade adjustment and carry-over implementations.'
  },
  rule_5_title: {
    kus: 'ڕێسای ٥ نمرەی بڕیار (5 Grace Marks)',
    kub: 'یاسایا لێبۆرینا ٥ نمرێن فەرمی',
    ar: 'قاعدة الـ ٥ درجات قرار (منقذ)',
    en: 'The 5-Mark Cumulative Grace Rule'
  },
  rule_5_desc: {
    kus: 'بەپێی بڕیاری وەزارەتی پەروەردە، هەر بابەتێک نمرەکەی لە سەرەتادا نێوان (٤٥ یان ٤٦ یان ٤٧ یان ٤٨ یان ٤٩) بێت، ڕاستەوخۆ دەبێتە ٥٠ بۆ ئەوەی ڕزگاری پێ ببەخشرێت و بە ناجحی دەربچێت.',
    kub: 'ل سەر بڕیارا وەزارەتێ، هەر بابەتەکی نمرەیا وێ د نێڤبەرا (٤٥ تا ٤٩) دابیت، راستەوخۆ دێ بیتە ٥٠ دا قوتابی دەرچووی بیت.',
    ar: 'وفقاً لقرارات وزارة التربية، أي مادة تقع درجتها الأولية التراكمية في نطاق (٤٥ إلى ٤٩) تُرفع تلقائياً إلى ٥٠ لإنقاذ الطالب واجتيازها.',
    en: 'Per educational code, any subject score within 45 to 49 gets boosted up to exactly 50 to secure a standard pass.'
  },
  rule_5_ex_title: {
    kus: 'چۆن نمرەکان زیاد دەکات؟',
    kub: 'چەوا نمرە زێدە دبن؟',
    ar: 'كيف تتم الزيادة؟',
    en: 'How are scores adjusted?'
  },
  rule_5_line_1: {
    kus: 'نمرەی ٤٩ 👈 +١ نمرە زیاد دەکات بۆ ٥٠',
    kub: 'نمرەیا ٤٩ 👈 +١ نمرە زێدە دبیت بۆ ٥٠',
    ar: 'درجة ٤٩ 👈 يضاف لها +١ لتصبح ٥٠',
    en: 'Score of 49 👈 +1 mark added to hit 50'
  },
  rule_5_line_2: {
    kus: 'نمرەی ٤٨ 👈 +٢ نمرە زیاد دەکات بۆ ٥٠',
    kub: 'نمرەیا ٤٨ 👈 +٢ نمرە زێدە دبن بۆ ٥٠',
    ar: 'درجة ٤٨ 👈 يضاف لها +٢ لتصبح ٥٠',
    en: 'Score of 48 👈 +2 marks added to hit 50'
  },
  rule_5_line_3: {
    kus: 'نمرەی ٤٥ 👈 +٥ نمرە زیاد دەکات بۆ ٥٠',
    kub: 'نمرەیا ٤٥ 👈 +٥ نمرە زێدە دبن بۆ ٥٠',
    ar: 'درجة ٤٥ 👈 يضاف لها +٥ لتصبح ٥٠',
    en: 'Score of 45 👈 +5 marks added to hit 50'
  },
  rule_10_title: {
    kus: 'ڕێسای بڕیاری ١٠ نمرەی عوبور (پەڕینەوە)',
    kub: 'یاسایا بریار یا کۆمکرنا ١٠ نمرێن عوبورێ',
    ar: 'قاعدة الـ ١٠ درجات عوبور (ترقية)',
    en: 'The 10-Mark Speculative Carry-over Rule'
  },
  rule_10_desc: {
    kus: 'یاساکانی هاوکاری بە قوتابخانەکان ڕێگە بۆ قوتابی دەکەنەوە کە سوودمەند بێت لە زیادکردنی تا ١٠ نمرەی عوبور بۆ تەنها یەک بابەت. ئەگەر بابەتێکی ٣٥ نمرە بێت بە ٥ نمرەی فەرمی دەبێتە ٤٠ و پاشان بە ١٠ نمرەی عوبور دەگۆڕێت بۆ ٥٠ و سەرکەوتووانە ناجح دەبێت.',
    kub: 'یاسا و فەرمان ددەنە رێ تا قوتابی ب هێزا زێدەکرنا تا ١٠ نمران بۆ پێک بابەتەکێ کەتن باوەربکرى بیت. گەر نمرەیا وێ ٣٥ بیت، پێنج نمرێن فەرمی دبنە ٤٠، پاشی دەهـ نمرێن عوبورێ دگەهیننە ٥٠ و دەرباز دبیتت.',
    ar: 'تتيح لوائح الوزارة فرصة استثنائية للاستفادة من درجات عبور تصل إلى ١٠ درجات لمادة واحدة فقط. إن كان هناك مادة بـ ٣٥ درجة، ترتقي بـ ٥ درجات قرار لتصبح ٤٠، ثم بمساعد ١٠ عبور تصبح ٥٠ وتمرر كعبور معتمد.',
    en: 'This clause permits an extreme adjustment up to 10 marks for at most one subject. For instance, a score of 35 can be helped with 5 decision marks to hit 40, and then with 10 carry-over marks to reach 50, converting its status to Passed.'
  },
  rule_10_ex_title: {
    kus: 'چۆن نمرەکان زیاد دەکات لە سیستەم؟',
    kub: 'چەوا د سیستەمی دا زێدە دبیت؟',
    ar: 'كيفية التوزيع بالسيستم المعتمد:',
    en: 'How does it compute under the system?'
  },
  rule_10_line_1: {
    kus: 'نمرەی ٣٥ 👈 +٥ نمرەی بڕیار دەبێتە ٤٠ و +١٠ نمرەی عوبور دەبێتە ٥٠',
    kub: 'نمرەیا ٣٥ 👈 +٥ نمرێن بریارێ دبنە ٤٠، و +١٠ نمرێن عوبور دبنە ٥٠',
    ar: 'درجة ٣٥ 👈 ترتفع بـ +٥ درجات قرار لتصبح ٤٠، ثم بمساعدة +١٠ عبور تصل لـ ٥٠',
    en: 'Score of 35 👈 +5 grace marks becomes 40 and +10 carry-over marks becomes 50'
  },
  rule_10_line_2: {
    kus: 'نمرەی ٤٠ 👈 +١٠ نمرەی تەواو زیاد دەکات بۆ ٥٠',
    kub: 'نمرەیا ٤٠ 👈 +١٠ نمرێن تەمام زێدە دبن بۆ ٥٠',
    ar: 'درجة ٤٠ 👈 ترتفع بـ +١٠ درجات عبور كاملة لتصبح ٥٠ مباشرة',
    en: 'Score of 40 👈 +10 carry-over marks added directly to reach 50'
  },
  rule_10_line_3: {
    kus: 'نمرەی ٤٢ 👈 +٨ نمرەی تەواو زیاد دەکات بۆ ٥٠',
    kub: 'نمرەیا ٤٢ 👈 +٨ نمرێن تەمام زێدە دبن بۆ ٥٠',
    ar: 'درجة ٤٢ 👈 ترتفع بـ +٨ درجات عبور جزئية لتصبح ٥٠ مباشرة',
    en: 'Score of 42 👈 +8 carry-over marks added to reach 50'
  },
  matrix_title: {
    kus: 'دیاریکردنی دۆخی سەرکەوتنی گشتی قوتابی (Student Academic Status Matrix)',
    kub: 'دەستنیشانکرنا بارودۆخێ سەرکەفتنا گشتی یا قوتابی',
    ar: 'جدول تحديد وتقييم حالة الطالب الدراسية ككل',
    en: 'Overall Academic Status Calculation Matrix'
  },
  matrix_pass_lbl: {
    kus: 'دەرچوو (ناجح)',
    kub: 'دەرچوویی (ناجح)',
    ar: 'ناجح ومجتاز كلياً',
    en: 'Passed (Decisive Pass)'
  },
  matrix_pass_header: {
    kus: 'کۆتا ئەنجام: دەرچوون',
    kub: 'کۆتا ئەنجام: دەربازبوونا تەمام',
    ar: 'النتيجة النهائية: اجتياز ونجاح كامل',
    en: 'Final Verdict: Full Promotion'
  },
  matrix_pass_desc: {
    kus: 'ئەگەر سەرجەم نمرەکان دوای زیادکردنی بڕیاری هاوکار نمرەیان ٥٠ یاخود زیاتر بێت.',
    kub: 'ئەگەر سەرجەم نمرەکان پشتی هاریکاریێن فەرمی ژ ٥٠ یان پتر بن.',
    ar: 'إذا أصبحت نتائج جميع المواد الدراسية ٥٠ أو أكثر بعد تطبيق قرارات المساعدة المسموحة.',
    en: 'When all subject outcomes reaching 50 or above following maximum educational support.'
  },
  matrix_fail_lbl: {
    kus: 'دەرنەچوو (ڕاسیب)',
    kub: 'دەرنەکەفتن (مای ل پۆلا خۆ)',
    ar: 'راسب ومعيد لصفه',
    en: 'Failed (Grade Retained)'
  },
  matrix_fail_header: {
    kus: 'کۆتا ئەنجام: دووبارەکردنەوە',
    kub: 'کۆما کۆتایی: دووبارەکرنا پۆلێ',
    ar: 'النتيجة النهائية: إعادة صف الطالب',
    en: 'Final Verdict: Retain Grade'
  },
  matrix_fail_desc: {
    kus: 'سیستەمی قوتابخانەکان: ئەگەر قوتابی ل تەنانەت یەک بابەت دەرنەچوو بێت دوای زیادکردنی بڕیاری هاوکاری، دەکەوێت و دەمێنێتەوە ل پۆلى خۆیدا.',
    kub: 'قانوونا قوتابخانان: گەر قوتابی د بابەتەکی ب تنێ ژی دا مابیت پشتی تەرخانکرنا نمرێن لێبۆرینێ، دێ مینیت د پۆلا خۆ دا.',
    ar: 'لوائح المدارس: إن بقي الطالب راسباً في مادة واحدة فقط رغم المساعدة، يعتبر معيداً لصفه بالكامل دون استثناء.',
    en: 'Strict school regulations decree that if even a single subject remains failed under maximum allowed assist, the student must repeat the grade.'
  },
  btn_return: {
    kus: 'گەڕانەوە بۆ ئەژمارکردنی ئەنجامەکە',
    kub: 'گەڕیان بۆ ئەژمارکارێ سەرەکیێ نمران',
    ar: 'العودة لواجهة احتساب الدرجات الرئيسية',
    en: 'Return to Grade Calculator UI'
  },
  footer_text: {
    kus: 'ئەپڵیکەیشنی ڕێنماییکاری نمرەی قوتابخانەکان پشتگیری بڕیاری فەرمی پێنج نمرە و بڕیاری تا ١٠ نمرەی عوبور دەکات بۆ قوتابیانی پەروەردە.',
    kub: 'ئەپلیکەیشنا ڕێبەریا نمران پشتگیری ل سەر بڕیارێن حوکمى یێن ٥ نمران و تا ١٠ نمرێن عوبورێ دکەت بۆ قوتابیێن ڕێزدار.',
    ar: 'حاسبة نمر المدارس الرسمية تدعم وتطبق قرارات الـ ٥ درجات قرار، وقرار العبور لـ ١٠ درجات لمساعدة الطلاب بدقة متناهية.',
    en: 'The Kurdish school grade advisor fully implements the legal 5-mark grace pool and the 10-mark carry-over protocol for public education.'
  },
  footer_credit_1: {
    kus: 'کۆدکراو بە تەواوی بۆ چاکەخوازی قوتابیان',
    kub: 'هاتیە دورستکرن ب تەمامی بۆ خزمەتا قوتابیێن دەڤەرێ',
    ar: 'تمت البرمجة بالكامل لخدمة ودعم طلاب المدارس والمعلمين',
    en: 'Engineered entirely to assist Kurdish school students and educational systems'
  },
  footer_credit_2: {
    kus: '© ٢٠٢٦ هەموو مافەکان پارێزراوە',
    kub: '© ٢٠٢٦ هەموو ماف پارێزراون',
    ar: 'جميع الحقوق محفوظة © ٢٠٢٦',
    en: '© 2026 All Rights Reserved'
  }
};
