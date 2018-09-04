let filteredPassiveAuxiliaries = require( "./passiveVoice/auxiliaries.js" )().filteredAuxiliaries;
let notFilteredPassiveAuxiliaries = require( "./passiveVoice/auxiliaries.js" )().notFilteredAuxiliaries;
let transitionWords = require( "./transitionWords.js" )().singleWords;

/**
 * Returns an object with exceptions for the prominent words researcher
 * @returns {Object} The object filled with exception arrays.
 */

let articles = [ "the", "an", "a" ];
let cardinalNumerals = [ "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen",
	"fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty", "hundred", "hundreds", "thousand", "thousands",
	"million", "millions", "billion", "billions" ];

let ordinalNumerals = [ "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth",
	"eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth", "sixteenth", "seventeenth", "eighteenth",
	"nineteenth", "twentieth" ];

let personalPronounsNominative = [ "i", "you", "he", "she", "it", "we", "they" ];
let personalPronounsAccusative = [ "me", "him", "us", "them" ];
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

let interrogativeDeterminers = [ "which", "what", "whose" ];
let interrogativePronouns = [ "who", "whom" ];
let interrogativeProAdverbs = [ "where", "how", "why", "whether", "wherever", "whyever", "wheresoever", "whensoever", "howsoever",
	"whysoever", "whatsoever", "whereso", "whomso", "whenso", "howso", "whyso", "whoso", "whatso" ];
let pronominalAdverbs = [ "therefor", "therein", "hereby", "hereto", "wherein", "therewith", "herewith", "wherewith", "thereby" ];
let locativeAdverbs = [ "there", "here", "whither", "thither", "hither", "whence", "thence" ];
let adverbialGenitives = [ "always", "once", "twice", "thrice" ];
let otherAuxiliaries = [ "can", "cannot", "can't", "could", "couldn't", "could've", "dare", "dares", "dared", "do",
	"don't", "does", "doesn't", "did", "didn't", "done", "have", "haven't", "had", "hadn't", "has", "hasn't",
	"i've", "you've", "we've", "they've", "i'd", "you'd", "he'd", "she'd", "it'd", "we'd", "they'd", "would", "wouldn't",
	"would've", "may", "might", "must", "need", "needn't", "needs", "ought", "shall", "shalln't", "shan't", "should",
	"shouldn't", "will", "won't", "i'll", "you'll", "he'll", "she'll", "it'll", "we'll", "they'll", "there's", "there're",
	"there'll", "here's", "here're", "there'll" ];
let copula = [ "appear", "appears", "appeared", "become", "becomes", "became", "come", "comes", "came", "keep", "keeps", "kept",
	"remain", "remains", "remained", "stay", "stays", "stayed", "turn", "turns", "turned" ];

// These verbs should only be included at the beginning of combinations.
let continuousVerbs = [ "doing", "daring", "having", "appearing", "becoming", "coming", "keeping", "remaining", "staying",
	"saying", "asking", "stating", "seeming", "letting", "making", "setting", "showing", "putting", "adding", "going", "using",
	"trying", "containing" ];

let prepositions = [ "in", "from", "with", "under", "throughout", "atop", "for", "on", "of", "to", "aboard", "about",
	"above", "abreast", "absent", "across", "adjacent", "after", "against", "along", "alongside", "amid", "mid",
	"among", "apropos", "apud", "around", "as", "astride", "at", "ontop", "afore", "tofore", "behind", "ahind",
	"below", "ablow", "beneath", "neath", "beside", "between", "atween", "beyond", "ayond", "by", "chez",
	"circa", "spite", "down", "except", "into", "less", "like", "minus", "near", "nearer", "nearest", "anear", "notwithstanding",
	"off", "onto", "opposite", "out", "outen", "over", "past", "per", "pre", "qua", "sans", "sauf", "sithence", "through",
	"thru", "truout", "toward", "underneath", "up", "upon", "upside", "versus", "via", "vis-à-vis", "without", "ago",
	"apart", "aside", "aslant", "away", "withal", "towards", "amidst", "amongst", "midst", "whilst" ];

// Many prepositional adverbs are already listed as preposition.
let prepositionalAdverbs = [ "back", "within", "forward", "backward", "ahead" ];

let coordinatingConjunctions = [ "and", "or", "and/or", "yet" ];

// 'sooner' is part of 'no sooner...than', 'just' is part of 'just as...so',
// 'Only' is part of 'not only...but also'.
let correlativeConjunctions = [ "sooner", "just", "only" ];
let subordinatingConjunctions = [ "if", "even" ];

// These verbs are frequently used in interviews to indicate questions and answers.
// 'Claim','claims', 'state' and 'states' are not included, because these words are also nouns.
let interviewVerbs = [ "say", "says", "said", "claimed", "ask", "asks", "asked", "stated", "explain", "explains", "explained",
	"think", "thinks", "talks", "talked", "announces", "announced", "tells", "told", "discusses", "discussed", "suggests",
	"suggested", "understands", "understood" ];

// These transition words were not included in the list for the transition word assessment for various reasons.
let additionalTransitionWords = [ "again", "definitely", "eternally", "expressively", "instead",
	"expressly", "immediately", "including", "instantly", "namely", "naturally", "next", "notably", "now", "nowadays",
	"ordinarily", "positively", "truly", "ultimately", "uniquely", "usually", "almost", "maybe",
	"probably", "granted", "initially", "too", "actually", "already", "e.g", "i.e", "often", "regularly", "simply",
	"optionally", "perhaps", "sometimes", "likely", "never", "ever", "else", "inasmuch", "provided", "currently", "incidentally",
	"elsewhere", "particular", "recently", "relatively", "f.i", "clearly", "apparently" ];

let intensifiers = [ "highly", "very", "really", "extremely", "absolutely", "completely", "totally", "utterly", "quite",
	"somewhat", "seriously", "fairly", "fully", "amazingly" ];

/* These verbs convey little meaning. 'Show', 'shows', 'uses', 'meaning', 'set', 'sets'
 are not included, because these words could be relevant nouns.

 */
let delexicalizedVerbs = [ "seem", "seems", "seemed", "let", "let's", "lets", "make", "makes", "made", "want", "showed", "shown",
	"go", "goes", "went", "gone", "take", "takes", "took", "taken",	"put", "puts", "use", "used", "try", "tries", "tried", "mean",
	"means", "meant", "called", "based", "add", "adds", "added", "contain", "contains", "contained", "consist", "consists",
	"consisted", "ensure", "ensures", "ensured" ];

// These adjectives and adverbs are so general, they should never be suggested as a (single) keyword.
// Keyword combinations containing these adjectives/adverbs are fine.
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
