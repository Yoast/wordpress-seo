export default findKeyphraseInSEOTitle;
/**
 * An object containing the results of the keyphrase in SEO title research.
 */
export type KeyphraseInSEOTitleResult = {
    /**
     * Whether the exact match of the keyphrase was found in the SEO title.
     */
    exactMatchFound: boolean;
    /**
     * Whether all content words from the keyphrase were found in the SEO title.
     */
    allWordsFound: boolean;
    /**
     * The position of the keyphrase in the SEO title.
     */
    position: number;
    /**
     * Whether the exact match was requested.
     */
    exactMatchKeyphrase: boolean;
};
/**
 * Counts the occurrences of the keyword in the SEO title. Returns the result that contains information on
 * (1) whether the exact match of the keyphrase was used in the SEO title,
 * (2) whether all (content) words from the keyphrase were found in the SEO title,
 * (3) at which position the exact match was found in the SEO title.
 *
 * @param {Paper} paper 			The paper containing SEO title and keyword.
 * @param {Researcher} researcher 	The researcher to use for analysis.
 *
 * @returns {KeyphraseInSEOTitleResult} An object containing the information on whether the keyphrase was matched in the SEO title and how.
 */
declare function findKeyphraseInSEOTitle(paper: Paper, researcher: Researcher): KeyphraseInSEOTitleResult;
