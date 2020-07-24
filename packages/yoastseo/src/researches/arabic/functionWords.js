/**
 * Returns an object with exceptions for the prominent words researcher
 * @returns {Object} The object filled with exception arrays.
 */
const articles = [ "الـ" ];

const cardinalNumerals = [ "صفر", "واحد", "واحدة", "أحد", "إحدى", "إثنان", "اثنتان", "إثنين", "ثنتين", "إثنتين", "إثنا",
	"إثنى", "إثنتا", "إثنتي", "ثلاث", "ثلاثة", "أربع", "أربعة", "خمس", "خمسة", "ست", "ستة", "سبع", "سبعة", "ثمان",
	"ثمانية", "تسع", "تسعة", "عشر", "عشرة", "عشرون", "ثلاثون", "أربعين", "أربعون", "خمسون", "ستون", "سبعون", "ثمانون",
	"تسعون", "مئة", "مائة", "مئتان", "ثلاثمئة", "ثلاثمائة", "أربعمئة", "أربعمائة", "خمسمئة", "خمسمائة", "ستمئة", "ستمائة",
	"سبعمئة", "سبعمائة", "ثمانمئة", "ثمانمائة", "تسعمئة", "تسعمائة", "ألف", "ألآف", "ألْفا", "ألفين", "مليون", "ملايين", "مليار" ];

const ordinalNumerals = [ "الأول", "الأولى", "الثّاني", "الثانية", "الثالث", "الثالثة", "الرابع", "الرابعة", "الخامس",
	"الخامسة", "السادس", "السادسة", "السابع", "السابعة", "الثامن", "الثامنة", "التاسع", "التاسعة", "العاشر", "العاشرة",
	"الحادي", "الحادية", "العشرون", "الثلاثون", "الأربعون", "الخمسون", "الستون", "السبعون", "الثمانون", "التسعون",
	"المئة", "المائة" ];

const personalPronounsNominative = [ "أنا", "انت", "هو", "هي", "نحن", "أنتما", "هما", "أنتم", "أنتن", "هم", "هن",
	"وأنا", "وأنت", "وهو", "وانا", "ونحن", "وهي", "وانت", "أنتي", "فهو", "وهم", "وأنتما" ];

const personalPronounsAccusative = [ "إيّاه", "إيّاهما", "إيّاهم", "إيّاها", "إيّاكما", "إيّاهنّ", "إيّاك", "إيّاكم", "إيّاكنّ",
	"إيّاي", "إيّانا" ];

const demonstrativePronouns = [ "هذا", "هذه", "هذان", "هذين", "هتان", "هـتين", "ذا", "ذان", "ذين", "أولئ", "ذلك",
	"ذانك", "ذينك", "تلك", "تانك", "تيْنك", "أولئك", "هؤلاء", "ذاك", "هاتان", "هاتين", "ذه", "هأولئ", "ذلكم", "ذلكم",
	"وهذا", "هذة", "أولئك" ];
const vocativeParticles = [ "يا", "أي", "هيا", "أ", "آ", "أيها", "أيتها" ];

const quantifiers = [ "جميع", "كلّ", "بعْض", "كثير", "كثيرة", "عديد", "عديدة", "لبعض", "قليلا", "كافية", "كافي", "صغير",
	"صغيرة", "قليل", "قليلة", "كثيرا", "بالكثير", "أكثر", "اكبر", "اغلب", "عديدة", "عديد", "قليلون", "أقل", "كل",
	"الكثير", "المزيد", "اكثر", "الأقل", "يكفي", "العديد", "كله", "جميعا", "كلها", "وكل", "كلنا", "كثيرة", "الأكثر",
	"ببعض", "بضعة", "عدة" ];

const reflexivePronouns = [ "نفسي", "نفسك", "نفسه", "نفسها", "أنفسنا", "أنسفكم", "أنفسهم", "أنفسهما", "أنفسكما",
	"أنفسكنّ", "أنفسهنّ", "بنفسي" ];
const indefinitePronouns = [ "ليس", "جميع", "الكل", "الجميع", "شخص", "شيء", "شيئا", "أخرى", "آخرين", "أي", "أيا", "من",
	"الآخرين", "أحد", "شئ", "أخرى", "شىء", "احد", "أية", "اخرى", "البعض", "أخر", "الآخر", "أحدهم", "الأخرى", "الشئ",
	"بعضنا", "بشيء", "شي", "الغير" ];
const relativePronouns = [ "الذي", "التي", "الذى", "التى", "الذين", "مالذي", "اللذان", "الذين", "اللتان", "اللاتي", "الذي",
	"اللتين", "اللذين" ];

