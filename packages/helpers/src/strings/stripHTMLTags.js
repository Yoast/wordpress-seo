/** @module stringProcessing/stripHTMLTags */

import stripSpaces from "./stripSpaces.js";

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

export {
	stripFullTags,
};

export default {
	stripFullTags: stripFullTags,
};
