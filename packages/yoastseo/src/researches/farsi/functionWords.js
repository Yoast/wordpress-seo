/**
 * Returns an object with exceptions for the prominent words researcher
 * @returns {Object} The object filled with exception arrays.
 */
const articles = [  ];

const cardinalNumerals = [ "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه", "ده", "یازده", "دوازده", "سیزده", "چهارده", "پانزده",
	"شانزده", "هفده", "هجده", "نوزده", "بیست", "صد", "هزار", "میلیون", "میلیارد" ];

const ordinalNumerals = [ "اول", "اوّل", "دوم", "سوم", "چهارم", "پنجم", "ششم", "هفتم", "هشتم", "نهم", "دهم", "یازدهم", "دوازدهم",
	"سیزدهم", "چهاردهم", "پانزدهم", "شانزدهم", "هفدهم", "هجدهم", "نوزدهم", "بیستم" ];

const personalPronounsNominative = [  ];

const personalPronounsAccusative = [  ];

const demonstrativePronouns = [  ];

const vocativeParticles = [  ];

const quantifiers = [  ];

const reflexivePronouns = [  ];

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

const vagueNouns = [  ];

const miscellaneous = [ ];

const titlesPreceding = [ ];

const transitionWords = [ ];

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
			recipeWords, timeWords, vagueNouns, vocativeParticles, relativePronouns ),

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
			interrogativePronouns, interrogativeProAdverbs, locativeAdverbs, adverbialGenitives, prepositionalAdverbs,
			otherAuxiliaries, copula, prepositions, coordinatingConjunctions, subordinatingConjunctions, interviewVerbs,
			transitionWords, additionalTransitionWords, intensifiers, delexicalizedVerbs, interjections, generalAdjectivesAdverbs,
			recipeWords, vagueNouns, miscellaneous, titlesPreceding, vocativeParticles, relativePronouns, prepositionPrecedingPronouns ),
	};
}
