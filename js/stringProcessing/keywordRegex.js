var sanitizeStringFunction = require( "../stringProcessing/sanitizeString.js" );

/**
 * Creates a regex from the keyword so it can be matched everywhere in the same way.
 *
 * @param {String} keyword The keyword to make a regex from.
 * @returns {String} keyword The regex made from the keyword
 */
module.exports = function( keyword ) {
	var keywordRegex = new RegExp ( sanitizeStringFunction( keyword ), "ig" );
	return keywordRegex;
};
