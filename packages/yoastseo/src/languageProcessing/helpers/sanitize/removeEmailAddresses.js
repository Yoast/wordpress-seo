const emailRegex = new RegExp( "[^\\s@]+@[^\\s@]+\\.[^\\s@]+", "igm" );

/**
 * Removes email addresses from a text.
 *
 * @param {string} text The text to remove emails from.
 *
 * @returns {string} The text without email addresses.
 */
export default function( text ) {
	return text.replace( emailRegex, "" );
}
