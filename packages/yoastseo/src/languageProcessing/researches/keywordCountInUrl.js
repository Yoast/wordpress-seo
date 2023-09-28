/** @module researches/keywordCountInSlug */
import parseSlug from "../helpers/url/parseSlug";
import { findTopicFormsInString } from "../helpers/match/findKeywordFormsInString.js";

/**
 * Matches the keyword in the slug. Replaces all dashes and underscores with whitespaces and uses whitespace as word boundary.
 *
 * @param {Paper} paper the Paper object to use in this count.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 *
 * @returns {{keyphraseLength: int, percentWordMatches: int}} The length of the keyphrase and the percentage of keyphrase forms that has been found.
 */
function keywordCountInSlug( paper, researcher ) {
	const topicForms = researcher.getResearch( "morphology" );
	const parsedSlug = parseSlug( paper.getSlug() );
	const locale = paper.getLocale();

	const keyphraseInSlug = findTopicFormsInString( topicForms, parsedSlug, false, locale, false );

	return {
		keyphraseLength: topicForms.keyphraseForms.length,
		percentWordMatches: keyphraseInSlug.percentWordMatches,
	};
}

/**
 * Matches the keyword in the slug.
 * keywordCountInUrl was the previous name for keywordCountInSlug (hence the name of this file).
 * We keep (and expose) this research for backwards compatibility.
 *
 * @deprecated Since version 18.7. Use keywordCountInSlug instead.
 *
 * @param {Paper} paper the Paper object to use in this count.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 *
 * @returns {{keyphraseLength: int, percentWordMatches: int}} The length of the keyphrase and the percentage of keyphrase forms that has been found.
 */
function keywordCountInUrl( paper, researcher ) {
	console.warn( "This function is deprecated, use keywordCountInSlug instead." );
	return keywordCountInSlug( paper, researcher );
}

export {
	keywordCountInSlug,
	keywordCountInUrl,
};

export default keywordCountInSlug;
