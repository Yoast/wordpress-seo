// "use strict";
const createRulesFromJsonArrays = require( "../morphoHelpers/createRulesFromJsonArrays.js" );
const buildOneFormFromRegex = require( "../morphoHelpers/buildFormFromRegex" ).buildOneFormFromRegex;
const buildTwoFormsFromRegex = require( "../morphoHelpers/buildFormFromRegex" ).buildTwoFormsFromRegex;


const isUndefined = require( "lodash/isUndefined.js" );
const unique = require( "lodash/uniq" );
const flatten = require( "lodash/flatten" );

/**
 * Checks if the input word is a possessive form (e.g., "boy's" in "the boy's car") and returns true if that is the case.
 *
 * @param {string} word The word for which to determine if it's a possessive.
 * @param {Array} possessiveToBaseRegex An array of regex-based rules to bring possessives to base.
 *
 * @returns {boolean} Whether the input word is a possessive form or not.
 */
const checkPossessive = function( word, possessiveToBaseRegex ) {
	for ( let i = 0; i < possessiveToBaseRegex.length; i++ ) {
		if ( possessiveToBaseRegex[ i ].reg.test( word ) ) {
			return true;
		}
	}
};

/**
 * Checks if the input word occurs in the list of exception nouns and if so returns all its irregular forms.
 *
 * @param {string} word The word for which to determine its irregular forms.
 * @param {Array} irregularNouns An array of irregular nouns from the morphology data available for the language.
 *
 * @returns {Array} Array of word forms from the exception list.
 */
const checkIrregulars = function( word, irregularNouns ) {
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
 * Collects all possible noun forms for a given word through checking if it is irregular, hispanic, singular or plural.
 *
 * @param {string} word The word for which to determine its forms.
 * @param {Object} nounData The noun morphology data available for this language.
 *
 * @returns {Array} Array of word forms.
 */
const getNounForms = function( word, nounData ) {
	let forms = [].concat( word );
	let base = word;

	const regexNoun = nounData.regexNoun;

	const baseIfPossessive = buildOneFormFromRegex( word, createRulesFromJsonArrays( regexNoun.possessiveToBase ) );
	if ( ! isUndefined( baseIfPossessive ) ) {
		base = baseIfPossessive;
		forms = forms.concat( base );
	}

	const irregular = checkIrregulars( base, nounData.irregularNouns );
	if ( ! isUndefined( irregular ) ) {
		return irregular;
	}

	const hispanic = buildTwoFormsFromRegex( base, createRulesFromJsonArrays( regexNoun.hispanic ) );
	if ( ! isUndefined( hispanic ) ) {
		forms.push( hispanic[ 0 ], hispanic[ 1 ] );
		return forms;
	}

	const singular = buildOneFormFromRegex( base, createRulesFromJsonArrays( regexNoun.singularize ) );
	if ( ! isUndefined( singular ) ) {
		forms.push( singular );
	}

	const plural = buildOneFormFromRegex( base, createRulesFromJsonArrays( regexNoun.pluralize ) );
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
 * @param {Object} nounData The noun morphology data available for this language.
 *
 * @returns {Array} Array of all word forms including possessives.
 */
const getNounFormsWithPossessives = function( word, nounData ) {
	let forms = getNounForms( word, nounData );

	/* For every form in the forms array check if it is already a possessive or not.
	 * If so, return nothing; if not, return a corresponding possessive form.
	 * Because returning nothing generates undefined objects, filter(Boolean) to get rid of them.
	 */
	forms = forms.concat( forms.map( function( form ) {
		if ( ! checkPossessive( form, createRulesFromJsonArrays( nounData.regexNoun.possessiveToBase ) ) ) {
			return ( buildTwoFormsFromRegex( form, createRulesFromJsonArrays( nounData.regexNoun.baseToPossessive ) ) );
		}
	} ) ).filter( Boolean );
	return unique( flatten( forms ) );
};

module.exports = {
	getNounFormsWithPossessives,
	getNounForms,
	checkPossessive,
};
