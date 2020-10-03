/** @module researches/countKeywordInUrl */

import parseSlug from "../../helpers/parseSlug";
import { findTopicFormsInString } from "./findKeywordFormsInString.js";

/**
 * Matches the keyword in the URL. Replaces dashes and underscores with whitespaces and uses whitespace as wordboundary.
 *
 * @param {Paper} paper the Paper object to use in this count.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 *
 * @returns {int} Number of times the keyword is found.
 */
export default function( paper, researcher ) {
	const topicForms = researcher.getResearch( "morphology" );
	const parsedSlug = parseSlug( paper.getUrl() );

	let keyphraseInSlug = findTopicFormsInString( topicForms, parsedSlug, false, paper.getLocale() );
	/* In case we deal with a language where dashes are part of the word (e.g., in Indonesian: buku-buku),
	 * Try looking for the keywords in the unparsed slug.
	 */
	if ( keyphraseInSlug.percentWordMatches === 0 ) {
		const unparsedSlug = paper.getUrl();
		keyphraseInSlug = findTopicFormsInString( topicForms, unparsedSlug, false, paper.getLocale() );
	}
	return {
		keyphraseLength: topicForms.keyphraseForms.length,
		percentWordMatches: keyphraseInSlug.percentWordMatches,
	};
}
