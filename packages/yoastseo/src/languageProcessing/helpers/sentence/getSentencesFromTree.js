/**
 * Gets all the sentences from paragraph and heading nodes.
 * These two node types are the nodes that should contain sentences for the analysis.
 *
 * @param {Paper} paper The paper to get the sentences from.
 *
 * @returns {Sentence[]} The array of sentences retrieved from paragraph and heading nodes plus sourceCodeLocation of the parent node.
 */
export default function( paper ) {
	// Get all nodes that have a sentence property which is not an empty array.
	const tree = paper.getTree().findAll( treeNode => !! treeNode.sentences );

	return tree.flatMap( node => node.sentences.map( sentence => {
		return {
			...sentence,
			// The parent node's start offset is the start offset of the parent node if it doesn't have a `startTag` property.
			parentStartOffset: node.sourceCodeLocation && ( ( node.sourceCodeLocation.startTag && node.sourceCodeLocation.startTag.endOffset ) ||
				node.sourceCodeLocation.startOffset ) || 0,
			// The block client id of the parent node.
			parentClientId: node.clientId || "",
			// The attribute id of the parent node, if available, otherwise an empty string.
			parentAttributeId: node.attributeId || "",
			// Whether the parent node is the first section of Yoast sub-blocks.
			isParentFirstSectionOfBlock: node.isFirstSection || false,
		};
	} ) );
}
