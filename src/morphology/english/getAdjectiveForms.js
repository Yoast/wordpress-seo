// "use strict";
import countSyllablesInText from "../../stringProcessing/syllables/count";
import createRulesFromMorphologyData from "../morphoHelpers/createRulesFromMorphologyData.js";
import { buildOneFormFromRegex, buildTwoFormsFromRegex } from "../morphoHelpers/buildFormRule";

import { isUndefined } from "lodash-es";
import { uniq as unique } from "lodash-es";
import { flatten } from "lodash-es";

/**
 * Checks if the input word occurs in the list of irregular adjectives and if so returns all its irregular forms.
 *
 * @param {string} word The word for which to determine its irregular forms.
 * @param {Array} irregularAdjectives The list of irregular adjectives.
 *
 * @returns {Array} Array of word forms from the exception list.
 */
const checkIrregulars = function( word, irregularAdjectives ) {
	let irregulars;

	irregularAdjectives.forEach( function( paradigm ) {
		paradigm.forEach( function( wordInParadigm ) {
			if ( wordInParadigm === word ) {
				irregulars = paradigm;
			}
		} );
	} );
	return irregulars;
};

/**
 * Checks if the input word is longer than 2 syllables (in this case comparative and superlative forms do not need to be formed).
 *
 * @param {string} word The word for which to determine its length.
 *
 * @returns {boolean} True if the input word is longer than 2 syllables.
 */
const checkWordTooLong = function( word ) {
	return countSyllablesInText( word, "en_EN" ) > 2;
};

/**
 * Checks if the input word can be an adjectival comparative.
 *
 * @param {string}      word            The word to check.
 * @param {string[]}    erExceptions    The list of words that end with -er but are not adjectival comparatives.
 *
 * @returns {boolean} True if the word can be a comparative.
 */
const canBeComparative = function( word, erExceptions ) {
	const wordLength = word.length;

	// Consider only words of four letters or more to be comparatives (otherwise, words like "per" are being treated as comparatives).
	if ( wordLength < 4 ) {
		return false;
	}

	const endsWithEr = word.substring( word.length - 2, word.length ) === "er";

	return endsWithEr && ! erExceptions.includes( word );
};

/**
 * Checks if the input word can be an adjectival superlative.
 *
 * @param {string}      word            The word to check.
 * @param {string[]}    estExceptions   The list of words that end with -est but are not adjectival superlatives.
 *
 * @returns {boolean} True if the word can be a superlative.
 */
const canBeSuperlative = function( word, estExceptions ) {
	const wordLength = word.length;

	// Consider only words of five letters or more to be superlatives (otherwise, words like "test" are being treated as superlatives).
	if ( wordLength < 5 ) {
		return false;
	}

	const endsWithEst = word.substring( word.length - 3, word.length ) === "est";

	return endsWithEst && ! estExceptions.includes( word );
};

/**
 * Checks if the input word can be an adverb with "-ly".
 *
 * @param {string}      word            The word to check.
 * @param {string[]}    lyExceptions    The list of words that end with -ly but are not adverbs.
 *
 * @returns {boolean} True if the word can be an adverb with "-ly".
 */
const canBeLyAdverb = function( word, lyExceptions ) {
	const wordLength = word.length;

	// Consider only words of five letters or more to be adjectives (otherwise, words like "lily" are being treated as adjectives).
	if ( wordLength < 5 ) {
		return false;
	}

	const endsWithLy = word.substring( word.length - 2, word.length ) === "ly";
	return endsWithLy && ! lyExceptions.includes( word );
};


/**
 * Forms the base form from an input word.
 *
 * @param {string}  word                            The word to build the base form for.
 * @param {Array}   comparativeToBaseRegex          The Array of regex-based rules to bring comparatives to base.
 * @param {Array}   superlativeToBaseRegex          The Array of regex-based rules to bring superlatives to base.
 * @param {Array}   adverbToBaseRegex               The Array of regex-based rules to bring adverbs to base.
 * @param {Object}  stopAdjectives                  The lists of words that are not adverbs.
 * @param {string[]}  stopAdjectives.erExceptions   The list of words that end with -er and are not comparatives.
 * @param {string[]}  stopAdjectives.estExceptions  The list of words that end with -est and are not comparatives.
 * @param {string[]}  stopAdjectives.lyExceptions   The list of words that end with -ly and are not adverbs.
 *
 * @returns {string} The base form of the input word.
 */
const getBase = function( word, comparativeToBaseRegex, superlativeToBaseRegex, adverbToBaseRegex, stopAdjectives ) {
	if ( canBeComparative( word, stopAdjectives.erExceptions ) ) {
		return {
			base: buildOneFormFromRegex( word, comparativeToBaseRegex ) || word,
			guessedForm: "er",
		};
	}

	if ( canBeSuperlative( word, stopAdjectives.estExceptions ) ) {
		return {
			base: buildOneFormFromRegex( word, superlativeToBaseRegex ) || word,
			guessedForm: "est",
		};
	}

	if ( canBeLyAdverb( word, stopAdjectives.lyExceptions ) ) {
		return {
			base: buildOneFormFromRegex( word, adverbToBaseRegex ),
			guessedForm: "ly",
		};
	}

	return {
		base: word,
		guessedForm: "base",
	};
};

/**
 * Collects all possible verb forms for a given word through checking if it is irregular, base, adverb,
 * adverb ending in -ically, comparative, or superlative.
 *
 * @param {string} word The word for which to determine its forms.
 * @param {Object} adjectiveData The morphologyData available for this language.
 *
 * @returns {Array} Array of word forms.
 */
const getAdjectiveForms = function( word, adjectiveData ) {
	const irregular = checkIrregulars( word, adjectiveData.irregularAdjectives );
	if ( ! isUndefined( irregular ) ) {
		return irregular;
	}

	let forms = [];

	const regexAdjective = adjectiveData.regexAdjective;
	const ically = buildTwoFormsFromRegex( word, createRulesFromMorphologyData( regexAdjective.icallyAdverbs ) );
	if ( ! isUndefined( ically ) ) {
		return ically.concat( word );
	}

	const comparativeToBaseRegex = createRulesFromMorphologyData( regexAdjective.comparativeToBase );
	const superlativeToBaseRegex = createRulesFromMorphologyData( regexAdjective.superlativeToBase );
	const adverbToBaseRegex = createRulesFromMorphologyData( regexAdjective.adverbToBase );
	const stopAdjectives = adjectiveData.stopAdjectives;

	const base = getBase( word, comparativeToBaseRegex, superlativeToBaseRegex, adverbToBaseRegex, stopAdjectives ).base || word;

	// Const guessedForm = getBase( word ).guessedForm; //Meant to be used to check if the newly built forms are built correctly.
	forms = forms.concat( word );

	forms.push( base );
	forms.push( buildOneFormFromRegex( base, createRulesFromMorphologyData( regexAdjective.adverb ) ) );

	const noComparativeOrSuperlative = new RegExp( regexAdjective.noComparativeOrSuperlative, "i" );
	if ( checkWordTooLong( base ) === true || noComparativeOrSuperlative.test( base ) === true ) {
		return unique( forms.filter( Boolean ) );
	}

	forms.push( buildOneFormFromRegex( base, createRulesFromMorphologyData( regexAdjective.comparative ) ) );
	forms.push( buildOneFormFromRegex( base, createRulesFromMorphologyData( regexAdjective.superlative ) ) );

	return unique( flatten( forms.filter( Boolean ) ) );
};

export {
	getAdjectiveForms,
	getBase,
};
