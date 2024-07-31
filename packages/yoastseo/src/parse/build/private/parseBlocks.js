import { isUndefined } from "lodash";
const blockTokenizer = /<!--\s+wp:([a-z][a-z0-9_-]*\/)?([a-z][a-z0-9_-]*)\s+({(?:(?=([^}]+|}+(?=})|(?!}\s+\/?-->)[^])*)\5|[^]*?)}\s+)?(\/)?-->/g;

/**
 * Get all the blocks including the inner blocks.
 *
 * @param {Paper} paper The paper to get all the blocks from.
 *
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
 * @param {Object[]}	blocks An array of blocks.
 * @param {string}		text The text.
 *
 * @returns {void}
 */
export function updateBlocksOffset( blocks, text ) {
	if ( blocks.length === 0 ) {
		return;
	}
	blocks.forEach( ( currentBlock, index ) => {
		const matches = blockTokenizer.exec( text );
		if ( currentBlock.name === "core/freeform" ) {
			const previousBlock = blocks[ index - 1 ];
			if ( previousBlock ) {
				const previousBlockEndOffset = previousBlock.endOffset;
				const startedAt = previousBlockEndOffset + 2;
				currentBlock.startOffset = startedAt;
				currentBlock.endOffset = startedAt + currentBlock.blockLength;
				currentBlock.contentOffset = startedAt;
			} else {
				currentBlock.startOffset = 0;
				currentBlock.endOffset = 0 + currentBlock.blockLength;
				currentBlock.contentOffset = 0;
			}
		} else {
			if ( null === matches ) {
				return;
			}
			const [ match ] = matches;
			const startedAt = matches.index;
			const length = match.length;
			currentBlock.startOffset = startedAt;
			currentBlock.endOffset = startedAt + currentBlock.blockLength;
			currentBlock.contentOffset = startedAt + length + 1;
		}

		if ( currentBlock.innerBlocks && currentBlock.innerBlocks.length > 0 ) {
			updateBlocksOffset( currentBlock.innerBlocks, text );
		}
	} );
}


/**
 * Gets the client id for each block and set it to the child nodes.
 * Additionally, when a node has an attribute with 'id' key, also set this id to the first.
 *
 * @param {Node}		rootNode The root node.
 * @param {Object[]}	blocks An array of blocks.
 * @param {string}		clientId The client id to set.
 *
 * @returns {void}
 */
function updateClientIdAndAttrIdForSubtree( rootNode, blocks, clientId ) {
	if ( ! rootNode ) {
		return;
	}

	let currentClientId = clientId;
	if ( rootNode.sourceCodeLocation && ! isUndefined( rootNode.sourceCodeLocation.startOffset ) ) {
		const foundBlock = blocks.find( block => block.contentOffset === rootNode.sourceCodeLocation.startOffset );
		if ( foundBlock ) {
			currentClientId = foundBlock.clientId;
		}
	}

	// If the clientId is not undefined, also set this to the root node.
	if ( currentClientId ) {
		rootNode.clientId = currentClientId;
	}

	// If the node has children, update the clientId for them.
	( rootNode.childNodes || [] ).forEach( ( node ) => {
		if ( node.attributes && node.attributes.id ) {
			/*
			 * If the node's child has an attribute with 'id' key, also set this id to the first and third child node.
			 * This step is specifically for parsing the Yoast blocks.
			 *
			 * For Yoast blocks, if a node has attribute with 'id' key, this means that this node represents a sub-block.
			 * A sub-block has four child nodes:
			 * 1. The first child node of the sub-block, represents the first section of that sub-block.
			 *    - For example, in Yoast FAQ block, the first child node would represent the "question" section.
			 * 2. The second child node of the sub-block, only contains a new line.
			 * 3. The third child node of the sub-block, represents the second section of that sub-block.
			 *    - For example, in Yoast FAQ block, the second child node would represent the "answer" section.
			 * 4. The fourth child node of the sub-block, only contains a new line.
			 */
			if ( node.childNodes && node.childNodes.length > 3 ) {
				node.childNodes[ 0 ].attributeId = node.attributes.id;
				node.childNodes[ 0 ].isFirstSection = true;

				node.childNodes[ 2 ].attributeId = node.attributes.id;
				node.childNodes[ 2 ].isFirstSection = false;
			}
		}
		updateClientIdAndAttrIdForSubtree( node, blocks, currentClientId );
	} );
}

/**
 * Parses blocks and updates the clientId for the subtree.
 * Additionally, when a node has an attribute with 'id' key, also set this id to the first and third child node of that node.
 *
 * @param {Paper} paper The paper to parse.
 * @param {Node} node	The node to parse.
 *
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
