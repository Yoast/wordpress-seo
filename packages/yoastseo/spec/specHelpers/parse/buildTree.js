import LanguageProcessor from "../../../src/parse/language/LanguageProcessor";
import { build } from "../../../src/parse/build";
import adapt from "../../../src/parse/build/private/adapt";
import { parseFragment } from "parse5";
import filterTree from "../../../src/parse/build/private/filterTree";
import permanentFilters from "../../../src/parse/build/private/alwaysFilterElements";

/**
 * Builds an HTML tree for a given paper and researcher, and adds it to the paper.
 *
 * @param {Paper} paper The paper to which the tree will be added.
 * @param {Researcher} researcher The researcher.
 * @returns {void}
 */
export default function buildTree( paper, researcher ) {
	const languageProcessor = new LanguageProcessor( researcher );
	paper.setTree( build( paper.getText(), languageProcessor ) );
}

/**
 * Parses the HTML string to a tree representation of
 * the HTML document.
 *
 * @param {string} htmlString The HTML string.
 *
 * @returns {Node} The tree representation of the HTML string.
 */
function buildWithoutTokenize( htmlString ) {
	let tree = adapt( parseFragment( htmlString, { sourceCodeLocationInfo: true } ) );
	tree = filterTree( tree, permanentFilters );
	return tree;
}

/**
 * Builds an HTML tree for a given paper and researcher, and adds it to the paper.
 * @param {Paper} paper The paper to which the tree will be added.
 * @returns {void}
 */
export function buildTreeNoTokenize( paper ) {
	paper.setTree( buildWithoutTokenize( paper.getText() ) );
}
