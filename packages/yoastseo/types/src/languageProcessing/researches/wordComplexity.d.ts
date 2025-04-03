/**
 * Gets the complex words from the sentences and calculates the percentage of complex words compared to the total words in the text.
 * This is a research for the Word Complexity assessment. As such, this research is not part of the AbstractResearcher, and not bundled in Yoast SEO.
 *
 * @param {Paper}       paper       The Paper object to get the text from.
 * @param {Researcher}  researcher  The researcher object.
 *
 * @returns {{complexWords: ComplexWordsResult[], percentage: number}}
 * The complex words found and their percentage compared to the total words in the text.
 */
export default function wordComplexity(paper: Paper, researcher: Researcher): {
    complexWords: ComplexWordsResult[];
    percentage: number;
};
/**
 * An object containing the results of the complex words research for a single sentence.
 *
 * The structure of the data is:
 */
export type ComplexWordsResult = {
    /**
     * The complex words in the sentence.
     */
    complexWords: string[];
    /**
     * The sentence.
     */
    sentence: string;
};
