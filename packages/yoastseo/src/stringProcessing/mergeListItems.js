/**
 * Removes list-related html tags in a text to be used for the keyphrase distribution assessment.
 * That way, lists with single words don't result in a skewed keyphrase distribution result.
 *
 * @param {string}  text    The text in which to remove the list structures.
 *
 * @returns {string} The text with all list structures removed.
 */
export function mergeListItems( text ) {
	const listTags = /<\/?(o|ul)(?:[^>]+)?>/g;
	const listItemTags = /\s?<\/?li(?:[^>]+)?>\s?/g;

	/*
	 * Steps:
	 * 1) Remove all ul and ol tags.
	 * 2) Replace all li tags with spaces to avoid list items being stuck together.
	 * 3) Replace multiple instances of whitespace with a single instance.
	 */
	text = text.replace( listTags, "" );
	text = text.replace( listItemTags, " " );
	text = text.replace( /\s+/g, " " );

	return text;
}
