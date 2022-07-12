import wordCount from "../helpers/word/countWords.js";

/**
 * A result of the word count calculation.
 *
 * @typedef WordCountResult
 * @param {number} count The number of words found in the text.
 * @param {"word"} unit The unit used in the text length calculations, always "word".
 */

/**
 * Count the words in the text.
 *
 * @param {Paper} paper The Paper object.
 *
 * @returns {WordCountResult} The number of words found in the text, plus "word" as the unit used in calculating the text length.
 */
export default function( paper ) {
	return {
		count: wordCount( paper.getText() ),
		unit: "word",
	};
}
