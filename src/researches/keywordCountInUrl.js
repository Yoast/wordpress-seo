/** @module researches/countKeywordInUrl */

import { findTopicFormsInString } from "./findKeywordFormsInString.js";

/**
 * Matches the keyword in the URL. Replaces whitespaces with dashes and uses dash as wordboundary.
 *
 * @param {Paper} paper the Paper object to use in this count.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 *
 * @returns {int} Number of times the keyword is found.
 */
export default function( paper, researcher ) {
	const topicForms = researcher.getResearch( "morphology" );
	const slug = paper.getUrl().replace( /[-_]/ig, " " );

	const keyphraseInSlug = findTopicFormsInString( topicForms, slug, false, paper.getLocale() );

	return {
		keyphraseLength: topicForms.keyphraseForms.length,
		percentWordMatches: keyphraseInSlug.percentWordMatches,
	};
}
