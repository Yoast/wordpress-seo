var stopwords = require( "../config/stopwords.js" );
var keywordRegex = require( "../stringProcessing/keywordRegex.js" );

/**
 * Checks a textstring to see if there are any stopwords, that are defined in the stopwords config.
 *
 * @param {String} text The input text to match stopwords.
 * @returns {Array}
 */
module.exports = function( text ) {
	var stopwordsArray = stopwords();
	var i, matches = [];

	for ( i = 0; i < stopwordsArray.length; i++ ) {
		if ( text.match( keywordRegex( stopwordsArray[i] ) ) !== null  ){
			matches.push( stopwordsArray[i] );
		}
	}
	return matches;
};

