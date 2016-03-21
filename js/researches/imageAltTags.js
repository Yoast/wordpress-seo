/** @module researches/imageAltTags */

var imageInText = require( "../researches/imageInText" );
var imageAlttag = require( "../stringProcessing/getAlttagContent" );
var wordMatch = require( "../stringProcessing/matchTextWithWord" );

/**
 * Matches the alt-tags in the images found in the text.
 * Returns an object with the totals and different alt-tags.
 *
 * @param {Array} imageMatches Array with all the matched images in the text
 * @param {string} keyword the keyword to check for.
 * @returns {object} altProperties Object with all alt-tags that were found.
 */
var matchAltProperties = function( imageMatches, keyword ) {
	var altProperties = {
		noAlt: 0,
		withAlt: 0,
		withAltKeyword: 0,
		withAltNonKeyword: 0
	};

	for ( var i = 0; i < imageMatches.length; i++ ) {
		var alttag = imageAlttag( imageMatches[i] );

		// If no alt-tag is set
		if ( alttag === "" ) {
			altProperties.noAlt++;
			continue;
		}

		// If no keyword is set, but the alt-tag is
		if ( keyword === "" && alttag !== "" ) {
			altProperties.withAlt++;
			continue;
		}

		if ( wordMatch( alttag, keyword ) === 0 && alttag !== "") {
			// Match for keywords?
			altProperties.withAltNonKeyword++;
			continue;
		}

		if ( wordMatch( alttag, keyword ) > 0 ) {
			altProperties.withAltKeyword++;
			continue;
		}
	}


	return altProperties;
};

/**
 * Checks the text for images, checks the type of each image and alttags for containing keywords
 *
 * @param {string} text The textstring to check for images
 * @param {string} keyword The keyword to check in alt-tags
 * @returns {object} Object containing all types of found images
 */
module.exports = function( text, keyword ) {
	return matchAltProperties( imageInText( text ), keyword );
};
