/**
 * Retrieves the start offset for a given node.
 * @param {Node} node The current node.
 * @returns {number} The start offset.
 */
function getStartOffset( node ) {
	return node.sourceCodeLocation &&
		( ( node.sourceCodeLocation.startTag && node.sourceCodeLocation.startTag.endOffset ) || node.sourceCodeLocation.startOffset ) || 0;
}

/**
 * Retrieves the parent node for a given node.
 * @param {Paper} paper The current paper.
 * @param {Node} node The current node.
 * @returns {Node} The parent node.
 */
function getParentNode( paper, node ) {
	return paper.getTree().findAll( treeNode => treeNode.childNodes && treeNode.childNodes.includes( node ) )[ 0 ];
}

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
		let parentNode = node;

		// For implicit paragraphs, base the details on the parent of this node.
		if ( node.isImplicit ) {
			parentNode = getParentNode( paper, node );
		}

		return {
			...sentence,
			// The parent node's start offset is the start offset of the parent node if it doesn't have a `startTag` property.
			parentStartOffset: getStartOffset( parentNode ),
			// The block client id of the parent node.
			parentClientId: parentNode.clientId || "",
			// The attribute id of the parent node, if available, otherwise an empty string.
			parentAttributeId: parentNode.attributeId || "",
			// Whether the parent node is the first section of Yoast sub-blocks.
			isParentFirstSectionOfBlock: parentNode.isFirstSection || false,
		};
	} ) );
}
