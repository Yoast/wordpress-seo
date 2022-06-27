import wordCount from "../helpers/word/countWords.js";

/**
 * Count the words in the text.
 *
 * @param {Paper} paper The Paper object.
 *
 * @returns {number} The amount of words found in the text.
 */
export default function( paper ) {
	return {
		count: wordCount( paper.getText() ),
		wordOrCharacter: "word",
	};
}
