import countCharacters from "../helpers/countCharacters";

/**
 * Count the characters in the text.
 *
 * @param {Paper} paper The Paper object.
 *
 * @returns {number} The length of the text in characters.
 */
export default function( paper ) {
	return {
		count: countCharacters( paper.getText() ),
		wordOrCharacter: "character",
	};
}
