/* @module analyses/matchKeywordInSubheadings */

import stripSomeTags from "../stringProcessing/stripNonTextTags.js";

import { getSubheadingContents } from "../stringProcessing/getSubheadings.js";
import matchTextWithArray from "../stringProcessing/matchTextWithArray";

/**
 * Checks if the given subheading reflects the given topic.
 * "Reflects" is defined as a subheading having at least 50% of the content words in the key phrase
 * (morphological forms included).
 *
 * @param {String} subheading the subheading to check.
 * @param {Array<String[]>} keyphraseForms the key words and their forms to check.
 * @param {String} locale the current locale
 * @returns {Boolean} if the fraction of found keywords in the subheading is bigger than 0.5.
 */
const subheadingReflectsTopic = function( subheading, keyphraseForms, locale ) {
	const keywordFormsFound = keyphraseForms.filter(
		keywordForms => matchTextWithArray( subheading, keywordForms, locale ).count > 0
	);

	// Over half the keywords should be in the subheading.
	return ( keywordFormsFound.length / keyphraseForms.length ) > 0.5;
};

/**
 * Computes the amount of subheadings reflecting the topic.
 *
 * @param {String[]} subheadings the subheadings to check.
 * @param {Array<String[]>} keyphraseForms the key words and their forms to check.
 * @param {String} locale the current locale.
 * @returns {Number} the amount of subheadings reflecting the topic.
 */
const numberOfsubheadingsReflectingTopic = function( subheadings, keyphraseForms, locale ) {
	return subheadings.filter(
		subheading => subheadingReflectsTopic( subheading, keyphraseForms, locale )
	).length;
};

/**
 * Checks if there are any subheadings like h2 in the text
 * and if they have the key phrase and the keywords' respective morphological forms in them.
 *
 * Also checks for synonyms.
 *
 * @param {object} paper The paper object containing the text and keyword.
 * @param {Researcher} researcher The researcher object.
 * @returns {object} the result object.
 */
export default function( paper, researcher ) {
	let text = paper.getText();
	let topicForms = researcher.getResearch( "morphology" );
	const locale = paper.getLocale();
	const result = { count: 0 };
	text = stripSomeTags( text );
	const matches = getSubheadingContents( text );

	if ( 0 !== matches.length ) {
		result.count = matches.length;
		result.matches = numberOfsubheadingsReflectingTopic( matches, topicForms.keyphraseForms, locale );

		result.matches = topicForms.synonymsForms.reduce(
			( sum, keyphraseForms ) => sum + numberOfsubheadingsReflectingTopic( matches, keyphraseForms, locale )
			, result.matches
		);
	}

	return result;
}

