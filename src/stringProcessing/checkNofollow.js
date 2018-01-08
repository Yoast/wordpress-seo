/** @module stringProcessing/checkNofollow */

// We use an external library, which can be found here: https://github.com/fb55/htmlparser2.
let htmlparser = require( "htmlparser2" );
let isString = require( "lodash/isString" );

/**
 * Checks if a links has a nofollow attribute. If it has, returns Nofollow, otherwise Dofollow.
 *
 * @param {string} text The text to check against.
 * @returns {string} Returns Dofollow or Nofollow.
 */
module.exports = function( text ) {
	let linkFollow = "Dofollow";

	let parser = new htmlparser.Parser( {
		/**
		 * Detects if there is a `nofollow` argument in the `rel` attribute of a link.
		 *
		 * @param {string} tagName The tag name.
		 * @param {object} nodeValue The attribute with the keys and values of the tag.
		 * @returns {void}
		 */
		onopentag: function( tagName, nodeValue ) {
			if ( tagName.toLowerCase() !== "a" ) {
				return;
			}

			if ( ! isString( nodeValue.rel ) ) {
				return;
			}

			if ( nodeValue.rel.toLowerCase().split( /\s/ ).includes( "nofollow" ) ) {
				linkFollow = "Nofollow";
			}
		}
	} );

	parser.write( text );

	return linkFollow;
};
