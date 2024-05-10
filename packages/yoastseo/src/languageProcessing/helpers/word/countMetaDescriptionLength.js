/**
 * Returns the total length of the meta description (including the date if present).
 *
 * @param {string}  date          The date.
 * @param {string}  description   The meta description.
 *
 * @returns {number} The total length of the meta description.
 */
export default function( date, description ) {
	let descriptionLength = description.length;
	/* If the meta description is preceded by a date, two spaces and a hyphen (" - ") are added as well. Therefore,
	three needs to be added to the total length. */
	if ( date !== "" ) {
		descriptionLength += date.length + 3;
	}

	return descriptionLength;
}
