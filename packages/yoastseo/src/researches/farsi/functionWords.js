/**
 * Returns an object with exceptions for the prominent words researcher
 * @returns {Object} The object filled with exception arrays.
 */
const articles = [ "و", "با", "بی", "این", "آن", "به", "در", "از", "را", "یا", "پس", "اگر", "مگر", "نه", "چه", "تا", "اما",
	"لیکن", "مثل", "باری", "بر", "برای", "برای این", "برای این که", "برای آن که", "برای آن", "از برای", "خواه", "زیرا", "که",
	"لیکن", "نیز", "ولی", "هم", "چون", "چونان که", "چونان‌که", "چنان", "چنان‌چه", "چنانچه", "چنان‌که", "چونکه", "چون که", "چون‌که",
	"چندان که", "چندان‌که", "زیرا که", "زیراکه", "همین که", "همین‌که", "همان که", "همان‌که", "بلکه", "جز", "الا", "الاّ", "الی",
	"تا اینکه", "تااینکه", "تا آنکه", "تاآنکه", "آن‌جا که", "آن‌گاه که", "از آن‌جا که", "ازآنجاکه", "از آن‌که", "ازآنکه", "زیرا",
	"چون‌که", "چون که", "از این رو", "ازاین‌رو", "ازین‌رو", "از بس", "ازبس", "از بس که", "ازبس‌که", "از بهر آن‌که", "اکنون که",
	"اگرچه", "اگر چنانچه", "اگرچنانچه", "الا این‌که", "با این حال", "بااین‌حال", "با این‌که", "بااین‌که", "بااینکه", "با وجود این",
	"باوجوداین", "با این وجود", "پس", "بس که", "از بس که", "بس‌که", "از بس‌که", "به شرط آن‌که", "به‌شرط آن‌که", "به شرطی که",
	"به شروطی که", "بعد", "قبل", "بعد از", "قبل از", "از بعد از", "از قبل از", "اندر", "بدون", "بی", "علیه", "ضد", "غیر",
	"مانند", "مثل", "واسه‎ی", "برای", "واسه", "برای" ];

const cardinalNumerals = [ "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه", "ده", "یازده", "دوازده", "سیزده", "چهارده", "پانزده",
	"شانزده", "هفده", "هجده", "نوزده", "بیست", "صد", "هزار", "میلیون", "میلیارد" ];

const ordinalNumerals = [ "اول", "اوّل", "دوم", "سوم", "چهارم", "پنجم", "ششم", "هفتم", "هشتم", "نهم", "دهم", "یازدهم", "دوازدهم",
	"سیزدهم", "چهاردهم", "پانزدهم", "شانزدهم", "هفدهم", "هجدهم", "نوزدهم", "بیستم" ];

const personalPronounsNominative = [ "من", "تو", "شما", "ایشان", "ایشون", "او", "ما", "شما", "آنها", "این", "آن" ];

const personalPronounsAccusative = [
	// Me
	"مرا", "من را", "من‌را",

	"به من",
	// I
	"من",
	// You
	"تو را", "تو", "شما را", "شما", "شما را", "شما",
	// To you
	"به تو", "به شما", "به شما",
	// That one
	"اون رو",

	"اونو",
	// To him
	"به اون",
	// That
	"اون",
	// He
	"او را",
	// Him
	"به او",
	// She
	"او",
	// To him
	"به ایشان",
	// Them
	"ایشان را",
	// He
	"ایشان",
	// To him
	"به ایشون",
	// They
	"ایشون رو",
	"ایشون را",

	"ایشون",
	// To this
	"به این",

	"اینو",
	// This side
	"این رو",
	// This
	"این را",
	"این",
	"این",
	"این را",
	// It
	"آن",
	// To this
	"به این",
	// To that
	"به آن",
	// That
	"آن را",
	// This side
	"این رو",

	"اینو",
	// Us
	"ما را",
	"به ما",
	"ما",
	// To them
	"به اونا",
	// Them
	"آن‌ها",
	"آنها",
	"آنها را",
	"آن‌ها را",
	"به آنها",
	"به آن‌ها",
	"اونا",
	"اونارو",
	"اونا رو",
];

const demonstrativePronouns = [  ];

const vocativeParticles = [  ];

const quantifiers = [  ];

const reflexivePronouns = [
	// Myself
	"خودم",
	// Yourself
	"خودت",
	// Himself
	"خودش",
	// One person himself
	"یک نفر خودش",
	// Ourselves
	"خودمان",
	// Yourselves
	"خودتان",
	// Themselves
	"خودشان",
];

const indefinitePronouns = [  ];

const relativePronouns = [  ];

const intensifiers = [  ];

const interrogativeDeterminers = [  ];
const interrogativePronouns = [ ];
const interrogativeProAdverbs = [  ];

const locativeAdverbs = [  ];
const adverbialGenitives = [  ];
const otherAuxiliaries = [  ];