const intensifiers = [ "جدا", "حقا", "للغاية", "تماما", "فعلا" ];

const interrogativeDeterminers = [ "ماذا", "لمن", "ما", "أيّ", "أى", "وماذا", "وما", "بماذا", "ماهو", "ماهذا" ];
const interrogativePronouns = [ "من", "ومن" ];
const interrogativeProAdverbs = [ "اين", "كيف", "لماذا", "لم", "سواء", "أينما", "كيفما", "مـتى", "كم", "هل", "أين", "أهذا", "وكيف", "وهل",  ];

const locativeAdverbs = [ "هنا", "هناك", "هنالك" ];
const adverbialGenitives = [ "دائما", "مرة", "مرتين" ];
const otherAuxiliaries = [ "يجب", "سوف", "قد", "أستطيع", "يستطيع", "نستطيع", "تستطيع", "استطيع", "تستطيعين", "استطعت",
	"استطاعت", "استطاع", "استطعتما", "استطاعتا", "استطاعا", "استطعنا", "استطعتنّ", "استطعتم", "استطعن", "استطاعوا",
	"تستطيعان", "يستطيعان", "تستطعن", "تستطيعون", "يستطعن", "يستطيعون", "تستطيعي", "تستطيعا", "يستطيعا", "تستطيعوا",
	"يستطيعوا", "استطيعت", "استطيعتا", "استطيعا", "استطيعوا", "تستطاعين", "تستطاع", "يستطاع", "نستطاع", "تستطاعان",
	"يستطاعان", "تستطاعون", "يستطاعون", "أستطاع", "تستطاعي", "تستطاعا", "يستطاعا", "يستطاعوا", "تستطاعوا", "استطيعي",
	"يمكنني", "يمكن", "يمكننى", "بإمكانك", "لابد", "ينبغي", "وسوف", "هلا", "بد", "وقد", "ولقد", "يمكنه", "يمكنهما",
	"يمكنهم", "يمكنها", "يمكنكما", "يمكنهنّ", "يمكنك", "يمكنكم", "يمكنكنّ", "يمكني", "يمكننا" ];

const copula = [ "لدي", "لديك", "لدينا", "لديه", "لديها", "لديهم", "لديهما", "لديكم", "لديكما", "لديهنّ", "لديكنّ", "صبحت",
	"صبح", "صبحتما", "صبحا", "صبحتا", "صبحنا", "صبحتنّ", "صبحتم", "صبحن", "صبحوا", "أصبح", "تصبحين", "تصبح", "يصبح",
	"تصبحان", "يصبحان", "نصبح", "تصبحن", "تصبحون", "تصبحي", "تصبحا", "يصبحا", "تصبحوا", "يصبحوا", "اصبحي", "اصبحوا",
	"اصبحا", "ابقى", "كان", "كنت", "كانت", "يكون", "كنتما", "كانتا", "كانا", "كنّا", "كنّ", "كانوا", "كنتم", "أكون",
	"تكونين", "تكون", "تكونان", "يكونان", "نكون", "تكونون", "يكنّ", "يكونون", "تكوني", "تكونا", "يكونا", "تكونوا",
	"يكونوا", "كونا", "كونوا", "كن", "أكن", "اكون", "وكان", "كوني", "اكن", "سنكون", "كنا", "سيكون", "يكن", "ستكون",
	"تكن", "سأكون", "بتّ", "باتت", "بات", "بتّما", "باتتا", "باتا", "بتنا", "بتّنّ", "بتّم", "باتوا", "أبيت", "بت", "صرت",
	"صرت", "صار", "صرتما", "صارتا", "صارا", "صرنا", "صرتنّ", "صرتم", "صرن", "صاروا", "أصير", "تصيرين", "تصير", "يصير",
	"تصيران", "يصيران", "نصير", "تصرن", "يصرن", "تصيرون", "يصيرون", "تصيري", "تصيرا", "يصيرا", "تصيروا", "يصيروا", "ليس",
	"وليس", "ليست", "ليسوا", "ليسا", "ليسنا", "ليسن", "أليس", "اليس", "لست", "لسنا" ];

const prepositions = [ "أن", "في", "على", "إلى", "ان", "عن", "فى", "مع", "الى", "بعد", "بدون", "تحت", "طوال", "علي", "غير",
	"لدى", "حول", "خلال", "لكي", "بين", "الي", "خارج", "بشأن", "فوق", "دون", "لـ", "بـ", "بلا", "بواسطة", "ضد", "أمام",
	"وفي", "وشك", "نحو", "ذو", "أسفل", "ب", "خلف", "بجانب", "عدا", "طبقا", "بعد", "عكس", "منذ" ];

