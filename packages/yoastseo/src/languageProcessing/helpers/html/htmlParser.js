// We use an external library, which can be found here: https://github.com/fb55/htmlparser2.
import htmlparser from "htmlparser2";

import { includes } from "lodash-es";

// The array containing the text parts without the blocks defined in ignoredTags.
let textArray;

// False when we are not in a block defined in ignoredTags. True if we are.
let inIgnorableBlock = false;

// The blocks we filter out of the text that needs to be parsed.
const ignoredTags = [ "script", "style", "code", "pre", "blockquote" ];

/**
 * Parses the text.
 */
const parser = new htmlparser.Parser( {
	/**
	 * Handles the opening tag.
	 * If we are in an ignorable block, disregard the tag.
	 * If the opening tag is included in the ignoredTags array, set inIgnorableBlock to true.
	 * Otherwise, push the tag to the textArray.
	 *
	 * @param {string} tagName The tag name.
	 * @param {object} nodeValue The attribute with the keys and values of the tag.
	 *
	 * @returns {void}
	 */
	onopentag: function( tagName, nodeValue ) {
		if ( inIgnorableBlock ) {
			return;
		}

		if ( includes( ignoredTags, tagName ) ) {
			inIgnorableBlock = true;
			return;
		}

		const nodeValueType = Object.keys( nodeValue );
		let nodeValueString = "";

		nodeValueType.forEach( function( node ) {
			// Build the tag again.
			nodeValueString += " " + node + "='" + nodeValue[ node ] + "'";
		} );

		textArray.push( "<" + tagName + nodeValueString + ">" );
	},
	/**
	 * Handles the text that doesn't contain opening or closing tags.
	 * If inIgnorableBlock is false, the text gets pushed to the textArray array.
	 *
	 * @param {string} text The text that doesn't contain opening or closing tags.
	 *
	 * @returns {void}
	 */
	ontext: function( text ) {
		if ( ! inIgnorableBlock ) {
			textArray.push( text );
		}
	},
	/**
	 * Handles the closing tag.
	 * If the closing tag is included in the ignoredTags array, set inIgnorableBlock to false.
	 * Otherwise, if we are not currently in an ignorable block, push the tag to the textArray.
	 *
	 * @param {string} tagName The tag name.
	 *
	 * @returns {void}
	 */
	onclosetag: function( tagName ) {
		if ( includes( ignoredTags, tagName ) ) {
			inIgnorableBlock = false;
			return;
		}

		if ( inIgnorableBlock ) {
			return;
		}

		textArray.push( "</" + tagName + ">" );
	},
}, { decodeEntities: true } );

/**
 * Calls the htmlparser and returns the text without the HTML blocks as defined in the ignoredTags array.
 *
 * @param {string} text The text to parse.
 *
 * @returns {string} The text without the HTML blocks as defined in the ignoredTags array.
 */
export default function( text ) {
	textArray = [];
	parser.write( text );
	return textArray.join( "" );
}
