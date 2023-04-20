// External dependencies.
import { parseFragment } from "parse5";
// Internal dependencies.
import adapt from "./private/adapt";
import tokenize from "./private/tokenize";
import filterTree from "./private/filterTree";
import permanentFilters from "./private/alwaysFilterElements";

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
	let tree = adapt( parseFragment( htmlString, { sourceCodeLocationInfo: true } ) );
	tree = tokenize( tree, languageProcessor );
	return filterTree( tree, permanentFilters );
}
