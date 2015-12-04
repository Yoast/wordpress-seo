/**
 * Removes all spaces and nonwordcharacters from a string.
 *
 * @param {String} string The string to replace spaces from.
 * @returns {String} string The string without spaces.
 */
module.exports = function( string ){
	return string.replace ( /[\s\n\r\t\.,'\(\)\"\+;!?:\/]/g, "" );
};
