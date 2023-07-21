const blockTokenizer = /<!--\s+wp:([a-z][a-z0-9_-]*\/)?([a-z][a-z0-9_-]*)\s+({(?:(?=([^}]+|}+(?=})|(?!}\s+\/?-->)[^])*)\5|[^]*?)}\s+)?(\/)?-->/g;

/**
 * Get all the blocks including the inner blocks.
 *
 * @param {Paper} paper The paper to get all the blocks.
 * @returns {Object[]} An array of blocks.
 */
const getAllBlocks = ( paper ) => {
	const blocks = paper._attributes.wpBlocks;
	const flattenBlocks = [];
	if ( ! ( blocks && blocks.length > 0 ) ) {
		return [];
	}
	blocks.forEach( ( block ) => {
		if ( block.innerBlocks.length > 0 ) {
			const innerBlocks = block.innerBlocks;
			flattenBlocks.push(
				block, ...innerBlocks
			);
		} else {
			flattenBlocks.push( block );
		}
	} );
	return flattenBlocks;
};


/**
 * Gets the offset of each block and set it to the tree.
 *
 * @param {Object[]} blocks An array of blocks.
 * @param {string} text The text.
 * @returns {void}
 */
function updateBlocksOffset( blocks, text ) {
	if ( blocks.length === 0 ) {
		return;
	}
	// eslint-disable-next-line no-constant-condition
	blocks.forEach( currentBlock => {
		const matches = blockTokenizer.exec( text );

		if ( null === matches ) {
			return;
		}

		const [ match ] = matches;

		const startedAt = matches.index;
		const length = match.length;

		currentBlock.startOffset = startedAt;
		currentBlock.contentOffset = startedAt + length + 1;

		if ( currentBlock.innerBlocks && currentBlock.innerBlocks.length > 0 ) {
			updateBlocksOffset( currentBlock.innerBlocks, text );
		}
	} );
}


/**
 * Gets the client id for each block and set it to the child nodes.
 * Additionally, when a node has an attribute with 'id' key, also set this id to the first.
 *
 * @param {Node} rootNode The root node.
 * @param {Object[]} blocks An array of blocks.
 * @param {string} clientId The client id to set.
 * @returns {void}
 */
function updateClientIdAndAttrIdForSubtree( rootNode, blocks, clientId ) {
	if ( ! rootNode ) {
		return;
	}

	let currentClientId = clientId;
	if ( rootNode.sourceCodeLocation && rootNode.sourceCodeLocation.startOffset ) {
		const block = blocks.find( ( b ) => b.contentOffset === rootNode.sourceCodeLocation.startOffset );
		if ( block ) {
			currentClientId = block.clientId;
		}
	}

	// If the clientId is not undefined, also set this to the root node.
	if ( currentClientId ) {
		rootNode.clientId = currentClientId;
	}

	// If the node has children, update the clientId for them.
	( rootNode.childNodes || [] ).forEach( ( node ) => {
		if ( node.attributes && node.attributes.id ) {
			// If the node's child has an attribute with 'id' key, also set this id to the first and third child node.
			if ( node.childNodes && node.childNodes.length > 3 ) {
				node.childNodes[ 0 ].attributeId = node.attributes.id;
				node.childNodes[ 0 ].isFirstPair = true;

				node.childNodes[ 2 ].attributeId = node.attributes.id;
				node.childNodes[ 2 ].isFirstPair = false;
			}
		}
		updateClientIdAndAttrIdForSubtree( node, blocks, currentClientId );
	} );
}

/**
 * Parses blocks and updates the clientId for the subtree.
 * Additionally, when a node has an attribute with 'id' key, also set this id to the first and third child nod of that node.
 *
 * @param {Paper} paper The paper to parse.
 * @param {Node} node	The node to parse.
 * @returns {void}
 */
export default function( paper, node ) {
	const blocks = paper._attributes.wpBlocks || [];
	blockTokenizer.lastIndex = 0;
	updateBlocksOffset( blocks, paper.getText() );

	const rawBlocks = getAllBlocks( paper );

	// eslint-disable-next-line no-undefined
	updateClientIdAndAttrIdForSubtree( node, rawBlocks, undefined );
}
