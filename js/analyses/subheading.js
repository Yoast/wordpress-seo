var stripSomeTags = require("../stringProcessing/stripSomeTags.js");
var subheadingMatch = require("../stringProcessing/subheadingsMatch.js");

/**
 * Checks if there are any subheadings like h2 in the text
 * and if they have the keyword in them
 * @param {String} text The text to check for subheadings
 * @returns {*}
 */
module.exports = function( text, keyword ) {
	var matches;
	var result = {};
	text = stripSomeTags( text );
	matches = text.match( /<h([1-6])(?:[^>]+)?>(.*?)<\/h\1>/ig );

	if ( matches !== null ) {
		result.count = matches.length;
		result.matches = subheadingMatch( matches, keyword );
	}
	return result;
};

