/**
 * Returns any portion of the text that is placed between the beginning of the text and the first subheading.
 * In case the text starts with a subheading returns empty line.
 * In case the text contains no subheadings returns the entire text.
 *
 * @param {string} text The text to analyze from.
 *
 * @returns {string} A text before the first subheading.
 */
module.exports = function( text ) {
/*
 * This part of code was copied from getSubheadingTexts.js.
 *
 * Matching this in a regex is pretty hard, since we need to find a way for matching the text after a heading, and before the end of the text.
 * The hard thing capturing this is with a capture, it captures the next subheading as well, so it skips the next part of the text,
 * since the subheading is already matched.
 * For now we use this method to be sure we capture the right blocks of text. We remove all | 's from text,
 * then replace all headings with a | and split on a |.
 */
	text = text.replace( /\|/ig, "" );
	text = text.replace( /<h([1-6])(?:[^>]+)?>(.*?)<\/h\1>/ig, "|" );
	const subheadings =  text.split( "|" );

	if ( subheadings.length === 0 ) {
		return text;
	}
	return subheadings[ 0 ];
};
