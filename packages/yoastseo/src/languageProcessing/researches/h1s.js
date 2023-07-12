import { getBlocks } from "../helpers/html/html";
import { reject } from "lodash-es";

const h1Regex = /<h1.*?>(.*?)<\/h1>/;

/**
 * Gets a block from a text and checks if it is totally empty or if it is an empty paragraph.
 *
 * @param {string} block A HTML block extracted from the paper.
 *
 * @returns {boolean} Whether the block is empty or not.
 */
const emptyBlock = function( block ) {
	block = block.trim();
	return block === "<p></p>" || block === "";
};


/**
 * Gets all H1s in a text, including their content and their position with regards to other HTML blocks.
 *
 * @param {Paper} paper The paper for which to get the H1s.
 *
 * @returns {Array} An array with all H1s, their content and position.
 */
export default function( paper ) {
	const tree = paper.getTree();

	const h1Matches = tree.findAll( node => node.name === "h1" );


	const h1s = [];

	h1Matches.forEach( h1Match => {
		h1s.push( {
			tag: "h1",
			content: h1Match.findAll( node => node.name === "#text" ).map( textNode => textNode.value ).join( "" ),
			position: { startOffset: h1Match.sourceCodeLocation.startTag.endOffset, endOffset: h1Match.sourceCodeLocation.endTag.startOffset },
		} );
	} );

	return h1s;
}
