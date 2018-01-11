/** @module stringProcessing/checkNofollow */

// We use an external library, which can be found here: https://github.com/fb55/htmlparser2.
let htmlparser = require( "htmlparser2" );

/**
 * Checks if a links has a nofollow attribute value. If it has, returns Nofollow, otherwise Dofollow.
 *
 * @param {string} anchorHTML The anchor HTML to check against.
 * @returns {string} Returns Dofollow or Nofollow.
 */
module.exports = function( anchorHTML ) {
	let linkFollow = "Dofollow";

	let parser = new htmlparser.Parser( {
		/**
		 * Detects if there is a `nofollow` argument value in the `rel` argument of a link.
		 *
		 * @param {string} tagName The tag name.
		 * @param {object} attributes  The attribute with the keys and values of the tag.
		 * @returns {void}
		 */
		onopentag: function( tagName, attributes ) {
			if ( tagName !== "a" || ! attributes.rel ) {
				return;
			}

			if ( attributes.rel.toLowerCase().split( /\s/ ).includes( "nofollow" ) ) {
				linkFollow = "Nofollow";
			}
		},
	} );

	parser.write( anchorHTML );
	parser.end();

	return linkFollow;
};
