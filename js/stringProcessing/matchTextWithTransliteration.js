var map = require( "lodash/map" );
var addWordBoundary = require( "./addWordBoundary.js" );
var stripSpaces = require( "./stripSpaces.js" );

/**
 * Transliterates the keyword.
 * // todo this needs to be implemented when we have the transliterations. It should take the keyword, transliterate it
 * and return it.
 * @param {String} keyword The keyword to transliterate.
 * @returns {String} The transliterated keyword.
 */
var transliterate = function( keyword ) {
	return keyword;
};

/**
 * Creates a regex from the keyword with included wordboundaries.
 * @param {String} keyword The keyword to create a regex from.
 * @returns {RegExp} Regular expression of the keyword with wordboundaries.
 */
var toRegex = function( keyword ) {
	keyword = addWordBoundary( keyword );
	return new RegExp( keyword, "ig" );
};

/**
 * Matches a string with and without transliteration.
 * @param {String} text The text to match.
 * @param {String} keyword The keyword to match in the text.
 * @returns {Array} All matches from the original as the transliterated text and keyword.
 */
module.exports = function( text, keyword ) {
	var keywordRegex = toRegex( keyword );
	var matches = text.match( keywordRegex ) || [];

	text = text.replace( keywordRegex, "" );

	var transliterateKeyword = transliterate( keyword );
	var transliterateKeywordRegex = toRegex( transliterateKeyword );
	var transliterateMatches = text.match( transliterateKeywordRegex ) || [];

	var combinedArray = [].concat( matches, transliterateMatches );
	return map( combinedArray, function( keyword ) {
		return stripSpaces( keyword );
	} );
};


