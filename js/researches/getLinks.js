/** @module analyses/getLinkStatistics */

var getAnchors = require( "../stringProcessing/getAnchorsFromText.js" );

var map = require( "lodash/map" );
var getFromAnchorTag = require( "../stringProcessing/url.js" ).getFromAnchorTag;

/**
 * Checks a text for anchors and returns the number found.
 *
 * @param {Object} paper The paper to get the text from.
 * @returns {Array} An array with the anchors
 */
module.exports = function( paper ) {
	var anchors = getAnchors( paper.getText() );
	return map( anchors, function( anchor ) {
		return getFromAnchorTag( anchor );
	} );
};
