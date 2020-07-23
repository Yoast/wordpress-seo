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

const intensifiers = [ "جدا", "حقا", "للغاية", "تماما", "فعلا" ];

const interrogativeDeterminers = [ "ماذا", "لمن", "ما", "أيّ", "أى", "وماذا", "وما", "بماذا", "ماهو", "ماهذا", ];
const interrogativePronouns = [ "من", "ومن" ];
const interrogativeProAdverbs = [ "اين", "كيف", "لماذا", "لم", "سواء", "أينما", "كيفما", "مـتى", "كم", "هل", "أين", "أهذا", "وكيف", "وهل",  ];

const locativeAdverbs = [ ];
const adverbialGenitives = [ ];
const otherAuxiliaries = [ ];
const copula = [ ];

const prepositions = [ ];

// Many prepositional adverbs are already listed as preposition.
const prepositionalAdverbs = [ ];

const coordinatingConjunctions = [ ];

const correlativeConjunctions = [ ];
const subordinatingConjunctions = [ ];

// These verbs are frequently used in interviews to indicate questions and answers.
const interviewVerbs = [ ];

// These transition words were not included in the list for the transition word assessment for various reasons.
const additionalTransitionWords = [ ];

/* These verbs convey little meaning. 'Show', 'shows', 'uses', 'meaning', 'set', 'sets'
 are not included, because these words could be relevant nouns.

 */
const delexicalizedVerbs = [ ];

// These adjectives and adverbs are so general, they should never be suggested as a (single) keyword.
// Keyword combinations containing these adjectives/adverbs are fine.
const generalAdjectivesAdverbs = [ ];

const interjections = [ ];

// These words and abbreviations are frequently used in recipes in lists of ingredients.
const recipeWords = [ ];

const timeWords = [ ];

// 'People' should only be removed in combination with 'some', 'many' and 'few' (and is therefore not yet included in the list below).
const vagueNouns = [ ];

// 'No' is already included in the quantifier list.
const miscellaneous = [ "نعم", "حسنا", "إنه", "إني", "إنها", "إنك", "إنكم", "إنهم", "إنكما", "إنهما", "إننا", "إنهن",
	"فإن", "إنني", "كلا", "أجل", "أنه", "أنك", "انها", "أنها", "بأن", "أنني", "أنكم", "أنهما", "أنكما", "أنهن", "أنهم",
	"انك", "أني", "أننا", "انهم", "بأنك", "لأنه", "بأنه", "اني", "أننى", "انني", "اننا", "بأنني", "اننى", "بأني", "بأنها",
	"وأن", "بأننا", "للتو", "ها", "رجاء", "تفضل", "اجل", "حالك", "فضلك", "أرجوك", "هكذا", "انة", "بلى", "أعلى", "انى", ];

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
