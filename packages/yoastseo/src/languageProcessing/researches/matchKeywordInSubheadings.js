import { getSubheadingContentsTopLevel } from "../helpers/html/getSubheadings";
import stripSomeTags from "../helpers/sanitize/stripNonTextTags";
import { findTopicFormsInString } from "../helpers/match/findKeywordFormsInString";
import removeHtmlBlocks from "../helpers/html/htmlParser";
import { filterShortcodesFromHTML } from "../helpers";
import getWords from "../helpers/word/getWords";

/**
 * @typedef {import("../../languageProcessing/AbstractResearcher").default } Researcher
 * @typedef {import("../../values/").Paper } Paper
 */

/**
 * @typedef {Object} KeyphraseInSubheadingsResult
 * @property {number} count The number of subheadings.
 * @property {number} matches The number of subheadings reflecting the topic.
 * @property {number} percentReflectingTopic The percentage of subheadings reflecting the topic.
 * @property {string} text The text that was analyzed.
 * @property {number} textLength The length of the text that was analyzed in words.
 */

/**
 * Computes the number of subheadings reflecting the topic.
 *
 * @param {Object}      topicForms      The main key phrase and its synonyms to check.
 * @param {string[]}    subheadings     The subheadings to check.
 * @param {boolean}     useSynonyms     Whether to match synonyms or only main keyphrase.
 * @param {string}      locale          The current locale.
 * @param {string[]}    functionWords	The function words list.
 * @param {function}    matchWordCustomHelper   The language-specific helper function to match word in text.
 *
 * @returns {number} The number of subheadings reflecting the topic.
 */
const numberOfSubheadingsReflectingTopic = function( topicForms, subheadings, useSynonyms, locale, functionWords, matchWordCustomHelper ) {
	return subheadings.filter( subheading => {
		const matchedTopicForms = findTopicFormsInString( topicForms, subheading, useSynonyms, locale, matchWordCustomHelper );

		if ( functionWords.length === 0 ) {
			return matchedTopicForms.percentWordMatches === 100;
		}
		return matchedTopicForms.percentWordMatches > 50;
	} ).length;
};

/**
 * Checks if there are any h2 or h3 subheadings in the text and if they have the keyphrase or synonyms in them.
 *
 * @param {Paper}		paper      The paper object containing the text and keyword.
 * @param {Researcher}	researcher The researcher object.
 *
 * @returns {KeyphraseInSubheadingsResult} An object containing the number of subheadings,
 * the number of subheadings reflecting the topic, the percentage of subheadings reflecting the topic and an empty string.
 */
export default function matchKeywordInSubheadings( paper, researcher ) {
	const functionWords = researcher.getConfig( "functionWords" );

	// A custom helper to match word in text.
	const matchWordCustomHelper = researcher.getHelper( "matchWordCustomHelper" );
	const customCountLength = researcher.getHelper( "customCountLength" );

	let text = paper.getText();
	text = removeHtmlBlocks( text );
	text = filterShortcodesFromHTML( text, paper._attributes && paper._attributes.shortcodes );
	text = stripSomeTags( text );
	const topicForms = researcher.getResearch( "morphology" );
	const locale = paper.getLocale();
	const result = {
		count: 0,
		matches: 0,
		percentReflectingTopic: 0,
		text: text,
		textLength: customCountLength ? customCountLength( text ) : getWords( text ).length,
	};
	const useSynonyms = true;
	const subheadings = getSubheadingContentsTopLevel( text );

	if ( subheadings.length !== 0 ) {
		result.count = subheadings.length;
		result.matches = numberOfSubheadingsReflectingTopic( topicForms, subheadings, useSynonyms, locale, functionWords, matchWordCustomHelper );
		result.percentReflectingTopic = result.matches / result.count * 100;
	}

	return result;
}
