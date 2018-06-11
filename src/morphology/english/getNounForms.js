// "use strict";
const irregularNouns = require( "./irregularNouns.js" );
const singularizeRegex = require( "./regexNoun.js" ).singularizeRegex;
const pluralizeRegex = require( "./regexNoun.js" ).pluralizeRegex;
const hispanicRegex = require( "./regexNoun.js" ).hispanicRegex;

const isUndefined = require( "lodash/isUndefined.js" );
const unique = require( "lodash/uniq" );

/**
 * Checks if the input word occurs in the list of exception nouns and if so returns all its irregular forms.
 *
 * @param {string} word The word for which to determine its irregular forms.
 *
 * @returns {Array} Array of word forms from the exception list.
 */
const checkIrregulars = function( word ) {
	let irregulars;

	irregularNouns.forEach( function( paradigm ) {
		paradigm.forEach( function( wordInParadigm ) {
			if ( wordInParadigm === word ) {
				irregulars = paradigm;
			}
		} );
	} );
	return irregulars;
};

/**
 * Checks if the input word qualifies as a hispanic noun (e.g. volcano) that can take two different plural forms
 * (e.g. volcanos and volcanoes) and returns these forms.
 *
 * @param {string} word The word for which to determine its forms.
 *
 * @returns {Array} Array of word forms.
 */
const checkHispanic = function( word ) {
	for ( let i = 0; i < hispanicRegex.length; i++ ) {
		if ( hispanicRegex[ i ].reg.test( word ) === true ) {
			return [
				word.replace( hispanicRegex[ i ].reg, hispanicRegex[ i ].repl1 ),
				word.replace( hispanicRegex[ i ].reg, hispanicRegex[ i ].repl2 ),
			];
		}
	}
};

/**
 * Checks if the input word qualifies as a plural noun (e.g. students) and returns its singular form (e.g., student).
 *
 * @param {string} word The word for which to determine its forms.
 *
 * @returns {Array} Array of word forms.
 */
const singularize = function( word ) {
	for ( let i = 0; i < singularizeRegex.length; i++ ) {
		if ( singularizeRegex[ i ].reg.test( word ) === true ) {
			return word.replace( singularizeRegex[ i ].reg, singularizeRegex[ i ].repl );
		}
	}
};

/**
 * Checks if the input word qualifies as a singular noun (e.g. student) and returns its plural form (e.g., students).
 *
 * @param {string} word The word for which to determine its forms.
 *
 * @returns {Array} Array of word forms.
 */
const pluralize = function( word ) {
	for ( let i = 0; i < pluralizeRegex.length; i++ ) {
		if ( pluralizeRegex[ i ].reg.test( word ) === true ) {
			return word.replace( pluralizeRegex[ i ].reg, pluralizeRegex[ i ].repl );
		}
	}
};


/**
 * Collects all possible noun forms for a given word through checking if it is irregular, hispanic, singular or plural.
 *
 * @param {string} word The word for which to determine its forms.
 *
 * @returns {Array} Array of word forms.
 */
const getNounForms = function( word ) {
	let forms = [];

	const irregular = checkIrregulars( word );
	if ( ! isUndefined( irregular ) ) {
		return unique( forms.concat( irregular ) );
	}

	forms = forms.concat( word );

	const hispanic = checkHispanic( word );
	if ( ! isUndefined( hispanic ) ) {
		forms.push( hispanic[ 0 ], hispanic[ 1 ] );
	}

	const singular = singularize( word );
	if ( ! isUndefined( singular ) ) {
		forms.push( singular );
	}

	const plural = pluralize( word );
	if ( ! isUndefined( plural ) ) {
		forms.push( plural );
	}

	return unique( forms );
};

module.exports = {
	getNounForms: getNounForms,
	checkHispanic: checkHispanic,
};

