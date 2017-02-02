/** @module analyses/getLinkStatistics */

var getAnchors = require( "../stringProcessing/getAnchorsFromText.js" );

/**
 * Checks a text for anchors and returns the number found.
 *
 * @param {Object} paper The paper to get the text from.
 * @returns {Array} An array with the anchors
 */
module.exports = function( paper ) {
	return getAnchors( paper.getText() );
};
