// External dependencies.
import { parse as parse5 } from "parse5";
// Internal dependencies.
import adapt from "./adapt";

/**
 * Parses the HTML string to a tree representation of
 * the HTML document.
 *
 * @param {string} htmlString The HTML string.
 *
 * @returns {Object} The tree representation of the HTML string.
 */
export default function parse( htmlString ) {
	return adapt( parse5( htmlString ) );
}

