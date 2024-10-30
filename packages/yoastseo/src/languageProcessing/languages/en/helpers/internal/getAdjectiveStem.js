import { languageProcessing } from "yoastseo";
import { countSyllablesInWord } from "../../../../helpers/syllables/countSyllables";
import syllables from "../../config/syllables.json";
const { buildFormRule, createRulesFromArrays } = languageProcessing;

/**
 * Further checks if the word can be a specific adjectival form.
 *
 * @param {string} word		The word to check.
 * @param {string} endsWith	The ending of the form.
 * @param {string[]} nonStemmingExceptions		The list of words ending with the form that are not this form.
 * @param {string[]} forcedStemmingExceptions	The list of words ending with the form that are not caught by the regular rules.
 *
 * @returns {boolean} Whether the word can be a specific adjectival form.
 */
const refineAdjectiveCheck = ( word, endsWith, nonStemmingExceptions, forcedStemmingExceptions ) => {
	const countSyllables = countSyllablesInWord( word, syllables );
	/*
	 * This check is based on the regular comparative and superlative formation rules.
	 * One syllable adjectives receive -er and -est. The syllable count of the comparative/superlative form is 2.
	 * One/two syllable adjectives ending in -e receive -r and -st. The syllable count of the comparative/superlative form is 2.
	 * Two syllable adjectives ending in -y receive -ier and -iest. The syllable count of the comparative/superlative form is 3.
	 * Words ending in -er/-est that don't follow the above rules are not comparatives/superlatives, unless listed in the exception lists.
	 */
	if ( word.endsWith( endsWith ) ) {
		// Words with one syllable or less can't be comparatives/superlatives.
		if ( countSyllables <= 1 ) {
			return false;
		}
		// The suffix for adjectives ending in -y is -ier/-iest.
		const adjectiveEndingInYSuffix = `i${ endsWith }`;
		// Checks if the word is an adjective ending in -y that can have suffixes -er/-est. For example, 'pretty'.
		const isStemEndingInY = word.endsWith( adjectiveEndingInYSuffix );
		// Checks if the word is an adjective longer than one syllable that can have suffixes -er/-est (e.g. 'shallow'), OR
		// if the word is an adjective ending in -y containing more than two syllables that can have suffixes -ier/-iest (e.g. 'unlikely').
		const isForcedStemmingException = forcedStemmingExceptions.includes( word.slice( 0, -adjectiveEndingInYSuffix.length ) ) ||
			forcedStemmingExceptions.includes( word.slice( 0, -endsWith.length ) );
		// Check if the word ending in -er/-est is not a comparative/superlative (e.g. 'banner').
		const isNonStemmingException = nonStemmingExceptions.includes( word );
		// The maximum syllable count for a word to be a comparative/superlative is 2, unless it ends in -y, then it's 3.
		const maxSyllables = isStemEndingInY ? 3 : 2;

		if ( isForcedStemmingException || ( countSyllables <= maxSyllables && ! isNonStemmingException ) ) {
			return true;
		}
	}
	return false;
};

/**
 * Checks if the word ends with a specific form and is not in the exceptions list.
 *
 * @param {string} word		The word to check.
 * @param {string} endsWith	The ending of the form.
 * @param {string[]} nonStemmingExceptions 	The list of words ending with the form that are not this form.
 * @returns {boolean} Whether the word ends with the form and is not in the exceptions list.
 */
const endsWithAndNoException = ( word, endsWith, nonStemmingExceptions ) => word.endsWith( endsWith ) && ! nonStemmingExceptions.includes( word );

/**
 * Constructs a function that checks if the input word can be a specific adjectival form.
 *
 * @param {string}      endsWith            How the form ends.
 * @param {int}         minimumWordLength   How long the word should be to classify for this form.
 * @param {string[]}    [nonStemmingExceptions=[]]		The list of words with that ending (endsWith) which are not this form.
 * @param {string[]}	[forcedStemmingExceptions=[]]	The list of words with that ending (endsWith) which are not caught by the regular rules.
 * @param {Function}    [checkFunction=endsWithAndNoException]	An extra check to determine if the word is this form.
 *
 * @returns {Function} A function that checks if the input word can be a specific adjectival form.
 */
const constructCanBeFunction = function(
	endsWith,
	minimumWordLength,
	nonStemmingExceptions = [],
	forcedStemmingExceptions = [],
	checkFunction = endsWithAndNoException
) {
	return word => {
		const wordLength = word.length;

		if ( wordLength < minimumWordLength ) {
			return false;
		}
		return checkFunction( word, endsWith, nonStemmingExceptions, forcedStemmingExceptions );
	};
};

/**
 * Forms the base form from an input word.
 *
 * @param {string}   word                                  The word to build the base form for.
 * @param {Object}   regexAdjective                        The lists of regexes to apply to stem adjectives.
 * @param {Array}    regexAdjective.comparativeToBaseRegex The Array of regex-based rules to bring comparatives to base.
 * @param {Array}    regexAdjective.superlativeToBaseRegex The Array of regex-based rules to bring superlatives to base.
 * @param {Array}    regexAdjective.adverbToBaseRegex      The Array of regex-based rules to bring adverbs to base.
 * @param {Object}   stopAdjectives                        The lists of words that are not adverbs.
 * @param {string[]} stopAdjectives.erExceptions           The list of words that end with -er and are not comparatives.
 * @param {string[]} stopAdjectives.estExceptions          The list of words that end with -est and are not superlatives.
 * @param {string[]} stopAdjectives.lyExceptions           The list of words that end with -ly and are not adverbs.
 * @param {string[]} multiSyllableAdjWithSuffixes          The list of adjectives containing more than 2 syllables that can have suffixes.
 *
 * @returns {Object} The base form of the input word.
 */
export default function( word, regexAdjective, stopAdjectives, multiSyllableAdjWithSuffixes ) {
	/*
	 * Check comparatives: Consider only words of four letters or more (otherwise, words like "per" are being treated
	 * as comparatives).
	 */
	const canBeComparative = constructCanBeFunction( "er", 4, stopAdjectives.erExceptions, multiSyllableAdjWithSuffixes, refineAdjectiveCheck );
	if ( canBeComparative( word ) ) {
		const comparativeToBaseRegex = createRulesFromArrays( regexAdjective.comparativeToBase );
		return {
			base: buildFormRule( word, comparativeToBaseRegex ) || word,
			guessedForm: "er",
		};
	}

	/*
	 * Check superlatives: Consider only words of five letters or more (otherwise, words like "test" are being treated
	 * as superlatives).
	 */
	const canBeSuperlative = constructCanBeFunction( "est", 5, stopAdjectives.estExceptions, multiSyllableAdjWithSuffixes, refineAdjectiveCheck );
	if ( canBeSuperlative( word ) ) {
		const superlativeToBaseRegex = createRulesFromArrays( regexAdjective.superlativeToBase );
		return {
			base: buildFormRule( word, superlativeToBaseRegex ) || word,
			guessedForm: "est",
		};
	}

	/*
	 * Check ly-adverbs: Consider only words of five letters or more (otherwise, words like "lily" are being treated
	 * as ly-adverbs).
	 */
	const canBeLyAdverb = constructCanBeFunction( "ly", 5, stopAdjectives.lyExceptions );
	if ( canBeLyAdverb( word ) ) {
		const adverbToBaseRegex = createRulesFromArrays( regexAdjective.adverbToBase );
		return {
			base: buildFormRule( word, adverbToBaseRegex ),
			guessedForm: "ly",
		};
	}

	return {
		base: word,
		guessedForm: "base",
	};
}
