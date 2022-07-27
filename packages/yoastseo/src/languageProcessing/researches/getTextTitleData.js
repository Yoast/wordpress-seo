/**
 * Gets the title data from the paper.
 *
 * @param {Paper} paper The paper that contains the data.
 *
 * @returns {boolean} Whether the text (e.g., post, page or CPT) has a title.
 */
export default function( paper ) {
	const textTitle = paper.getTextTitle();
	return textTitle !== "";
}
