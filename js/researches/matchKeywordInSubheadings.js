/* @module analyses/matchKeywordInSubheadings */

var stripSomeTags = require( "../stringProcessing/stripNonTextTags.js" );
var subheadingMatch = require( "../stringProcessing/subheadingsMatch.js" );
var getSubheadings = require( "../stringProcessing/getSubheadings.js" );

/**
 * Checks if there are any subheadings like h2 in the text
 * and if they have the keyword in them.
 *
 * @param {object} paper The paper object containing the text and keyword.
 * @returns {object} the result object.
 */
module.exports = function( paper ) {
	var text = paper.getText();
	var keyword = paper.getKeyword();
	var result = { count: 0 };
	text = stripSomeTags( text );
	var matches = getSubheadings( text );

	if ( matches !== null ) {
		result.count = matches.length;
		result.matches = subheadingMatch( matches, keyword );
	}
	return result;
};

