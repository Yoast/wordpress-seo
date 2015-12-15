/** @module analyses/countImages */

var imageAlttag = require( "../stringProcessing/getAlttagContent.js" );
var wordMatch = require( "../stringProcessing/matchTextWithWord.js" );

/**
 * Checks the text for images, checks the type of each image and alttags for containing keywords
 *
 * @param {string} text The textstring to check for images
 * @param {string} keyword The keyword to check in alttags
 * @returns {object} Object containing all types of found images
 */
module.exports = function( text, keyword ) {
	var imageCount = { total: 0, alt: 0, noAlt: 0, altKeyword: 0, altNaKeyword: 0 };
	var alttag;

	//matches everything in the <img>-tag, case insensitive and global
	var imageMatches = text.match( /<img(?:[^>]+)?>/ig );
	if ( imageMatches !== null ) {
		imageCount.total = imageMatches.length;
		for ( var i = 0; i < imageMatches.length; i++ ) {
			alttag = imageAlttag( imageMatches[i] );
			if ( alttag !== "" ) {
				if ( keyword !== "" ) {
					if ( wordMatch( alttag, keyword ) > 0 ) {
						imageCount.altKeyword++;
					} else {

						//this counts all alt-tags w/o the keyword when a keyword is set.
						imageCount.alt++;
					}
				} else {
					imageCount.altNaKeyword++;
				}
			} else {
				imageCount.noAlt++;
			}
		}
	}
	return imageCount;
};
