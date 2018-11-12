import { filter, includes, map } from "lodash-es";

/**
 * Gets all subheadings from the text and returns these in an array.
 *
 * @param {string} text The text to return the headings from.
 *
 * @returns {Array<string[]>} Matches of subheadings in the text, first key is everything including tags,
 *                            second is the heading level, third is the content of the subheading.
 */
function getSubheadings( text ) {
	const subheadings = [];
	const regex = /<h([1-6])(?:[^>]+)?>(.*?)<\/h\1>/ig;
	let match;

	while ( ( match = regex.exec( text ) ) !== null ) {
		subheadings.push( match );
	}

	return subheadings;
}

/**
 * Gets the content of subheadings in the text.
 *
 * @param {string} text The text to get the subheading contents from.
 *
 * @returns {string[]} A list of all the subheadings with their content.
 */
function getSubheadingContents( text ) {
	const subheadings = getSubheadings( text );

	return map( subheadings, subheading => subheading[ 0 ] );
}

/**
 * Gets the content of subheadings h2 and h3 in the text.
 *
 * @param {string} text The text to get the subheading contents from.
 *
 * @returns {string[]} A list of all the subheadings with their content.
 */
function getSubheadingContentsTopLevel( text ) {
	const subheadings = getSubheadings( text );

	// Filter subheadings so that only h2 and h3 are taken for analysis.
	const subheadingLevels2and3 = filter( subheadings, subheading => {
		return includes( [ "2", "3" ], subheading[ 1 ] );
	} );

	// Only return the entire string matched, not the rest of the outputs of the regex.exec function.
	return map( subheadingLevels2and3, subheading => subheading[ 0 ] );
}

export {
	getSubheadings,
	getSubheadingContents,
	getSubheadingContentsTopLevel,
};

export default {
	getSubheadings: getSubheadings,
	getSubheadingContents: getSubheadingContents,
	getSubheadingContentsTopLevel: getSubheadingContentsTopLevel,
};
