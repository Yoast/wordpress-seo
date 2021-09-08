/**
 * Check the length of the description.
 *
 * @param {Paper} paper The paper object containing the description.
 *
 * @returns {number} The length of the description.
 */
export default function( paper ) {
	let descriptionLength = paper.getDescription().length;

	/* If the meta description is preceded by a date, two spaces and a hyphen (" - ") are added as well. Therefore,
	three needs to be added to the total length. */
	if ( paper.hasDate() && descriptionLength > 0 ) {
		descriptionLength += paper.getDate().length + 3;
	}

	return descriptionLength;
}