const prepositionPrecedingPronouns = [ "إليه", "إليهما", "إليهم", "إليها", "إليكما", "إليهنّ", "إليك", "إليكم", "إليكنّ",
	"إليّ", "إلينا", "عليه", "عليهما", "عليهم", "عليها", "عليكما", "عليهنّ", "عليك", "عليكم", "عليكنّ", "عليّ", "علينا",
	"عنه", "عنهما", "عنهم", "عنها", "عنكما", "عنهنّ", "عنك", "عنكم", "عنكنّ", "عني", "عننا", "له", "لهما", "لهم", "لها", "لكما", "لهنّ",
	"لك", "لكم", "لكنّ", "لي", "لنا", "معه", "معهما", "معهم", "معها", "معكما", "معهنّ", "معك", "معكم", "معكنّ", "معي", "معنا", "منه",
	"منهما", "منهم", "منها", "منكم", "منهنّ", "منك", "منكم", "منكنّ", "مني", "منا", "فيه", "فيهما", "فيهم", "فيها", "فيكما", "فيهنّ",
	"فيك", "فيكم", "به", "بهما", "بهم", "بها", "بكما", "بهنّ", "بك", "بكم", "بكنّ", "بي", "بنا", "بينهم", "بينهما", "بينكما", "بينكم",
	"بتلك", "بذلك", "فأنت", "بيننا", "بهذا", "بهذه", "فأنا", "فهذا", "فيما", "أجلك", "كهذا", "لأي", "لذلك", "لما", "لنفسك", "لهذا", "لهذه" ];

// Many prepositional adverbs are already listed as preposition.
const prepositionalAdverbs = [ "داخل", "ضمن", "قدما" ];

const coordinatingConjunctions = [ "و", "و/او", "او", "أو" ];

const subordinatingConjunctions = [ "إذا", "لو", "اذا", "وإذا", "أذا" ];

// These verbs are frequently used in interviews to indicate questions and answers.
const interviewVerbs = [ ];

// These transition words were not included in the list for the transition word assessment for various reasons.
const additionalTransitionWords = [ "الآن", "كذلك", "ربما", "كما", "لذا", "الان", "الأن", "بما", "أيضا", "بالنسبة",
	"فحسب", "والآن", "بكل", "مما", "ايضا", "بخصوص", "القادمة", "المحتمل", "مازال", "مازلت", "طالما", "قط", "بالتأكيد",
	"بدلا", "بوضوح", "فورا", "حالا", "التالي", "حاليا", "بالعادة", "تقريبا", "ببساطة", "اختياريا", "أحيانا", "أبدا",
	"بالمناسبة", "خاصة", "مؤخرا", "نسبيا" ];

// These verbs convey little meaning.
const delexicalizedVerbs = [ ];

// These adjectives and adverbs are so general, they should never be suggested as a (single) keyword.
// Keyword combinations containing these adjectives/adverbs are fine.
const generalAdjectivesAdverbs = [ "جيد", "آخر", "رائع", "أفضل", "جيدة", "نفس", "فقط", "مجرد", "كبير", "الأفضل", "عظيم",
	"جميلة", "كبيرة", "رائعة", "جديد", "صغيرة", "الصغير", "متأكد", "مهما", "صغير", "جيدا", "الصغيرة", "أكبر", "جديدة",
	"افضل", "الجديد", "طويلة", "ممكن", "اخر", "طويل", "الممكن", "الخاصة", "سيئة", "الكبير", "حقيقي", "بعيدا", "الجيد",
	"مهم", "الجديدة", "كثير", "الكبيرة", "القليل", "ممتاز", "الحقيقي", "سيء", "معا", "قليل", "بعيد", "واضح", "مختلف",
	"متأكدة", "الصعب", "أسوأ", "حوالي", "كامل", "سيئ", "بالإمكان", "بكثير", "خاص", "سوية", "مختلفة", "قريب",
	"الأخير", "الأخيرة", "الافضل", "خير" ];

const interjections = [ "واو", "هيا", "آه", "هيه", "هاى", "أوه", "أخخ", "هووه", "صه", "أوبس", "أها", "آخ", "أح", "شو", "ههههه" ];

// These words and abbreviations are frequently used in recipes in lists of ingredients.
const recipeWords = [ ];

