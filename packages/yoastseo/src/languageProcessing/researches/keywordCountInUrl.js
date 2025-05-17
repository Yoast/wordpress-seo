/** @module researches/keywordCountInSlug */
import parseSlug from "../helpers/url/parseSlug";
import { findTopicFormsInString } from "../helpers/match/findKeywordFormsInString.js";
import { cloneDeep } from "lodash";

/**
 * Matches the keyword in the slug. Replaces all dashes and underscores with whitespaces and uses whitespace as word boundary.
 *
 * @param {Paper} paper the Paper object to use in this count.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 *
 * @returns {{keyphraseLength: int, percentWordMatches: int}} The length of the keyphrase and the percentage of keyphrase forms that has been found.
 */
function keywordCountInSlug( paper, researcher ) {
	/*
	 * We want to override the `areHyphensWordBoundaries` config value from the researcher so that it is `true` for all
	 * languages. This is because slugs usually use hyphens (or underscores) as word boundaries. So if only the slug is
	 * split on hyphens and not the keyphrase forms, some keyphrase forms won't be found in the slug.
	 */
	const languageResearcher = cloneDeep( researcher );
	languageResearcher.addConfig( "areHyphensWordBoundaries", true );
	const topicForms = languageResearcher.getResearch( "morphology" );

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
