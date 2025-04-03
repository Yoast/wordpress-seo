export default getProminentWordsForInsights;
/**
 * Retrieves the prominent words from the given paper.
 *
 * @param {Paper} paper             The paper to determine the prominent words of.
 * @param {Researcher} researcher   The researcher to use for analysis.
 *
 * @returns {WordCombination[]} Prominent words for this paper, filtered and sorted.
 */
declare function getProminentWordsForInsights(paper: Paper, researcher: Researcher): WordCombination[];
