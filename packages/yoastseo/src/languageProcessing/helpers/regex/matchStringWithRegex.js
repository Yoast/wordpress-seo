/** @module stringProcessing/matchStringWithRegex */

/**
 * Checks a string with a regex, return all matches found with that regex.
 *
 * @param {String} text         The text to match.
 * @param {String} regexString  A string to use as regex.
 *
 * @returns {Array} Array with matches, empty array if no matches found.
 */
export default function( text, regexString ) {
	const regex = new RegExp( regexString, "ig" );
	let matches = text.match( regex );

	if ( matches === null ) {
		matches = [];
	}

	return matches;
}
