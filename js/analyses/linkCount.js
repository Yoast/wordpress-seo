var linkMatchFunction = require( "../stringProcessing/linkMatches.js");
var linkKeywordFunction = require( "../stringProcessing/linkKeyword.js");
var linkTypeFunction = require( "../stringProcessing/linkType.js");
var linkFollowFunction = require( "../stringProcessing/linkFollow.js");

/**
 * Checks a text for anchors and returns an object with all linktypes found.
 *
 * @param {String} text The text to check for anchors.
 * @param {String} keyword The keyword to use for matching in anchors.
 * @param {String} url The url of the page.
 * @returns {Object} The object containing all linktypes.
 */
module.exports = function( text, keyword, url ) {
	var matches = linkMatchFunction(text);
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

		linkKeyword = linkKeywordFunction( matches[i], keyword );
		if (linkKeyword) {
			if ( keyword !== "" ) {
				linkCount.totalKeyword++;
			} else {
				linkCount.totalNaKeyword++;
			}
		}
		var linkType = linkTypeFunction( matches[i], url );
		linkCount[linkType + "Total"]++;
		var linkFollow = linkFollowFunction( matches[i] );
		linkCount[linkType + linkFollow]++;
	}

	return linkCount;
};