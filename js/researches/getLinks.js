/** @module analyses/getLinkStatistics */

var getAnchors = require( "../stringProcessing/getAnchorsFromText.js" );

/**
 * Checks a text for anchors and returns the number found.
 *
 * @param {object} text The text
 * @returns {array} An array with the anchors
 */
module.exports = function( text ) {
	return getAnchors( text );
};
