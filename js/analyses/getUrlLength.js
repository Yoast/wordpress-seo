/** @module analyses/getUrlLength */

/**
 * Checks if an URL is too long, based on slug and relative to keyword length.
 *
 * @param {string} url The URL to check the length from.
 * @param {string} keyword The keyword
 * @param {number} maxSlugLength The maximum length of the slug, as defined in the config
 * @param {number} maxUrlLength The maximum length of the Url, as defined in the config
 * @returns {*}
 */
module.exports = function( url, keyword, maxSlugLength, maxUrlLength ) {
	var urlLength = url.length;
	var keywordLength = keyword.length;
	var tooLong = false;
	if ( urlLength > maxUrlLength  && urlLength > keywordLength + maxSlugLength ) {
		tooLong = true;
	}
	return tooLong;
};
