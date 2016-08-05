/** @module analyses/getLinkStatistics */

var getLinks = require( "./getLinks.js" );
var findKeywordInUrl = require( "../stringProcessing/findKeywordInUrl.js" );
var getLinkType = require( "../stringProcessing/getLinkType.js" );
var checkNofollow = require( "../stringProcessing/checkNofollow.js" );
var urlHelper = require( "../stringProcessing/url.js" );

/**
 * Checks whether or not an anchor contains the passed keyword.
 * @param {string} keyword The keyword to look for.
 * @param {string} anchor The anchor to check against.
 * @param {string} locale The locale used for transliteration.
 * @returns {boolean} Whether or not the keyword was found.
 */
var keywordInAnchor = function( keyword, anchor, locale ) {
	if ( keyword === "" ) {
		return false;
	}

	return findKeywordInUrl( anchor, keyword, locale );
};

/**
 * Counts the links found in the text.
 *
 * @param {object} paper The paper object containing text, keyword and url.
 * @returns {object} The object containing all linktypes.
 * total: the total number of links found.
 * totalNaKeyword: the total number of links if keyword is not available.
 * keyword: Object containing all the keyword related counts and matches.
 * keyword.totalKeyword: the total number of links with the keyword.
 * keyword.matchedAnchors: Array with the anchors that contain the keyword.
 * internalTotal: the total number of links that are internal.
 * internalDofollow: the internal links without a nofollow attribute.
 * internalNofollow: the internal links with a nofollow attribute.
 * externalTotal: the total number of links that are external.
 * externalDofollow: the external links without a nofollow attribute.
 * externalNofollow: the internal links with a dofollow attribute.
 * otherTotal: all links that are not HTTP or HTTPS.
 * otherDofollow: other links without a nofollow attribute.
 * otherNofollow: other links with a nofollow attribute.
 */
var countLinkTypes = function( paper ) {
	var keyword = paper.getKeyword();
	var locale = paper.getLocale();
	var anchors = getLinks( paper.getText() );
	var permalink = paper.getPermalink();

	var linkCount = {
		total: anchors.length,
		totalNaKeyword: 0,
		keyword: {
			totalKeyword: 0,
			matchedAnchors: [],
		},
		internalTotal: 0,
		internalDofollow: 0,
		internalNofollow: 0,
		externalTotal: 0,
		externalDofollow: 0,
		externalNofollow: 0,
		otherTotal: 0,
		otherDofollow: 0,
		otherNofollow: 0,
	};

	for ( var i = 0; i < anchors.length; i++ ) {
		var currentAnchor = anchors[ i ];

		var anchorLink = urlHelper.getFromAnchorTag( currentAnchor );
		var linkToSelf = urlHelper.areEqual( anchorLink, permalink );

		if ( keywordInAnchor( keyword, currentAnchor, locale ) && !linkToSelf ) {
			linkCount.keyword.totalKeyword++;
			linkCount.keyword.matchedAnchors.push( currentAnchor );
		}

		var linkType = getLinkType( currentAnchor, permalink );
		var linkFollow = checkNofollow( currentAnchor );

		linkCount[ linkType + "Total" ]++;
		linkCount[ linkType + linkFollow ]++;
	}

	return linkCount;
};

/**
 * Checks a text for anchors and returns an object with all linktypes found.
 *
 * @param {Paper} paper The paper object containing text, keyword and url.
 * @returns {Object} The object containing all linktypes.
 */
module.exports = function( paper ) {
	return countLinkTypes( paper );
};
