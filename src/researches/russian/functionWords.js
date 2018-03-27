let transitionWords = require( "./transitionWords.js" )().singleWords;

/**
 * Returns an object with exceptions for the prominent words researcher
 * @returns {Object} The object filled with exception arrays.
 */

// Verbs
let filteredPassiveAuxiliaries = [ "быть" ];
let otherAuxiliaries = [ "мочь", "решиться", "делать", "иметь", "следовало", "следует", "необходимо", "нужно", "обязан",
	"должен", "имеется" ];
let copula = [ "появиться", "появляться", "стать", "становиться", "прийти", "приходить", "держать", "содержать", "оставаться",
	"изменяться", "становиться" ];
// These verbs are frequently used in interviews to indicate questions and answers.
let interviewVerbs = [ "сказать", "говорить", "объявить", "заявить", "спросить", "указать", "объяснить", "подумать", "думать",
	"говорить", "рассказывать", "рассказать", "обсудить", "предложить", "понимать" ];
let delexicalizedVerbs = [ "казаться", "давайте", "давай", "хотеть", "показать", "показывать", "идти", "брать", "класть",
	"использовать", "пробовать", "попробовать", "иметь", "означать", "добавлять", "содержать", "состоять", "убеждаться", "убеждать" ];

// Numerals
let cardinalNumerals = [ "один", "два", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять", "десять", "одиннадцать",
	"двенадцать", "тринадцать", "четырнадцать", "пятнадцать", "шестнадцать", "семнадцать", "восемнадцать", "девятнадцать",
	"двадцать", "тридцать", "сорок", "пятьдесят", "шестьдесят", "семьдесят", "восемьдесят", "девяносто", "сто", "сотни",
	"двести", "триста", "четыреста", "пятьсот", "шестьсот", "семьсот", "восемьсот", "девятьсот", "тысяча", "миллион", "миллиард" ];

let ordinalNumerals = [  ];

// Pronouns (in all cases)
let personalPronouns = [ "i", "you", "he", "she", "it", "we", "they" ];
let demonstrativePronouns = [ "this", "that", "these", "those" ];
let possessivePronouns = [ "my", "your", "his", "her", "its", "their", "our", "mine", "yours", "hers", "theirs", "ours" ];
let quantifiers = [ "all", "some", "many", "lot", "lots", "ton", "tons", "bit", "no", "every", "enough", "little",
	"much", "more", "most", "plenty", "several", "few", "fewer", "kind", "kinds" ];
let reflexivePronouns = [ "myself", "yourself", "himself", "herself", "itself", "oneself", "ourselves", "yourselves", "themselves" ];
let indefinitePronouns = [ "none", "nobody", "everyone", "everybody", "someone", "somebody", "anyone", "anybody", "nothing",
	"everything", "something", "anything", "each", "other", "whatever", "whichever", "whoever", "whomever",
	"whomsoever", "whosoever", "others", "neither", "both", "either", "any", "such" ];
let indefinitePronounsPossessive  = [ "one's", "nobody's", "everyone's", "everybody's", "someone's", "somebody's", "anyone's",
	"anybody's", "nothing's", "everything's", "something's", "anything's", "whoever's", "others'", "other's", "another's",
	"neither's", "either's" ];

// Interrogatives, adverbs, intensifiers, adjectives
let interrogativeDeterminers = [ "which", "what", "whose" ];
let interrogativePronouns = [ "who", "whom" ];
let interrogativeProAdverbs = [ "where", "how", "why", "whether", "wherever", "whyever", "wheresoever", "whensoever", "howsoever",
	"whysoever", "whatsoever", "whereso", "whomso", "whenso", "howso", "whyso", "whoso", "whatso" ];
let pronominalAdverbs = [ "therefor", "therein", "hereby", "hereto", "wherein", "therewith", "herewith", "wherewith", "thereby" ];
let locativeAdverbs = [ "there", "here", "whither", "thither", "hither", "whence", "thence" ];
let adverbialGenitives = [ "always", "once", "twice", "thrice" ];
let intensifiers = [ "highly", "very", "really", "extremely", "absolutely", "completely", "totally", "utterly", "quite",
	"somewhat", "seriously", "fairly", "fully", "amazingly" ];
let generalAdjectivesAdverbs = [ "new", "newer", "newest", "old", "older", "oldest", "previous", "good", "well", "better", "best",
	"big", "bigger", "biggest", "easy", "easier", "easiest", "fast", "faster", "fastest", "far", "hard", "harder", "hardest",
	"least", "own", "large", "larger", "largest", "long", "longer", "longest", "low", "lower", "lowest", "high", "higher",
	"highest", "regular", "simple", "simpler", "simplest", "small", "smaller", "smallest", "tiny", "tinier", "tiniest",
	"short", "shorter", "shortest", "main", "actual", "nice", "nicer", "nicest", "real", "same", "able", "certain", "usual",
	"so-called", "mainly", "mostly", "recent", "anymore", "complete", "lately", "possible", "commonly", "constantly",
	"continually", "directly", "easily", "nearly", "slightly", "somewhere", "estimated", "latest", "different", "similar",
	"widely", "bad", "worse", "worst", "great", "specific",  "available", "average", "awful", "awesome", "basic", "beautiful",
	"busy", "current", "entire", "everywhere", "important", "major", "multiple", "normal", "necessary", "obvious", "partly",
	"special", "last", "early", "earlier", "earliest", "young", "younger", "youngest", "" ];

