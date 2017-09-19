/** @module analyses/getLinkStatistics */

let getAnchors = require( "../stringProcessing/getAnchorsFromText.js" );

let map = require( "lodash/map" );
let url = require( "../stringProcessing/url.js" );

/**
 * Checks a text for anchors and returns the number found.
 *
 * @param {Object} paper The paper to get the text from.
 * @returns {Array} An array with the anchors
 */
module.exports = function( paper ) {
	let anchors = getAnchors( paper.getText() );

	return map( anchors, url.getFromAnchorTag );
};
