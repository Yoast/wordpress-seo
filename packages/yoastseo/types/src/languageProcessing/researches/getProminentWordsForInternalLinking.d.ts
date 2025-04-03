export default getProminentWordsForInternalLinking;
export type ProminentWordsForInternalLinking = {
    /**
     * Prominent words for this paper, filtered and sorted.
     */
    prominentWords: ProminentWord[];
    /**
     * Whether the metadescription is available in the input paper.
     */
    hasMetaDescription: boolean;
    /**
     * Whether the title is available in the input paper.
     */
    hasTitle: boolean;
};
/**
 * @typedef ProminentWordsForInternalLinking
 * @property {ProminentWord[]} prominentWords     Prominent words for this paper, filtered and sorted.
 * @property {boolean}         hasMetaDescription Whether the metadescription is available in the input paper.
 * @property {boolean}         hasTitle           Whether the title is available in the input paper.
 */
/**
 * Retrieves the prominent words from the given paper.
 *
 * @param {Paper}       paper       The paper to determine the prominent words of.
 * @param {Researcher}  researcher  The researcher to use for analysis.
 *
 * @returns {ProminentWordsForInternalLinking} result A compound result object.
 */
declare function getProminentWordsForInternalLinking(paper: Paper, researcher: Researcher): ProminentWordsForInternalLinking;
