/* @module researches/matchSubheadings */

var stripSomeTags = require( "../stringProcessing/stripNonTextTags.js" );
var getSubheadings = require( "../stringProcessing/getSubheadings.js" );

/**
 * Checks if there are any subheadings like h2 in the text.
 * @param {object} paper The paper object containing the text.
 * @returns {object} The result object.
 */
module.exports = function( paper ) {
	var text = paper.getText();
	var result = { count: 0 };
	text = stripSomeTags( text );
	var matches = getSubheadings( text );
	if ( matches !== null ) {
		result.count = matches.length;
	}
	return result;
};


