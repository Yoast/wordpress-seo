var countWords = require( "../stringProcessing/countWords" );
var escapeRegExp = require( "lodash/escapeRegExp" );

/**
 * Determines the length in words of a the keyphrase, the keyword is a keyphrase if it is more than one word.
 *
 * @param {Paper} paper The paper to research
 * @returns {number} The length of the keyphrase
 */
function keyphraseLengthResearch( paper ) {
	var keyphrase = escapeRegExp( paper.getKeyword() );

	return countWords( keyphrase );
}

module.exports = keyphraseLengthResearch;
