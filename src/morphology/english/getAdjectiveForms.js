// "use strict";
const countSyllablesInText = require( "../../stringProcessing/syllables/count" );
const createRulesFromMorphologyData = require( "../morphoHelpers/createRulesFromMorphologyData.js" );
const buildOneFormFromRegex = require( "../morphoHelpers/buildFormRule" ).buildOneFormFromRegex;
const buildTwoFormsFromRegex = require( "../morphoHelpers/buildFormRule" ).buildTwoFormsFromRegex;

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
 * Checks if the input word ends with "er".
 *
 * @param {string} word The word to check.
 *
 * @returns {boolean} True if the word ends with "er".
 */
const endsWithEr = function( word ) {
	const wordLength = word.length;
	// Consider only words of four letters or more to be comparatives (otherwise, words like "per" are being treated as comparatives).
	if ( wordLength > 3 ) {
		return word.substring( word.length - 2, word.length ) === "er";
	}
	return false;
};

/**
 * Checks if the input word ends with "est".
 *
 * @param {string} word The word to check.
 *
 * @returns {boolean} True if the word ends with "est".
 */
const endsWithEst = function( word ) {
	const wordLength = word.length;
	// Consider only words of five letters or more to be superlatives (otherwise, words like "test" are being treated as superlatives).
	if ( wordLength > 4 ) {
		return word.substring( word.length - 3, word.length ) === "est";
	}
	return false;
};

/**
 * Checks if the input word ends with "ly".
 *
 * @param {string} word The word to check.
 *
 * @returns {boolean} True if the word ends with "ly".
 */
const endsWithLy = function( word ) {
	const wordLength = word.length;
	// Consider only words of four letters or more to be adjectives (otherwise, words like "lily" are being treated as adjectives).
	if ( wordLength > 3 ) {
		return word.substring( word.length - 2, word.length ) === "ly";
	}
	return false;
};


/**
 * Forms the base form from an input word.
 *
 * @param {string} word The word to build the base form for.
 * @param {Array} comparativeToBaseRegex The Array of regex-based rules to bring comparatives to base.
 * @param {Array} superlativeToBaseRegex The Array of regex-based rules to bring superlatives to base.
 * @param {Array} adverbToBaseRegex The Array of regex-based rules to bring adverbs to base.
 *
 * @returns {string} The base form of the input word.
 */
const getBase = function( word, comparativeToBaseRegex, superlativeToBaseRegex, adverbToBaseRegex ) {
	if ( endsWithEr( word ) ) {
		return {
			base: buildOneFormFromRegex( word, comparativeToBaseRegex ),
			guessedForm: "er",
		};
	}

	if ( endsWithEst( word ) ) {
		return {
			base: buildOneFormFromRegex( word, superlativeToBaseRegex ),
			guessedForm: "est",
		};
	}

	if ( endsWithLy( word ) ) {
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

	let base = getBase( word, comparativeToBaseRegex, superlativeToBaseRegex, adverbToBaseRegex ).base;

	if ( isUndefined( base ) ) {
		base = word;
	}

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

module.exports = {
	getAdjectiveForms: getAdjectiveForms,
	getBase: getBase,
};
