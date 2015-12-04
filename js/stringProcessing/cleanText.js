var stripSpaces = require("../stringProcessing/stripSpaces.js");
var replaceDiacritics = require("../stringProcessing/replaceDiacritics.js");

/**
 * Removes words, duplicate spaces and sentence terminators, and words consisting of only digits
 * from the text. This is used for the flesh reading ease test.
 *
 * @param {String} text The text to clean
 * @returns {String} The text
 */
module.exports = function( text ) {
	if ( text !== "" ) {
		text = replaceDiacritics( text );
		text = text.toLocaleLowerCase();

		// Remove some HTML entities as first action
		text = text.replace( "&nbsp;", " " );

		// replace comma', hyphens etc with spaces
		text = text.replace( /[\-\;\:\,\(\)\"\'\|\“\”]/g, " " );

		// remove apostrophe
		text = text.replace( /[\’]/g, "" );

		// unify all terminators
		text = text.replace( /[.?!]/g, "." );

		// Remove double spaces
		text = stripSpaces( text );

		// add period in case it is missing
		text += ".";

		// replace newlines with spaces
		text = text.replace( /[ ]*(\n|\r\n|\r)[ ]*/g, " " );

		// remove duplicate terminators
		text = text.replace( /([\.])[\. ]+/g, "$1" );

		// pad sentence terminators
		text = text.replace( /[ ]*([\.])+/g, "$1 " );

		// Remove double spaces
		text = stripSpaces( text );

		if ( text === "." ) {
			text = "";
		}
	}
	return text;
};