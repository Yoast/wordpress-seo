/**
 * Checks whether there is an ordered or unordered list in the text.
 *
 * @param {Paper}	paper	The paper object to get the text from.
 *
 * @returns {boolean} Whether there is a list in the paper text.
 */
export default function( paper ) {
	const regex = /<[uo]l.*>[\s\S]*<\/[uo]l>/;

	return regex.test( paper.getText() );
}