const copula = [  ];

const prepositions = [  ];

const prepositionPrecedingPronouns = [  ];

// Many prepositional adverbs are already listed as preposition.
const prepositionalAdverbs = [  ];

const coordinatingConjunctions = [  ];

const subordinatingConjunctions = [  ];

// These verbs are frequently used in interviews to indicate questions and answers.
const interviewVerbs = [  ];

// These transition words were not included in the list for the transition word assessment for various reasons.
const additionalTransitionWords = [  ];

// These verbs convey little meaning.
const delexicalizedVerbs = [ ];

// These adjectives and adverbs are so general, they should never be suggested as a (single) keyword.
// Keyword combinations containing these adjectives/adverbs are fine.
const generalAdjectivesAdverbs = [ ];

const interjections = [  ];

// These words and abbreviations are frequently used in recipes in lists of ingredients.
const recipeWords = [  ];

const timeWords = [ ];

const monthsOfTheYear = [ "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند" ];

const vagueNouns = [  ];

const miscellaneous = [ ];

const titlesPreceding = [ ];

const transitionWords = [
	// Again
	"دوباره",
	// Certainly
	"قطعاً",
	// Sure
	"حتماً",
	// Basically
	"اصلاً",
	// As a rule
	"قاعدتاً",

	"ظبیعتاً",
	// Maybe
	"شاید",
	// Totally
	"کاملاً",
	// To
	"به",
	// From
	"از",
	// And
	"و",
	// Also
	"همچنین",
	// Both
	"هم",
	// As
	"مانند",
	// Like
	"مثل",
	// Similar to
	"شبیه به",
	// Why
	"ولی",
	// But
	"اما", "امّا", "لیکن",

	"ولو",
	//  In addition
	"در ضمن",
	// Near
	"در کنار",
	// Preferred
	"ترجیحاً",
	// Otherwise
	"وگرنه",
	// Then
	"پس", "سپس",
	// When
	"وقتی", "زمانی که",
	// For
	"به خاطر",
	// Especially
	"مخصوصاً",
	// Specifically
	"مشخصاً",
	// Generally
	"در کل",
	// Next
	"بعد",
	// Before
	"قبل",
	// Until the
	"تا",
];

/**
 * Returns function words for Farsi.
 *
 * @returns {Object} Farsi function words.
 */
export default function() {
	return {
		// These word categories are filtered at the ending of word combinations.
		filteredAtEnding: [].concat( ordinalNumerals, generalAdjectivesAdverbs ),

		// These word categories are filtered at the beginning and ending of word combinations.
		filteredAtBeginningAndEnding: [].concat( articles, prepositions, prepositionPrecedingPronouns, coordinatingConjunctions,
			demonstrativePronouns, intensifiers, quantifiers ),

		// These word categories are filtered everywhere within word combinations.
		filteredAnywhere: [].concat( transitionWords, adverbialGenitives, personalPronounsNominative, personalPronounsAccusative,
			reflexivePronouns, interjections, cardinalNumerals, otherAuxiliaries, copula, interviewVerbs,
			delexicalizedVerbs, indefinitePronouns, subordinatingConjunctions, interrogativeDeterminers,
			interrogativePronouns, interrogativeProAdverbs, locativeAdverbs, miscellaneous, prepositionalAdverbs,
			recipeWords, timeWords, monthsOfTheYear, vagueNouns, vocativeParticles, relativePronouns ),

		// These categories are used in the passive voice assessment. If they directly precede a participle, the sentence part is not passive.
		cannotDirectlyPrecedePassiveParticiple: [].concat( articles, prepositions, demonstrativePronouns, ordinalNumerals, quantifiers ),

		/*
		These categories are used in the passive voice assessment. If they appear between an auxiliary and a participle,
		the sentence part is not passive.
		*/
		cannotBeBetweenPassiveAuxiliaryAndParticiple: [].concat( otherAuxiliaries, copula, interviewVerbs, delexicalizedVerbs ),

		// This export contains all of the above words.
		all: [].concat( articles, cardinalNumerals, ordinalNumerals, demonstrativePronouns, reflexivePronouns,
			personalPronounsNominative, personalPronounsAccusative, quantifiers, indefinitePronouns, interrogativeDeterminers,
			interrogativePronouns, interrogativeProAdverbs, locativeAdverbs, adverbialGenitives, prepositionalAdverbs, monthsOfTheYear,
			otherAuxiliaries, copula, prepositions, coordinatingConjunctions, subordinatingConjunctions, interviewVerbs,
			transitionWords, additionalTransitionWords, intensifiers, delexicalizedVerbs, interjections, generalAdjectivesAdverbs,
			recipeWords, vagueNouns, miscellaneous, titlesPreceding, vocativeParticles, relativePronouns, prepositionPrecedingPronouns ),
	};
}
