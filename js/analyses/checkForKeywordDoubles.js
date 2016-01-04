/** @module analyses/checkForKeywordDoubles */

/**
 * Checks the keyword in an array of used keywords. If the keyword is in this array, it will return the
 * number of times the keyword is found, and an ID if it was used once before.
 *
 * @param {string} keyword The keyword to check in the array.
 * @param {array} usedKeywords The array with used keywords and IDs.
 * @returns {object} The id of the keyword and the number of times the keyword is found
 */
module.exports = function( keyword, usedKeywords ) {
	var result = { count: 0, id: 0 };
	if ( typeof usedKeywords[ keyword ] !== "undefined" ){
		result.count = usedKeywords[ keyword ].length;
	}
	if ( result.count === 1 ) {
		result.id = usedKeywords[ keyword ][ 0 ];
	}
	return result;
};
