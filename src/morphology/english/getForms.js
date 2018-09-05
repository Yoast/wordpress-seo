import createRulesFromMorphologyData from  "../morphoHelpers/createRulesFromMorphologyData.js";

import { checkPossessive, getNounFormsWithPossessives } from "./getNounForms.js";
import { getVerbForms } from "./getVerbForms.js";
import { getAdjectiveForms } from "./getAdjectiveForms.js";

import { uniq as unique } from "lodash-es";
import { flatten } from "lodash-es";

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
