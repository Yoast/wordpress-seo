// "use strict";
const irregularAdjectives = require( "./irregularAdjectives.js" );
const comparativeRegex = require( "./regexAdjective.js" ).comparative;
const superlativeRegex = require( "./regexAdjective.js" ).superlative;
const comparativeToBaseRegex = require( "./regexAdjective.js" ).comparativeToBase;
const superlativeToBaseRegex = require( "./regexAdjective.js" ).superlativeToBase;

const isUndefined = require( "lodash/isUndefined.js" );
const unique = require( "lodash/uniq" );


/**
 * Checks if the input word occurs in the list of irregular adjectives and if so returns all its irregular forms.
 *
 * @param {string} word The word for which to determine its irregular forms.
 *
 * @returns {Array} Array of word forms from the exception list.
 */
const checkIrregulars = function( word ) {
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
 * Checks if the input word ends with "er".
 *
 * @param {string} word The word to check.
 *
 * @returns {boolean} True if the word ends with "er".
 */
const endsWithEr = function( word ) {
	return word.substring( word.length - 2, word.length ) === "er";
};

/**
 * Checks if the input word ends with "est".
 *
 * @param {string} word The word to check.
 *
 * @returns {boolean} True if the word ends with "est".
 */
const endsWithEst = function( word ) {
	return word.substring( word.length - 3, word.length ) === "est";
};


/**
 * Checks if the input word qualifies for the input regex and if so builds a required form.
 * This function is used for other more specific functions.
 *
 * @param {string} word The word to build forms for.
 * @param {string} regex The regex to compare the word against.
 *
 * @returns {string} The newly built form of the word.
 */
const buildAdjectiveFormFromRegex = function( word, regex ) {
	for ( let i = 0; i < regex.length; i++ ) {
		if ( regex[ i ].reg.test( word ) === true ) {
			return word.replace( regex[ i ].reg, regex[ i ].repl );
		}
	}
};

/**
 * Forms a comparative from the base form.
 *
 * @param {string} word The word to build forms for.
 *
 * @returns {string} The comparative formed from the input word.
 */
const comparative = function( word ) {
	return buildAdjectiveFormFromRegex( word, comparativeRegex );
};

/**
 * Forms a superlative from the base form.
 *
 * @param {string} word The word to build forms for.
 *
 * @returns {string} The superlative formed from the input word.
 */
const superlative = function( word ) {
	return buildAdjectiveFormFromRegex( word, superlativeRegex );
};

/**
 * Forms the base form from the comparative.
 *
 * @param {string} word The word to build forms for.
 *
 * @returns {string} The base form formed from the input word.
 */
const comparativeToBase = function( word ) {
	return buildAdjectiveFormFromRegex( word, comparativeToBaseRegex );
};

/**
 * Forms the base form from the superlative.
 *
 * @param {string} word The word to build forms for.
 *
 * @returns {string} The base form from the input word.
 */
const superlativeToBase = function( word ) {
	return buildAdjectiveFormFromRegex( word, superlativeToBaseRegex );
};

/**
 * Forms the base form from an input word.
 *
 * @param {string} word The word to build the base form for.
 *
 * @returns {string} The base form of the input word.
 */
const getBase = function( word ) {
	if ( endsWithEr( word ) ) {
		return {
			base: comparativeToBase( word ),
			guessedForm: "er",
		};
	}

	if ( endsWithEst( word ) ) {
		return {
			base: superlativeToBase( word ),
			guessedForm: "est",
		};
	}

	return {
		base: word,
		guessedForm: "base",
	};
};

/**
 * Collects all possible verb forms for a given word through checking if it is irregular, base, comparative, or superlative.
 *
 * @param {string} word The word for which to determine its forms.
 *
 * @returns {Array} Array of word forms.
 */
const getAdjectiveForms = function( word ) {
	const irregular = checkIrregulars( word );
	if ( ! isUndefined( irregular ) ) {
		return irregular;
	}

	let forms = [];
	const base = getBase( word ).base;
	// const guessedForm = getBase( word ).guessedForm; //Meant to be used to check if the newly built forms are built correctly.
	forms = forms.concat( word );

	forms.push( base );
	forms.push( comparative( base ) );
	forms.push( superlative( base ) );

	forms = forms.filter( Boolean );
	console.log( forms );
	return unique( forms );
};

module.exports = {
	getAdjectiveForms: getAdjectiveForms,
};
