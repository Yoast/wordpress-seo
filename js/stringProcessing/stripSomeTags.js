var stripSpaces = require( "../stringProcessing/stripSpaces.js" );

/**
 * Strips everything from the text, except li, p, dd and h1-h6 tags from the text.
 *
 * @param {String} text The text to strip tags from
 * @returns {*}
 */
module.exports = function( text ) {
	text = text.replace( /<(?!li|\/li|p|\/p|h1|\/h1|h2|\/h2|h3|\/h3|h4|\/h4|h5|\/h5|h6|\/h6|dd).*?\>/g, "" );
	text = stripSpaces( text );
	return text;
};
