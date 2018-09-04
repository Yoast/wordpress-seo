/** @module stringProcessing/checkNofollow */

// We use an external library, which can be found here: https://github.com/fb55/htmlparser2.
import htmlparser from 'htmlparser2';

/**
 * Checks if a link has a `rel` attribute with a `nofollow` value. If it has, returns Nofollow, otherwise Dofollow.
 *
 * @param {string} anchorHTML The anchor HTML to check against.
 * @returns {string} Returns Dofollow or Nofollow.
 */
export default function( anchorHTML ) {
	let linkFollow = "Dofollow";

	let parser = new htmlparser.Parser( {
		/**
		 * Detects if there is a `nofollow` value in the `rel` attribute of a link.
		 *
		 * @param {string} tagName The tag name.
		 * @param {object} attributes The tag attributes with the names and values of each attribute found.
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
