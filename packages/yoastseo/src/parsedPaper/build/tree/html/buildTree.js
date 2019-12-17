import { parseFragment } from "parse5";

import HTMLTreeConverter from "./HTMLTreeConverter";
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
	/*
	  Parsing of a HTML article takes on average 19ms
	  (based on the fullTexts in the specs (n=24), measured using `console.time`).
	 */
	const parse5Tree = parseFragment( html, { sourceCodeLocationInfo: true } );

	console.log( "parse5Tree", parse5Tree );

	const htmlTreeConverter =  new HTMLTreeConverter();
	const tree = htmlTreeConverter.convert( parse5Tree );

	console.log( "converted tree", tree );

	// Cleanup takes < 2ms.
	tree = cleanUpTree( tree, html );
	return tree;
};

export default buildTree;
