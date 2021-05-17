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
 * Gets all the level 2 and 3 subheadings from the text and returns these in an array.
 *
 * @param {string} text The text to return the headings from.
 *
 * @returns {Array<string[]>} Matches of subheadings in the text, first key is everything including tags,
 *                            second is the heading level, third is the content of the subheading.
 */
function getSubheadingsTopLevel( text ) {
	const subheadings = [];
	const regex = /<h([2-3])(?:[^>]+)?>(.*?)<\/h\1>/ig;
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

	return subheadings.map( subheading => subheading[ 0 ] );
}

/**
 * Gets the content of subheadings h2 and h3 in the text.
 *
 * @param {string} text The text to get the subheading contents from.
 *
 * @returns {string[]} A list of all the subheadings with their content.
 */
function getSubheadingContentsTopLevel( text ) {
	const subheadings = getSubheadingsTopLevel( text );

	// Only return the entire string matched, not the rest of the outputs of the regex.exec function.
	return subheadings.map( subheading => subheading[ 0 ] );
}

/**
 * Removes all level 2 and 3 subheadings from the text.
 *
 * @param {string} text The text to remove the headings from.
 *
 * @returns {string} The text with removed subheadings.
 */
function removeSubheadingsTopLevel( text ) {
	const regex = /<h([2-3])(?:[^>]+)?>(.*?)<\/h\1>/ig;

	return text.replace( regex, "" );
}

export {
	getSubheadings,
	getSubheadingsTopLevel,
	getSubheadingContents,
	getSubheadingContentsTopLevel,
	removeSubheadingsTopLevel,
};

export default {
	getSubheadings: getSubheadings,
	getSubheadingsTopLevel: getSubheadingsTopLevel,
	getSubheadingContents: getSubheadingContents,
	getSubheadingContentsTopLevel: getSubheadingContentsTopLevel,
	removeSubheadingsTopLevel: removeSubheadingsTopLevel,
};
