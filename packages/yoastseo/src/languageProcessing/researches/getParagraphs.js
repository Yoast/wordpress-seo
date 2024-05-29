import { reject } from "lodash";
import filterTree from "../../parse/build/private/filterTree";

/**
 * Returns all paragraphs in a given Paper.
 * Remove paragraphs that do not contain sentences or only consist of links.
 *
 * @param {Paper} paper The current paper.
 * @param {Function[]} 	filters 	An array of callbacks. If a callback returns true, the node is discarded.
 * @returns {Paragraph[]} All paragraphs in the paper.
 */
export default function( paper, filters = [] ) {
	let tree = paper.getTree();
	if ( filters.length > 0 ) {
		tree = filterTree( tree, filters );
	}
	let paragraphs = tree.findAll( node => node.name === "p" );

	// Remove empty paragraphs without sentences and paragraphs only consisting of links.
	paragraphs = reject( paragraphs, paragraph => paragraph.sentences.length === 0 );
	paragraphs = reject( paragraphs, paragraph => paragraph.childNodes.every( node => node.name === "a" ) );

	return paragraphs;
}
