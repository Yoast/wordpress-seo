/** @module stringProcessing/matchStringWithRegex */

/**
 * Checks a string with a regex, return all matches found with that regex.
 *
 * @param {String} 		text        The text to match.
 * @param {object} 		regex  		A compiled regular expression.
 *
 * @returns {Array} Array with matches, empty array if no matches found.
 */
export default function( text, regex ) {
	let matches = text.match( regex );

	if ( matches === null ) {
		matches = [];
	}

	return matches;
}
