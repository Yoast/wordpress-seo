/** @module analyses/getUrlLength */

var analyzerConfig = require( "../config/analyzerConfig" )();

/**
 * Checks if an URL is too long, based on slug and relative to keyword length.
 *
 * @param {string} url The URL to check the length from.
 * @param {string} keyword The keyword
 * @returns {boolean} true if the URL is too long, false if it isn't
 */
module.exports = function( url, keyword ) {
	var urlLength = url.length;
	var keywordLength = keyword.length;
	var isUrlTooLong = false;
	if ( urlLength > analyzerConfig.maxUrlLength  && urlLength > keywordLength + analyzerConfig.maxSlugLength ) {
		isUrlTooLong = true;
	}
	return isUrlTooLong;
};
