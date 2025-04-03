export default keywordCountInSlug;
/**
 * Matches the keyword in the slug. Replaces all dashes and underscores with whitespaces and uses whitespace as word boundary.
 *
 * @param {Paper} paper the Paper object to use in this count.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 *
 * @returns {{keyphraseLength: int, percentWordMatches: int}} The length of the keyphrase and the percentage of keyphrase forms that has been found.
 */
export function keywordCountInSlug(paper: Paper, researcher: Researcher): {
    keyphraseLength: int;
    percentWordMatches: int;
};
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
export function keywordCountInUrl(paper: Paper, researcher: Researcher): {
    keyphraseLength: int;
    percentWordMatches: int;
};
