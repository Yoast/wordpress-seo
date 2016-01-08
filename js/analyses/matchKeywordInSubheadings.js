/* @module analyses/matchKeywordInSubheadings */

var stripSomeTags = require( "stringProcessing/stripNonTextTags.js" );
var subheadingMatch = require( "stringProcessing/subheadingsMatch.js" );

/**
 * Checks if there are any subheadings like h2 in the text
 * and if they have the keyword in them.
 *
 * @param {string} text The text to check for subheadings.
 * @param {string} keyword The keyword to match for.
 * @returns {object} the result object.
 * count: the number of matches
 * matches:the number of ocurrences of the keyword for each match
 */
module.exports = function( text, keyword ) {
	var matches;
	var result = { count: 0 };
	text = stripSomeTags( text );
	matches = text.match( /<h([1-6])(?:[^>]+)?>(.*?)<\/h\1>/ig );

	if ( matches !== null ) {
		result.count = matches.length;
		result.matches = subheadingMatch( matches, keyword );
	}
	return result;
};

