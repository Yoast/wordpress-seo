/** @module analyses/getLinkStatistics */

var getLinks = require( "./getLinks.js" );
var getLinkCount = require( "./countLinks.js" );
var findKeywordInUrl = require( "../stringProcessing/findKeywordInUrl.js" );
var getLinkType = require( "../stringProcessing/getLinkType.js" );
var checkNofollow = require( "../stringProcessing/checkNofollow.js" );

/**
 * Checks a text for anchors and returns an object with all linktypes found.
 *
 * @param {object} paper The paper object containing text, keyword and url.
 * @returns {object} The object containing all linktypes.
 * total: the total number of links found
 * totalNaKeyword: the total number of links if keyword is not available
 * totalKeyword: the total number of links with the keyword
 * internalTotal: the total number of links that are internal
 * internalDofollow: the internal links without a nofollow attribute
 * internalNofollow: the internal links with a nofollow attribute
 * externalTotal: the total number of links that are external
 * externalDofollow: the external links without a nofollow attribute
 * externalNofollow: the internal links with a dofollow attribute
 * otherTotal: all links that are not HTTP or HTTPS
 * otherDofollow: other links without a nofollow attribute
 * otherNofollow: other links with a nofollow attribute
 */
module.exports = function( paper ) {
	var text = paper.getText();
	var keyword = paper.getKeyword();
	var url = paper.getUrl();
	var anchors = getLinks( text );

if ( getLinkCount( paper ) === 0 ) {
	return {};
}
	var linkCount = {
		total: anchors.length,
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
	var foundKeyword;
	for ( var i = 0; i < anchors.length; i++ ) {
		foundKeyword = keyword ? findKeywordInUrl( anchors[i], keyword ) : false;

		if ( foundKeyword ) {
			linkCount.totalKeyword++;
		}

		var linkType = getLinkType( anchors[i], url );
		linkCount[linkType + "Total"]++;

		var linkFollow = checkNofollow( anchors[i] );
		linkCount[linkType + linkFollow]++;
	}
	return linkCount;
};
