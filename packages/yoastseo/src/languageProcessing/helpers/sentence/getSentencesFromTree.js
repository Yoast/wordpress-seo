/**
 * @typedef {import("../../../parse/structure").Node} Node
 * @typedef {import("../../../parse/structure/Sentence").default} Sentence
 */

/**
 * Gets all the sentences from paragraph and heading nodes.
 * These two node types are the nodes that should contain sentences for the analysis.
 *
 * @param {Node} tree The tree to get the sentences from.
 *
 * @returns {Sentence[]} The array of sentences retrieved from paragraph and heading nodes plus sourceCodeLocation of the parent node.
 */
export default function( tree ) {
	// Get all nodes that have a sentence property which is not an empty array.
	const nodesWithSentences = tree.findAll( treeNode => !! treeNode.sentences );

	return nodesWithSentences.flatMap( node => node.sentences.map( sentence => {
		sentence.setParentAttributes( node, tree );
		return sentence;
	} ) );
}
