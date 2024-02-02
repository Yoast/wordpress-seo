/**
 * This file is used for HTML parsing for assessment that not use the HTML Parser.
 * We use a (simpler) external library, which can be found here: https://github.com/fb55/htmlparser2.
 */
import htmlparser from "htmlparser2";

/**
 * The array containing the text parts without ignored HTML blocks.
 * @type {string[]}
 */
let textArray = [];
/**
 * Whether we are currently in an ignored HTML block.
 * @type {boolean}
 */
let inIgnorableBlock = false;
/**
 * The stack of currently ignored tags, when we are in an ignorable HTML block.
 * @type {string[]}
 */
let ignoreStack = [];

/**
 * The HTML tags that should be ignored.
 * @type {string[]}
 */
const IGNORED_TAGS = [ "script", "style", "code", "pre", "blockquote", "textarea" ];
/**
 * The classes of HTML elements that should be ignored.
 * @type {string[]}
 */
const IGNORED_CLASSES = [
	"yoast-table-of-contents",
	"yoast-reading-time__wrapper",
	"elementor-button-wrapper",
	"elementor-divider",
	"elementor-spacer",
	"elementor-custom-embed",
	"elementor-icon-wrapper",
	"elementor-icon-box-wrapper",
	"elementor-counter",
	"elementor-progress-wrapper",
	"elementor-alert",
	"elementor-soundcloud-wrapper",
	"elementor-shortcode",
	"elementor-menu-anchor",
	"elementor-title",
];

/**
 * Parses the text.
 */
const parser = new htmlparser.Parser( {
	/**
	 * Handles the opening tag.
	 * If we are in an ignorable block, disregard the tag.
	 * If the opening tag is included in the `IGNORED_TAGS` array, or the class is in the `IGNORED_CLASSES` array,
	 * set `inIgnorableBlock` to true and add the tag to the `ignoreStack`.
	 * Otherwise, push the tag to the `textArray`.
	 *
	 * @param {string} tagName The tag name.
	 * @param {object} nodeValue The attribute with the keys and values of the tag.
	 *
	 * @returns {void}
	 */
	onopentag: function( tagName, nodeValue ) {
		if ( inIgnorableBlock ) {
			ignoreStack.push( tagName );
			return;
		}

		const classNames = nodeValue.class ? nodeValue.class.split( " " ) : [];
		if ( IGNORED_TAGS.includes( tagName ) || classNames.some( className => IGNORED_CLASSES.includes( className ) ) ) {
			inIgnorableBlock = true;
			ignoreStack.push( tagName );
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
	 * If `inIgnorableBlock` is false, the text gets pushed to the `textArray` array.
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
	 * If the closing tag is the last tag on the `ignoreStack`, jump out of the ignorable block.
	 * Otherwise, if we are not currently in an ignorable block, push the tag to the `textArray`.
	 *
	 * @param {string} tagName The tag name.
	 *
	 * @returns {void}
	 */
	onclosetag: function( tagName ) {
		if ( ignoreStack.length === 1 && ignoreStack[ 0 ] === tagName ) {
			inIgnorableBlock = false;
			ignoreStack = [];
			return;
		}

		if ( inIgnorableBlock ) {
			ignoreStack.pop();
			return;
		}

		textArray.push( "</" + tagName + ">" );
	},
}, { decodeEntities: true } );

/**
 * Calls htmlparser2 and returns the text without HTML blocks that we do not want to consider for the content analysis.
 * Note that this function will soon be deprecated in favour of our own HTML parser.
 *
 * @param {string} text The text to parse.
 *
 * @returns {string} The text without the HTML blocks.
 */
export default function( text ) {
	// Return the globals to their starting values.
	textArray = [];
	inIgnorableBlock = false;
	ignoreStack = [];

	parser.write( text );
	// Make sure to complete the process of parsing and reset the parser to avoid side effects.
	parser.parseComplete();
	return textArray.join( "" );
}
