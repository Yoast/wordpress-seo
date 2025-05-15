/**
 * @returns {object} A precompiled regex for recognizing self-closing image tags.
 */
export const imageRegex = new RegExp( "<img(?:[^>]+)?>(</img>)*", "ig" );


/**
 * Retrieves all image tags from a given text string.
 *
 * @param {string} text The text string to check for images.
 * @returns {Array} An Array containing all types of found images.
 */
export default function( text ) {
	// Early return if the text is not a string.
	if ( typeof text !== "string" ) {
		return [];
	}
	return text.match( imageRegex ) || [];
}
