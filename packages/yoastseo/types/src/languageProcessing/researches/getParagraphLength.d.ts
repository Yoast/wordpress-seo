/**
 * @typedef {Object} ParagraphLength
 * @property {Paragraph} paragraph The paragraph.
 * @property {number} paragraphLength The length of the paragraph.
 */
/**
 * Gets all paragraphs and their word counts or character counts from the text.
 *
 * @param {Paper} 		paper 		The paper object to get the text from.
 * @param {Researcher} 	researcher 	The researcher to use for analysis.
 *
 * @returns {ParagraphLength[]} The array containing an object with the paragraph word or character count and paragraph text.
 */
export default function _default(paper: Paper, researcher: Researcher): ParagraphLength[];
export type ParagraphLength = {
    /**
     * The paragraph.
     */
    paragraph: Paragraph;
    /**
     * The length of the paragraph.
     */
    paragraphLength: number;
};
