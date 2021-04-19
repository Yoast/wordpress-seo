import { getSubheadingContentsTopLevel } from "../helpers/html/getSubheadings";
import stripSomeTags from "../helpers/sanitize/stripNonTextTags";
import { findTopicFormsInString } from "../helpers/match/findKeywordFormsInString";

/**
 * Computes the amount of subheadings reflecting the topic.
 *
 * @param {Object}      topicForms      The main key phrase and its synonyms to check.
 * @param {string[]}    subheadings     The subheadings to check.
 * @param {boolean}     useSynonyms     Whether to match synonyms or only main keyphrase.
 * @param {string}      locale          The current locale.
 * @param {Array}       functionWords	The function words list.
 *
 * @returns {number} The amount of subheadings reflecting the topic.
 */
const numberOfSubheadingsReflectingTopic = function( topicForms, subheadings, useSynonyms, locale, functionWords ) {
	return subheadings.filter( subheading => {
		const matchedTopicForms = findTopicFormsInString( topicForms, subheading, useSynonyms, locale );

		if ( functionWords.length === 0 ) {
			return matchedTopicForms.percentWordMatches === 100;
		}
		return matchedTopicForms.percentWordMatches > 50;
	} ).length;
};

/**
 * Checks if there are any h2 or h3 subheadings in the text and if they have the keyphrase or synonyms in them.
 *
 * @param {Object}     paper      The paper object containing the text and keyword.
 * @param {Researcher} researcher The researcher object.
 *
 * @returns {Object} The result object.
 */
export default function matchKeywordInSubheadings( paper, researcher ) {
	const functionWords = researcher.getConfig( "functionWords" );
	const text = stripSomeTags( paper.getText() );
	const topicForms = researcher.getResearch( "morphology" );
	const locale = paper.getLocale();
	const result = { count: 0, matches: 0, percentReflectingTopic: 0 };
	const useSynonyms = true;
	const subheadings = getSubheadingContentsTopLevel( text );

	if ( subheadings.length !== 0 ) {
		result.count = subheadings.length;
		result.matches = numberOfSubheadingsReflectingTopic( topicForms, subheadings, useSynonyms, locale, functionWords );
		result.percentReflectingTopic = result.matches / result.count * 100;
	}

	return result;
}
