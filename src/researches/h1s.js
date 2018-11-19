// We use an external library, which can be found here: https://github.com/fb55/htmlparser2.
import htmlparser from "htmlparser2";
import isEmpty from "lodash/isEmpty";

/**
 * Gets all H1s in a text, including their content and their position with regards to other HTML blocks.
 *
 * @param {Paper} paper The paper for which to get the H1s.
 *
 * @returns {Array} An array with all H1s, their content and position.
 */
export default function( paper ) {
	const text = paper.getText();
	const allHTMLBlocks = [];
	let isH1 = false;
	let htmlBlock = {};
	const h1s = [];

	/*
	 * Gets the tag names for all HTML blocks. In case an HTML block is an H1, also the content is included.
	 * The content is required for marking.
	 */
	const parser = new htmlparser.Parser( {
		/**
		 * Processes the opening h1 tags.
		 *
		 * @param {string} tagName The name of the tag.
		 *
		 * @returns {void}
		 */
		onopentag: function( tagName ) {
			htmlBlock.tag = tagName;
			if ( tagName === "h1" ) {
				isH1 = true;
			}
		},
		/**
		 * Saves content of the H1 tags.
		 *
		 * @param {string} text The input text.
		 *
		 * @returns {void}
		 */
		ontext: function( text ) {
			if ( isH1 === true ) {
				htmlBlock.content = text;
			}
			if ( ! isEmpty( htmlBlock ) ) {
				allHTMLBlocks.push( htmlBlock );
			}
			htmlBlock = {};
		},
		/**
		 * Processes the closing h1 tags.
		 *
		 * @param {string} tagName The name of the tag.
		 *
		 * @returns {void}
		 */
		onclosetag: function( tagName ) {
			if ( tagName === "h1" ) {
				isH1 = false;
			}
		},
	}, { decodeEntities: true } );

	parser.write( text );

	// Pushes all H1s into an array and adds their position with regards to the other HTML blocks in the body.
	for ( let i = 0; i < allHTMLBlocks.length; i++ ) {
		if ( allHTMLBlocks[ i ].tag !== "h1" ) {
			continue;
		}

		allHTMLBlocks[ i ].position = i;
		h1s.push( allHTMLBlocks[ i ] );
	}

	return h1s;
}
