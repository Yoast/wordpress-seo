/**
 * @typedef {Object} SubheadingText The object containing the subheading and the text following the subheading.
 * @property {string} subheading The subheading.
 * @property {string} text The text following the subheading.
 * @property {number} countLength The length of the text following the subheading.
 * @property {number} [index] The index of the subheading in the text.
 */
/**
 * Gets the subheadings from the text and returns the text following of these subheading in an array.
 *
 * @param {Paper}       paper       The Paper object to get the text from.
 * @param {Researcher}  researcher  The researcher to use for analysis.
 *
 * @returns {SubheadingText[]} The array containing the object of found subheadings and the length of the text before the first subheading.
 */
export default function _default(paper: Paper, researcher: Researcher): SubheadingText[];
/**
 * The object containing the subheading and the text following the subheading.
 */
export type SubheadingText = {
    /**
     * The subheading.
     */
    subheading: string;
    /**
     * The text following the subheading.
     */
    text: string;
    /**
     * The length of the text following the subheading.
     */
    countLength: number;
    /**
     * The index of the subheading in the text.
     */
    index?: number | undefined;
};
