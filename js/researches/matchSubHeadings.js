/* @module researches/matchSubheadings */

var stripSomeTags = require( "../stringProcessing/stripNonTextTags.js" );
var getSubheadings = require( "../stringProcessing/getSubheadings.js" );

/**
 * Checks if there are any subheadings like h2 in the text
 * @param {object} paper The paper object containt the text
 * @returns {object} the result object.
 * count: the number of matches
 */
module.exports = function( paper ) {
	var text = paper.getText();
	var matches;
	var result = { count: 0 };
	text = stripSomeTags( text );
	matches = getSubheadings( text );
	if ( matches !== null ) {
		result.count = matches.length;
	}
	return result;
};


