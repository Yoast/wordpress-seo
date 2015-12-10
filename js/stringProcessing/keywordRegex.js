var replaceDiacritics = require( "../stringProcessing/replaceDiacritics.js" );
var sanitizeStringFunction = require( "../stringProcessing/sanitizeString.js" );
var addWordBoundaryFunction = require( "../stringProcessing/addWordBoundary.js" );

/**
 * Creates a regex from the keyword so it can be matched everywhere in the same way.
 *
 * @param {String} keyword The keyword to make a regex from.
 * @param {String} extraBoundary A string that is used as extra boundary for keywordRegex.
 * @returns {String} keyword The regex made from the keyword
 */
module.exports = function( keyword, extraBoundary ) {
	keyword = replaceDiacritics( keyword );
	keyword = sanitizeStringFunction( keyword );
	keyword = addWordBoundaryFunction( keyword, extraBoundary );
	var keywordRegex = new RegExp ( keyword, "ig" );
	return keywordRegex;
};
