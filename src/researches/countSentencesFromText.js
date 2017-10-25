var getSentences = require( "../stringProcessing/getSentences" );
var sentencesLength = require( "./../stringProcessing/sentencesLength.js" );
var stripTagsPlusContent = require( "./../stringProcessing/stripHTMLTags.js" ).stripTagsPlusContent;

/**
 * Count sentences in the text.
 * @param {Paper} paper The Paper object to get text from.
 * @returns {Array} The sentences from the text.
 */
module.exports = function( paper ) {
	var text = paper.getText();
	text = stripTagsPlusContent( text );
	var sentences = getSentences( text );
	return sentencesLength( sentences );
};
