var keywordRegex = require( "../stringProcessing/keywordRegex.js" );
/**
 *
 * @param {String} url
 * @param {String} keyword
 * @returns {boolean}
 */
module.exports = function( url, keyword ) {
	var keywordFound = false;
	if( typeof keyword !== "undefined" ) {
		var formatUrl = url.match( />(.*)/ig );
		if ( formatUrl !== null ) {
			formatUrl = formatUrl[0].replace(/<.*?>\s?/ig, "");
			if (formatUrl.match(keywordRegex(keyword)) !== null) {
				keywordFound = true;
			}
		}
	}
	return keywordFound;
};