const timeWords = [ "اليوم", "يوم", "ليلة", "دقيقة", "ساعة", "عام", "دقائق", "سنة", "الساعة", "أيام", "العام", "الأسبوع",
	"غدا", "ساعات", "أمس", "أشهر", "الأيام", "شهر", "السنة", "الغد", "يوما", "ثانية", "ثوان", "أسبوع", "أسابيع", "أسبوعا",
	"بالأمس" ];

const vagueNouns = [ "الأمر", "الأشياء", "الشيء", "الأمور", "الامر", "أشياء", "جزء", "الاشياء", "الامور", "الطريقة", "طريقا",
	"طرق", "قطعة", "الأجزاء", "مادة", "مرات", "بالمئة", "جانب", "جوانب", "بند", "عنصر", "عناصر", "بنود", "فكرة", "موضوع",
	"تفصيل", "تفاصيل", "فرق", "فروق" ];

const miscellaneous = [ "نعم", "حسنا", "إنه", "إني", "إنها", "إنك", "إنكم", "إنهم", "إنكما", "إنهما", "إننا", "إنهن",
	"فإن", "إنني", "كلا", "أجل", "أنه", "أنك", "انها", "أنها", "بأن", "أنني", "أنكم", "أنهما", "أنكما", "أنهن", "أنهم",
	"انك", "أني", "أننا", "انهم", "بأنك", "لأنه", "بأنه", "اني", "أننى", "انني", "اننا", "بأنني", "اننى", "بأني", "بأنها",
	"وأن", "بأننا", "للتو", "ها", "رجاء", "تفضل", "اجل", "حالك", "فضلك", "أرجوك", "هكذا", "انة", "بلى", "أعلى", "انى",
	"لا", "لن", "لم", "ولا", "ألا", "ولم", "ولن", "عدم", "فلا", "فلن", "يلا", "يلة" ];

const titlesPreceding = [ ];

/**
 * Returns function words for english.
 *
 * @returns {Object} English function words.
 */
export default function() {
	return {
		// These word categories are filtered at the ending of word combinations.
		filteredAtEnding: [].concat( ordinalNumerals, continuousVerbs, generalAdjectivesAdverbs ),

		// These word categories are filtered at the beginning and ending of word combinations.
		filteredAtBeginningAndEnding: [].concat( articles, prepositions, coordinatingConjunctions, demonstrativePronouns, intensifiers,
			quantifiers, possessivePronouns ),

		// These word categories are filtered everywhere within word combinations.
		filteredAnywhere: [].concat( transitionWords, adverbialGenitives, personalPronounsNominative, personalPronounsAccusative,
			reflexivePronouns, interjections, cardinalNumerals, filteredPassiveAuxiliaries, otherAuxiliaries, copula, interviewVerbs,
			delexicalizedVerbs, indefinitePronouns, correlativeConjunctions, subordinatingConjunctions, interrogativeDeterminers,
			interrogativePronouns, interrogativeProAdverbs, locativeAdverbs, miscellaneous, prepositionalAdverbs, pronominalAdverbs,
			recipeWords, timeWords, vagueNouns ),

		// These categories are used in the passive voice assessment. If they directly precede a participle, the sentence part is not passive.
		cannotDirectlyPrecedePassiveParticiple: [].concat( articles, prepositions, demonstrativePronouns, possessivePronouns, ordinalNumerals,
			continuousVerbs, quantifiers ),

		/*
		These categories are used in the passive voice assessment. If they appear between an auxiliary and a participle,
		the sentence part is not passive.
		*/
		cannotBeBetweenPassiveAuxiliaryAndParticiple: [].concat( otherAuxiliaries, copula, interviewVerbs, delexicalizedVerbs ),

		// This export contains all of the above words.
		all: [].concat( articles, cardinalNumerals, ordinalNumerals, demonstrativePronouns, possessivePronouns, reflexivePronouns,
			personalPronounsNominative, personalPronounsAccusative, quantifiers, indefinitePronouns, continuousVerbs,
			indefinitePronounsPossessive, interrogativeDeterminers, interrogativePronouns, interrogativeProAdverbs,
			pronominalAdverbs, locativeAdverbs, adverbialGenitives, prepositionalAdverbs, filteredPassiveAuxiliaries, notFilteredPassiveAuxiliaries,
			otherAuxiliaries, copula, prepositions, coordinatingConjunctions, correlativeConjunctions, subordinatingConjunctions, interviewVerbs,
			transitionWords, additionalTransitionWords, intensifiers, delexicalizedVerbs, interjections, generalAdjectivesAdverbs,
			recipeWords, vagueNouns, miscellaneous, titlesPreceding, titlesFollowing ),
	};
}
