/**
 * Appends the location to the id.
 *
 * @param {string} id       The id.
 * @param {string} location The location.
 *
 * @returns {string} The id with location.
 */
export default function appendLocationToId( id, location = "" ) {
	if ( location && location.length > 0 ) {
		return `${ id }-${ location }`;
	}

	return id;
}
