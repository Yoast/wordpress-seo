import { unifyAllSpaces } from "../helpers/sanitize/unifyWhitespace";

/**
 * Gets the text title data from the paper.
 *
 * @param {Paper} paper The paper that contains the data.
 *
 * @returns {boolean} Whether the text (e.g., post, page or CPT) has a title.
 */
export default function( paper ) {
	let textTitle = paper.getTextTitle();
	textTitle = unifyAllSpaces( textTitle );
	textTitle = textTitle.trim();

	return textTitle.length > 0;
}