// Prepositions
let prepositions = [ "in", "from", "with", "under", "throughout", "atop", "for", "on", "of", "to", "aboard", "about",
	"above", "abreast", "absent", "across", "adjacent", "after", "against", "along", "alongside", "amid", "mid",
	"among", "apropos", "apud", "around", "as", "astride", "at", "ontop", "afore", "tofore", "behind", "ahind",
	"below", "ablow", "beneath", "neath", "beside", "between", "atween", "beyond", "ayond", "by", "chez",
	"circa", "spite", "down", "except", "into", "less", "like", "minus", "near", "nearer", "nearest", "anear", "notwithstanding",
	"off", "onto", "opposite", "out", "outen", "over", "past", "per", "pre", "qua", "sans", "sauf", "sithence", "through",
	"thru", "truout", "toward", "underneath", "up", "upon", "upside", "versus", "via", "vis-à-vis", "without", "ago",
	"apart", "aside", "aslant", "away", "withal", "towards", "amidst", "amongst", "midst", "whilst" ];
let prepositionalAdverbs = [ "back", "within", "forward", "backward", "ahead" ];

// Conjunctions (also covered by transition words
let coordinatingConjunctions = [ "and", "or", "and/or", "yet" ];
// First parts of two-part transition words
let correlativeConjunctions = [ "sooner", "just", "only" ];
let subordinatingConjunctions = [ "if", "even" ];

let interjections = [ "oh", "wow", "tut-tut", "tsk-tsk", "ugh", "whew", "phew", "yeah", "yea", "shh", "oops", "ouch", "aha",
	"yikes" ];

// These words and abbreviations are frequently used in recipes in lists of ingredients.
let recipeWords = [ "tbs", "tbsp", "spk", "lb", "qt", "pk", "bu", "oz", "pt", "mod", "doz", "hr", "f.g", "ml", "dl", "cl",
	"l", "mg", "g", "kg", "quart" ];

let timeWords = [ "seconds", "minute", "minutes", "hour", "hours", "day", "days", "week", "weeks", "month", "months",
	"year", "years", "today", "tomorrow", "yesterday" ];

// 'People' should only be removed in combination with 'some', 'many' and 'few' (and is therefore not yet included in the list below).
let vagueNouns = [ "thing", "things", "way", "ways", "matter", "case", "likelihood", "ones", "piece", "pieces", "stuff", "times",
	"part", "parts", "percent", "instance", "instances", "aspect", "aspects", "item", "items", "idea", "theme", "person", "instance",
	"instances", "detail", "details", "factor", "factors", "difference", "differences" ];

// 'No' is already included in the quantifier list.
let miscellaneous = [ "not", "yes", "sure", "top", "bottom", "ok", "okay", "amen", "aka", "etc", "etcetera", "sorry", "please" ];

let titlesPreceding = [ "ms", "mss", "mrs", "mr", "dr", "prof" ];

let titlesFollowing = [ "jr", "sr" ];

module.exports = function() {
	return {
		// These word categories are filtered at the ending of word combinations.
		filteredAtEnding: [].concat( ordinalNumerals, generalAdjectivesAdverbs ),

		// These word categories are filtered at the beginning and ending of word combinations.
		filteredAtBeginningAndEnding: [].concat( prepositions, coordinatingConjunctions, demonstrativePronouns, intensifiers,
			quantifiers, possessivePronouns ),

		// These word categories are filtered everywhere within word combinations.
		filteredAnywhere: [].concat( transitionWords, adverbialGenitives, personalPronouns,
			reflexivePronouns, interjections, cardinalNumerals, filteredPassiveAuxiliaries, otherAuxiliaries, copula, interviewVerbs,
			delexicalizedVerbs, indefinitePronouns, correlativeConjunctions, subordinatingConjunctions, interrogativeDeterminers,
			interrogativePronouns, interrogativeProAdverbs, locativeAdverbs, miscellaneous, prepositionalAdverbs, pronominalAdverbs,
			recipeWords, timeWords, vagueNouns ),

		// These categories are used in the passive voice assessment. If they directly precede a participle, the sentence part is not passive.
		cannotDirectlyPrecedePassiveParticiple: [].concat( prepositions, demonstrativePronouns, possessivePronouns, ordinalNumerals,
			quantifiers ),

		/*
		These categories are used in the passive voice assessment. If they appear between an auxiliary and a participle,
		the sentence part is not passive.
		*/
		cannotBeBetweenPassiveAuxiliaryAndParticiple: [].concat( otherAuxiliaries, copula, interviewVerbs, delexicalizedVerbs ),

		// This export contains all of the above words.
		all: [].concat( cardinalNumerals, ordinalNumerals, demonstrativePronouns, possessivePronouns, reflexivePronouns,
			personalPronouns, quantifiers, indefinitePronouns, indefinitePronounsPossessive, interrogativeDeterminers,
			interrogativePronouns, interrogativeProAdverbs,
			pronominalAdverbs, locativeAdverbs, adverbialGenitives, prepositionalAdverbs, filteredPassiveAuxiliaries,
			otherAuxiliaries, copula, prepositions, coordinatingConjunctions, correlativeConjunctions, subordinatingConjunctions, interviewVerbs,
			transitionWords, intensifiers, delexicalizedVerbs, interjections, generalAdjectivesAdverbs,
			recipeWords, vagueNouns, miscellaneous, titlesPreceding, titlesFollowing ),
	};
};
