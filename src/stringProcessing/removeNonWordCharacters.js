/** @module stringProcessing/removeNonWordCharacters.js */

/**
 * Removes all spaces and nonwordcharacters from a string.
 *
 * @param {string} string The string to replace spaces from.
 * @returns {string} string The string without spaces.
 */
export default function( string ) {
	return string.replace( /[\s\n\r\t.,'()"+;!?:/]/g, "" );
};
