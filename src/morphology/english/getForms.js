const createRulesFromMorphologyData = require(  "../morphoHelpers/createRulesFromMorphologyData.js" );

const checkPossessive = require( "./getNounForms.js" ).checkPossessive;
const getNounFormsWithPossessives = require( "./getNounForms.js" ).getNounFormsWithPossessives;
const getVerbForms = require( "./getVerbForms.js" ).getVerbForms;
const getAdjectiveForms = require( "./getAdjectiveForms.js" ).getAdjectiveForms;

const unique = require( "lodash/uniq" );
const flatten = require( "lodash/flatten" );

/**
 * Returns all possible forms of the input word using the morphologyData (language-specific).
 *
 * @param {string} word The word to get forms for.
 * @param {Object} morphologyData The available morphology data per language (false if unavailable).
 *
 * @returns {Array} Array of all forms to be searched for keyword-based assessments.
 */
const getForms = function( word, morphologyData ) {
	if ( checkPossessive( word, createRulesFromMorphologyData( morphologyData.nouns.regexNoun.possessiveToBase ) ) ) {
		return unique( getNounFormsWithPossessives( word, morphologyData.nouns ) );
	}
	return unique( flatten( [
		getNounFormsWithPossessives( word, morphologyData.nouns ),
		getVerbForms( word, morphologyData.verbs ),
		getAdjectiveForms( word, morphologyData.adjectives ),
	] ) );
};

module.exports = getForms;
