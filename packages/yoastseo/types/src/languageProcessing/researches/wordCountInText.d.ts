/**
 * A result of the word count calculation.
 *
 * @typedef WordCountResult
 * @property {string} text The text with all HTML blocks removed and shortcodes filtered out.
 * @property {number} count The number of words found in the text.
 * @property {string} unit The unit used in the text length calculations, always "word".
 */
/**
 * Count the words in the text.
 *
 * @param {Paper} paper The Paper object.
 *
 * @returns {WordCountResult} The number of words found in the text, plus "word" as the unit used in calculating the text length.
 */
export default function _default(paper: Paper): WordCountResult;
/**
 * A result of the word count calculation.
 */
export type WordCountResult = {
    /**
     * The text with all HTML blocks removed and shortcodes filtered out.
     */
    text: string;
    /**
     * The number of words found in the text.
     */
    count: number;
    /**
     * The unit used in the text length calculations, always "word".
     */
    unit: string;
};
