import { flatten } from "lodash-es";
import { Paragraph, Heading } from "../../../parse/structure";

/**
 * Gets all the sentences from paragraph and heading nodes.
 * These two node types are the nodes that should contain sentences for the analysis.
 *
 * @param {Paper} paper The paper to get the sentences from.
 *
 * @returns {Object[]} The array of sentences retrieved from paragraph and heading nodes.
 */
export default function( paper ) {
	const tree = paper.getTree().findAll( treeNode => !! treeNode.sentences );

	return tree.flatMap( node => node.sentences );
}
