/**
 *
 * @param {String} text The textstring to remove
 * @param {String} stringToRemove
 * @param {String} replacement
 * @returns {*}
 */
module.exports = function( text, stringToRemove, replacement ) {
	text = text.replace( stringToRemove, replacement );

	return text;
};
