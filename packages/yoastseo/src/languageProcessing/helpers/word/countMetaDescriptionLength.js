/**
 * Check the length of the description.
 *
 * @param {string}  date          The date.
 * @param {string}  description   The meta description.
 *
 * @returns {number} The length of the description.
 */
export default function( date, description ) {
	let descriptionLength = description.length;
	/* If the meta description is preceded by a date, two spaces and a hyphen (" - ") are added as well. Therefore,
	three needs to be added to the total length. */
	if ( date !== "" && descriptionLength > 0 ) {
		descriptionLength += date.length + 3;
	}

	return descriptionLength;
}
