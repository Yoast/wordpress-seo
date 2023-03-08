// External dependencies.
import { parseFragment } from "parse5";
// Internal dependencies.
import adapt from "./private/adapt";
import tokenize from "./private/tokenize";

/**
 * Parses the HTML string to a tree representation of
 * the HTML document.
 *
 * @param {string} htmlString The HTML string.
 * @param {LanguageProcessor} languageProcessor The language processor to use.
 *
 * @returns {Node} The tree representation of the HTML string.
 */
export default function build( htmlString, languageProcessor ) {
	const tree = adapt( parseFragment( htmlString ) );
	return tokenize( tree, languageProcessor );
}
