/**
 * Checks if an URL is too long, based on slug and relative to keyword length.
 *
 * @param {String} url The URL to check the length from.
 * @param {String} keyword
 * @param {Int} slugLength
 * @param {Int} urlLength
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
