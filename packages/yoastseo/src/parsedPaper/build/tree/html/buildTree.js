import { parseFragment } from "parse5";

import TreeAdapter from "./TreeAdapter";
import cleanUpTree from "../cleanup/postParsing";

/**
 * Parses the given html-string to a tree, to be used in further analysis.
 *
 * @param {string} html The html-string that should be parsed.
 *
 * @returns {module:parsedPaper/structure.Node} The build tree.
 *
 * @memberOf module:parsedPaper/builder
 */
const buildTree = function( html ) {
	const treeAdapter = new TreeAdapter();
	/*
	  Parsing of a HTML article takes on average 19ms
	  (based on the fullTexts in the specs (n=24), measured using `console.time`).
	 */
	let tree = parseFragment( html, { treeAdapter: treeAdapter, sourceCodeLocationInfo: true } );
	// Cleanup takes < 2ms.
	tree = cleanUpTree( tree, html );
	return tree;
};

export default buildTree;
