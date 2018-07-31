// "use strict";
const englishMorphology = require( "./englishMorphology.json" );
import createRulesFromArrays from "../createRulesFromJsonArrays.js";

const irregularNouns = englishMorphology.irregularNouns;
const possessiveToBaseRegex = createRulesFromArrays( englishMorphology.regexNoun.possessiveToBase );
const baseToPossessiveRegex = createRulesFromArrays( englishMorphology.regexNoun.baseToPossessive );
const singularizeRegex = createRulesFromArrays( englishMorphology.regexNoun.singularize );
const pluralizeRegex = createRulesFromArrays( englishMorphology.regexNoun.pluralize );
const hispanicRegex = createRulesFromArrays( englishMorphology.regexNoun.hispanic );

const isUndefined = require( "lodash/isUndefined.js" );
const unique = require( "lodash/uniq" );
const flatten = require( "lodash/flatten" );

/**
 * Checks if the input word is a possessive form (e.g., "boy's" in "the boy's car") and returns true if that is the case.
 *
 * @param {string} word The word for which to determine if it's a possessive.
 *
 * @returns {boolean} Whether the input word is a possessive form or not.
 */
const checkPossessive = function( word ) {
	for ( let i = 0; i < possessiveToBaseRegex.length; i++ ) {
		if ( possessiveToBaseRegex[ i ].reg.test( word ) ) {
			return true;
		}
	}
};

/**
 * Returns the base form for the input possessive (e.g., "boy's" > "boy").
 *
 * @param {string} word The word for which to build the base form.
 *
 * @returns {string} The base form of the input possessive.
 */
const getBaseFromPossessive = function( word ) {
	for ( let i = 0; i < possessiveToBaseRegex.length; i++ ) {
		if ( possessiveToBaseRegex[ i ].reg.test( word ) === true ) {
			return word.replace( possessiveToBaseRegex[ i ].reg, possessiveToBaseRegex[ i ].repl );
		}
	}
};

/**
 * Returns the possessive form for the input word (e.g., "boy" > "boy's"; "boys" > "boys'").
 *
 * @param {string} word The word for which to determine its forms.
 *
 * @returns {Array} The possessive forms of the input word.
 */
const getPossessiveFromBase = function( word ) {
	for ( let i = 0; i < baseToPossessiveRegex.length; i++ ) {
		if ( baseToPossessiveRegex[ i ].reg.test( word ) === true ) {
			return [
				word.replace( baseToPossessiveRegex[ i ].reg, baseToPossessiveRegex[ i ].repl1 ),
				word.replace( baseToPossessiveRegex[ i ].reg, baseToPossessiveRegex[ i ].repl2 ),
			];
		}
	}
};

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
	let forms = [].concat( word );
	let base = word;

	const baseIfPossessive = getBaseFromPossessive( word );
	if ( ! isUndefined( baseIfPossessive ) ) {
		base = baseIfPossessive;
		forms = forms.concat( base );
	}

	const irregular = checkIrregulars( base );
	if ( ! isUndefined( irregular ) ) {
		return irregular;
	}

	const hispanic = checkHispanic( base );
	if ( ! isUndefined( hispanic ) ) {
		forms.push( hispanic[ 0 ], hispanic[ 1 ] );
		return forms;
	}

	const singular = singularize( base );
	if ( ! isUndefined( singular ) ) {
		forms.push( singular );
	}

	const plural = pluralize( base );
	if ( ! isUndefined( plural ) ) {
		forms.push( plural );
	}

	return unique( forms );
};

/**
 * Collects all possible noun forms for a given word through checking if it is irregular, hispanic, or regular.
 * Returns the irregular paradigm, singular, and plural, and possessive forms for all these.
 *
 * @param {string} word The word to collect all forms for.
 *
 * @returns {Array} Array of all word forms including possessives.
 */
const getNounFormsWithPossessives = function( word ) {
	let forms = getNounForms( word );

	/* For every form in the forms array check if it is already a possessive or not.
	 * If so, return nothing; if not, return a corresponding possessive form.
	 * Because returning nothing generates undefined objects, filter(Boolean) to get rid of them.
	 */
	forms = forms.concat( forms.map( function( form ) {
		if ( ! checkPossessive( form ) ) {
			return ( getPossessiveFromBase( form ) );
		}
	} ) ).filter( Boolean );
	return unique( flatten( forms ) );
};

module.exports = {
	getNounFormsWithPossessives: getNounFormsWithPossessives,
	getNounForms: getNounForms,
	checkHispanic: checkHispanic,
	checkPossessive: checkPossessive,
	getBaseFromPossessive: getBaseFromPossessive,
};

