/** @module analyses/getImageStatistics */

var matchStringWithRegex = require( "../stringProcessing/matchStringWithRegex" );
var imageAlttag = require( "../stringProcessing/getAlttagContent.js" );
var wordMatch = require( "../stringProcessing/matchTextWithWord.js" );

/**
 * Checks if the keyword is present in the alttag and returns the property of the imageCount
 * object that needs to be updated.
 *
 * @param {string} alttag The alttag to match the keyword in
 * @param {string} keyword The keyword to match in the alttag
 * @returns {string} The property of the imageCount object that needs to be updated
 */
var matchKeywordInAlttags = function( alttag, keyword ){
	if ( keyword !== "" ) {
		if ( wordMatch( alttag, keyword ) > 0 ) {
			return "altKeyword";
		} else {

			//this counts all alt-tags w/o the keyword when a keyword is set.
			return "alt";
		}
	} else {
		return "altNaKeyword";
	}
};

/**
 * Matches the alttags in the images found in the text.
 * Returns an imageCount object with the totals and different alttags.
 *
 * @param {array} imageMatches Array with all the matched images in the text
 * @param {string} keyword the keyword to check for
 * @returns {object} imageCount object with all alttags
 */
var matchImageTags = function( imageMatches, keyword ){
	var imageCount = { total: imageMatches.length, alt: 0, noAlt: 0, altKeyword: 0, altNaKeyword: 0 };
	for ( var i = 0; i < imageMatches.length; i++ ) {
		var alttag = imageAlttag( imageMatches[i] );

		if ( alttag !== "" ) {
			imageCount[ matchKeywordInAlttags( alttag, keyword ) ]++;
		} else {
			imageCount.noAlt++;
		}
	}
	return imageCount;
};

/**
 * Checks the text for images, checks the type of each image and alttags for containing keywords
 *
 * @param {string} text The textstring to check for images
 * @param {string} keyword The keyword to check in alttags
 * @returns {object} Object containing all types of found images
 */
module.exports = function( text, keyword ) {

	var imageMatches = matchStringWithRegex( text, "<img(?:[^>]+)?>" );
	var imageCount =  matchImageTags( imageMatches, keyword );

	return imageCount;
};
