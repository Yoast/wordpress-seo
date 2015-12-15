/** @module analyses/countLinks */

var getAnchors = require( "../stringProcessing/getAnchorsFromText.js" );
var findKeywordInUrl = require( "../stringProcessing/findKeywordInUrl.js" );
var getLinkType = require( "../stringProcessing/getLinkType.js" );
var checkNofollow = require( "../stringProcessing/checkNofollow.js" );

/**
 * Checks a text for anchors and returns an object with all linktypes found.
 *
 * @param {string} text The text to check for anchors.
 * @param {string} keyword The keyword to use for matching in anchors.
 * @param {string} url The url of the page.
 * @returns {object} The object containing all linktypes.
 */
module.exports = function( text, keyword, url ) {
	var matches = getAnchors( text );

	var linkCount = {
		total: matches.length,
		totalNaKeyword: 0,
		totalKeyword: 0,
		internalTotal: 0,
		internalDofollow: 0,
		internalNofollow: 0,
		externalTotal: 0,
		externalDofollow: 0,
		externalNofollow: 0,
		otherTotal: 0,
		otherDofollow: 0,
		otherNofollow: 0
	};
	var linkKeyword;
	for ( var i = 0; i < matches.length; i++ ) {
		linkKeyword = findKeywordInUrl( matches[i], keyword );
		if ( linkKeyword ) {
			if ( keyword !== "" ) {
				linkCount.totalKeyword++;
			} else {
				linkCount.totalNaKeyword++;
			}
		}
		var linkType = getLinkType( matches[i], url );
		linkCount[linkType + "Total"]++;
		var linkFollow = checkNofollow( matches[i] );
		linkCount[linkType + linkFollow]++;
	}
	return linkCount;
};
