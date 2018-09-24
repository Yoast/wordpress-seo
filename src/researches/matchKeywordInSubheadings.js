/* @module analyses/matchKeywordInSubheadings */

import stripSomeTags from "../stringProcessing/stripNonTextTags.js";

import { getSubheadingContents } from "../stringProcessing/getSubheadings.js";
import { findTopicFormsInString } from "./findKeywordFormsInString.js";

/**
 * Computes the amount of subheadings reflecting the topic.
 *
 * @param {Object} topicForms the main key phrase and its synonyms to check.
 * @param {String[]} subheadings the subheadings to check.
 * @param {boolean} useSynonyms Whether to match synonyms or only main keyphrase.
 * @param {string} locale the current locale.
 * @returns {number} the amount of subheadings reflecting the topic.
 */
const numberOfSubheadingsReflectingTopic = function( topicForms, subheadings, useSynonyms, locale ) {
	return subheadings.filter(
		subheading => {
			return findTopicFormsInString( topicForms, subheading, useSynonyms, locale ).percentWordMatches > 50;
		}
	).length;

};

/**
 * Checks if there are any subheadings like h2 in the text
 * and if they have the key phrase and the keywords' respective morphological forms in them.
 *
 * Also checks for synonyms.
 *
 * @param {Object} paper The paper object containing the text and keyword.
 * @param {Researcher} researcher The researcher object.
 * @returns {Object} the result object.
 */
export default function( paper, researcher ) {
	const text = stripSomeTags( paper.getText() );
	const topicForms = researcher.getResearch( "morphology" );
	const locale = paper.getLocale();
	const result = { count: 0, matches: 0 };
	const subheadings = getSubheadingContents( text );

	const useSynonyms = true;

	if ( 0 !== subheadings.length ) {
		result.count = subheadings.length;
		result.matches = numberOfSubheadingsReflectingTopic( topicForms, subheadings, useSynonyms, locale );
	}

	return result;
}

