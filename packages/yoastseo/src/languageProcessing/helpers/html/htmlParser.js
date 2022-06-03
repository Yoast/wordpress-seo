// We use an external library, which can be found here: https://github.com/fb55/htmlparser2.
import htmlparser from "htmlparser2";


import { includes } from "lodash-es";

// The array containing the text parts without the blocks defined in inlineTags.
let textArray;

// False when we are not in a block defined in inlineTags. True if we are.
let inScriptBlock = false;

// The blocks we filter out of the text that needs to be parsed.
const inlineTags = [ "script", "style", "code", "pre", "blockquote" ];

/**
 * Parses the text.
 */
const parser = new htmlparser.Parser( {
	/**
	 * Handles the opening tag.
	 * If we are in a script block, disregard the tag.
	 * If the opening tag is included in the inlineTags array, set inScriptBlock to true.
	 * Otherwise, push the tag to the textArray.
	 *
	 * @param {string} tagName The tag name.
	 * @param {object} nodeValue The attribute with the keys and values of the tag.
	 *
	 * @returns {void}
	 */
	onopentag: function( tagName, nodeValue ) {
		if ( inScriptBlock ) {
			return;
		}

		if ( includes( inlineTags, tagName ) ) {
			inScriptBlock = true;
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
	 * Handles the text that doesn't contain opening or closing tags. If inScriptBlock is false, the text gets pushed to the textArray array.
	 *
	 * @param {string} text The text that doesn't contain opening or closing tags.
	 *
	 * @returns {void}
	 */
	ontext: function( text ) {
		if ( ! inScriptBlock ) {
			textArray.push( text );
		}
	},
	/**
	 * Handles the closing tag.
	 * If the closing tag is included in the inlineTags array, set inScriptBlock to false.
	 * Otherwise, if we are not currently in a script block, push the tag to the textArray.
	 *
	 * @param {string} tagName The tag name.
	 *
	 * @returns {void}
	 */
	onclosetag: function( tagName ) {
		if ( includes( inlineTags, tagName ) ) {
			inScriptBlock = false;
			return;
		}

		if ( inScriptBlock ) {
			return;
		}

		textArray.push( "</" + tagName + ">" );
	},
}, { decodeEntities: true } );

/**
 * Calls the htmlparser and returns the text without the HTML blocks as defined in the inlineTags array.
 *
 * @param {string} text The text to parse.
 *
 * @returns {string} The text without the HTML blocks as defined in the inlineTags array.
 */
export default function( text ) {
	textArray = [];
	parser.write( text );
	return textArray.join( "" );
}
