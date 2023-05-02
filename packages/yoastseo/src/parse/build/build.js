// External dependencies.
import { parseFragment } from "parse5";
// Internal dependencies.
import adapt from "./private/adapt";
import tokenize from "./private/tokenize";
import filterTree from "./private/filterTree";
import permanentFilters from "./private/alwaysFilterElements";
import { filterBeforeTokenizing } from "./private/filterBeforeTokenizing";

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
	/*
	 * Filter out some content from the tree so that it can be correctly tokenized. We don't want to tokenize text in
	 * between 'code' and 'script' tags, but we do want to take into account the length of those elements when calculating
	 * sentence and token positions.
	 */
	tree = filterBeforeTokenizing( tree );

	// Add sentences and tokens to the tree's paragraph and heading nodes.
	tree = tokenize( tree, languageProcessor );

	/*
	 * Filter out elements we don't want to include in the analysis. Only do this after tokenization as we need to
	 * have all inline elements in the tree during tokenization to correctly calculate sentence and token positions.
	 */
	return filterTree( tree, permanentFilters );
}
