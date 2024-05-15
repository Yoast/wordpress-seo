import { isUndefined } from "lodash";

/**
 * Returns An array of found subheadings including the following text.
 *
 * @param {string} text The text to analyze from.
 *
 * @returns {Array} An array of found subheadings including the following text.
 */
export default function( text ) {
	// Match all the subheadings.
	const subheadings = [ ...text.matchAll( new RegExp( "<h([1-6])(?:[^>]+)?>(.*?)<\\/h\\1>", "ig" ) ) ];

	const foundSubheadings = [];

	subheadings.forEach( ( subheading, i ) => {
		// Retrieve the current subheading string.
		const subheadingString = subheading[ 0 ];
		// Retrieve the current subheading index.
		const currentMatchIndex = subheading.index;
		// Retrieve the next subheading.
		const nextSubheading = subheadings[ i + 1 ];

		let nextMatchIndex;

		// Check if there is a next subheading.
		if ( isUndefined( nextSubheading ) ) {
			// If there is no next subheading, the next match index is the index of the last character in the text.
			nextMatchIndex = subheading.input.length;
		} else {
			// Retrieve the index of the next subheading.
			nextMatchIndex = nextSubheading.index;
		}

		// Retrieve the text following the current subheading.
		const textFollowingCurrentSubheading = subheading.input.slice( currentMatchIndex + subheadingString.length, nextMatchIndex );
		foundSubheadings.push( {
			subheading: subheadingString,
			text: textFollowingCurrentSubheading,
			index: currentMatchIndex,
		} );
	} );

	return foundSubheadings;
}


