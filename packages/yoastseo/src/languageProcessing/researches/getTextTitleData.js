import { unifyWhiteSpace } from "../helpers/sanitize/unifyWhitespace";

/**
 * Gets the title data from the paper.
 *
 * @param {Paper} paper The paper that contains the data.
 *
 * @returns {boolean} Whether the text (e.g., post, page or CPT) has a title.
 */
export default function( paper ) {
	let textTitle = paper.getTextTitle();
	textTitle = unifyWhiteSpace( textTitle );
	console.log(textTitle, "whitespace");
	textTitle = textTitle.trim();
	console.log(textTitle, "trimmed");
	return textTitle > 0;
}
