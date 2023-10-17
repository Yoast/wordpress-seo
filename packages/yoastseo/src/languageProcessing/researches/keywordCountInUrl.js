/** @module researches/keywordCountInSlug */
import parseSlug from "../helpers/url/parseSlug";
import { findTopicFormsInString } from "../helpers/match/findKeywordFormsInString.js";
import getWordForms from "./getWordForms";

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
	 * In most languages we treat hyphens as word boundaries, but there are exceptions, such as Indonesian.
	 * However, for matching the keyphrase in the slug we want to split the keyphrase forms on hyphens in all languages.
	 * This is because slugs usually use hyphens (or underscores) as word boundaries. So if only the slug is split on
	 * hyphens and not the keyphrase forms, some keyphrase forms won't be found in the slug.
	 * That's why if a researcher's config states that hyphens *shouldn't* be treated as word boundaries, we run the
	 * morphology research not from the researcher but instead directly from this file, and pass an extra flag that
	 * tells it to ignore the areHyphensWordBoundaries config from the researcher. This way we treat hyphens as word
	 * boundaries in all languages when retrieving the keyphrase and synonym forms to be used for finding the keyphrase
	 * in slug.
	 */
	const topicForms = researcher.getConfig( "areHyphensWordBoundaries" ) ? researcher.getResearch( "morphology" )
		: getWordForms( paper, researcher, true );

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
