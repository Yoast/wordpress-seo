/** @module analyses/isUrlTooLong */

var analyzerConfig = require( "../config/analyzerConfig" )();

/**
 * Checks if an URL is too long, based on slug and relative to keyword length.
 *
 * @param {object} paper the paper to run this assessment on
 * @returns {boolean} true if the URL is too long, false if it isn't
 */
module.exports = function( paper ) {
	var urlLength = paper.getUrl().length;
	var keywordLength = paper.getKeyword().length;

	if ( urlLength > analyzerConfig.maxUrlLength  && urlLength > keywordLength + analyzerConfig.maxSlugLength ) {
		return true;
	}
	return false;
};
