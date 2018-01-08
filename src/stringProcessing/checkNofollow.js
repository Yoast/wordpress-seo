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
	let linkFollow = 'Dofollow';

	let parser = new htmlparser.Parser( {
		/**
		 * Handles the opening tag. If the opening tag is included in the inlineTags array, set inScriptBlock to true.
		 * If the opening tag is not included in the inlineTags array, push the tag to the textArray.
		 *
		 * @param {string} tagName The tag name.
		 * @param {object} nodeValue The attribute with the keys and values of the tag.
		 * @returns {void}
		 */
		onopentag: function( tagName, nodeValue ) {
			if ( tagName.toLowerCase() !== 'a' ) {
				return;
			}

			if ( ! isString( nodeValue.rel ) ) {
				return;
			}

			if ( nodeValue.rel.toLowerCase().split(/\s/).includes('nofollow') ) {
				linkFollow = 'Nofollow';
			}
		}
	});

	parser.write(text);

	return linkFollow;
};
