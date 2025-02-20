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
		let parentNode = node;

		// For implicit paragraphs, base the details on the parent of this node.
		if ( node.isImplicit ) {
			parentNode = node.getParentNode( tree );
		}

		return {
			...sentence,
			// The parent node's start offset is the start offset of the parent node if it doesn't have a `startTag` property.
			parentStartOffset: parentNode.getStartOffset(),
			// The block client id of the parent node.
			parentClientId: parentNode.clientId || "",
			// The attribute id of the parent node, if available, otherwise an empty string.
			// Only used for position-based highlighting in sub-blocks of Yoast blocks.
			parentAttributeId: node.attributeId || "",
			// Whether the parent node is the first section of Yoast sub-blocks. Only used for position-based highlighting.
			isParentFirstSectionOfBlock: node.isFirstSection || false,
		};
	} ) );
}
