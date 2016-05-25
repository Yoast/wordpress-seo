var addWordBoundary = require( "./addWordBoundary.js" );

var transliterate = function( keyword ) {
	return keyword;
};

var toRegex = function( keyword ) {
	keyword = addWordBoundary( keyword );
	return new RegExp( keyword );
};

module.exports = function( text, keyword ) {
	var keywordRegex = toRegex( keyword );
	var matches = text.match( keywordRegex ) || [];

	var transliterateKeyword = transliterate( keyword );
	var transliterateKeywordRegex = toRegex( transliterateKeyword );
	var transliterateMatches = text.match( transliterateKeywordRegex ) || [];

	return [].concat( matches, transliterateMatches );
};
