/** @module stringProcessing/stripHTMLTags */

var stripSpaces = require( "../stringProcessing/stripSpaces.js" );

/**
 * Strip incomplete tags within a text. Strips an endtag at the beginning of a string and the start tag at the end of a
 * start of a string.
 * @param text
 * @returns {*}
 */
var stripTagParts = function( text ) {
	text = text.replace( /^(<\/([^>]+)>)+/i, "" );
	text = text.replace( /(<([^\/>]+)>)+$/i, "" );
	return text;
};

/**
 * Strip HTML-tags from text
 *
 * @param {String} text The text to strip the HTML-tags from.
 * @returns {String} The text without HTML-tags.
 */
var stripFullTags = function( text ) {
	text = text.replace( /(<([^>]+)>)/ig, " " );
	text = stripSpaces( text );
	return text;
};

module.exports = {
	stripFullTags: stripFullTags,
	stripTagParts: stripTagParts
};
