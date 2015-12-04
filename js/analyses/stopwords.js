var stopwords = require( "../config/stopwords.js" );
var arrayMatch = require( "../stringProcessing/arrayMatch.js" );

/**
 * Checks a textstring to see if there are any stopwords, that are defined in the stopwords config.
 *
 * @param {String} text The input text to match stopwords.
 * @returns {Array}
 */
module.exports = function( text ) {
	var matches = arrayMatch( text, stopwords() );
	return matches;
};

//prefix space to the keyword to make sure it matches if the keyword starts with a stopword.
/*
var keyword = this.config.keyword;
var matches = this.stringHelper.matchString( keyword, this.config.stopWords );
var stopwordCount = matches !== null ? matches.length : 0;
var matchesText = "";
if ( matches !== null ) {
	for ( var i = 0; i < matches.length; i++ ) {
		matchesText = matchesText + matches[ i ] + ", ";
	}
}
return [ {
	test: "stopwordKeywordCount",
	result: {
		count: stopwordCount,
		matches: matchesText.substring( 0, matchesText.length - 2 )
	}
} ];
};*/
