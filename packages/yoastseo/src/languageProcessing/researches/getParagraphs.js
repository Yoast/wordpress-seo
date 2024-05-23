import { reject } from "lodash";

/**
 * Returns all paragraphs in a given Paper.
 * Remove paragraphs that do not contain sentences or only consist of links.
 *
 * @param {Paper} paper The current paper.
 * @returns {Paragraph[]} All paragraphs in the paper.
 */
export default function( paper ) {
	let paragraphs = paper.getTree().findAll( node => node.name === "p" );

	// Remove empty paragraphs without sentences and paragraphs only consisting of links.
	paragraphs = reject( paragraphs, paragraph => paragraph.sentences.length === 0 );
	paragraphs = reject( paragraphs, paragraph => paragraph.childNodes.every( node => node.name === "a" ) );

	return paragraphs;
}
