
const blockTokenizer = /<!--\s+wp:([a-z][a-z0-9_-]*\/)?([a-z][a-z0-9_-]*)\s+({(?:(?=([^}]+|}+(?=})|(?!}\s+\/?-->)[^])*)\5|[^]*?)}\s+)?(\/)?-->/g;

// /**
//  * Sets the block index to the node.
//  *
//  * @param {number} index The block index.
//  * @param {Node} node The node to check.
//  * @returns {void}
//  */
// const setBlockIndexOnNode = ( index, node ) => {
// 	node.blockIndex = index;
// 	if ( node.childNodes && node.childNodes.length > 0 ) {
// 		node.childNodes.map( childNode => setBlockIndexOnNode( index, childNode ) );
// 	}
// };
//
// /**
//  * Retrieves the block index and sets them to Node.
//  *
//  * @param {Node} node The node to check.
//  * @returns {void}
//  */
// export const getAnSetBlockIndex = ( node ) => {
// 	let index = -1;
// 	for ( const topNode of node.childNodes ) {
// 		if ( topNode.name === "#comment" && topNode.data.trim().startsWith( "wp:" ) ) {
// 			index++;
// 		} else if ( topNode.name === "#comment" && topNode.data.trim().startsWith( "/wp:" ) ) {
// 			continue;
// 		} else {
// 			setBlockIndexOnNode( index, topNode );
// 		}
// 	}
// };


const getBlockName = ( node ) => {
	const supportedBlocks = [ "paragraph", "list", "list-item", "heading", "audio", "embed", "gallery", "image", "table", "video" ];
	const blockNames = supportedBlocks.map( block => [ "wp:".concat( block ), "/wp:".concat( block ), "core/".concat( block ) ] );
	const foundBlockName = { blockName: "", closingName: "" };
	blockNames.forEach( name => {
		if ( foundBlockName.blockName === "" && node.data && node.data.trim().startsWith( name[ 0 ] ) ) {
			foundBlockName.blockName = name[ 2 ];
		} else if ( foundBlockName.closingName === "" && node.data && node.data.trim().startsWith( name[ 1 ] ) ) {
			foundBlockName.closingName = name[ 1 ];
		}
	} );
	return foundBlockName;
};


const getYoastBlockName = ( node ) => {
	const yoastBlocks = [ "yoast/faq-block", "yoast/how-to-block" ];
	const foundBlockName = { blockName: "", closingName: "" };
	yoastBlocks.forEach( block => {
		if ( foundBlockName.blockName === "" && node.data && node.data.trim().startsWith( "wp:".concat( block ) ) ) {
			foundBlockName.blockName = block;
		} else if ( foundBlockName.closingName === "" && node.data && node.data.trim().startsWith( "/wp:".concat( block ) ) ) {
			foundBlockName.closingName = block;
		}
	} );
	return foundBlockName;
};

const setClientIdOnNode = ( index, blockName, node, blocks ) => {
	if ( blocks && blocks.length > 0 && blocks[ index ].name === blockName ) {
		node.clientId = blocks[ index ].clientId;
		if ( node.childNodes && node.childNodes.length > 0 ) {
			node.childNodes.map( childNode => setClientIdOnNode( index, blockName, childNode, blocks ) );
		}
	}
};

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

function updateBlocksOffset( blocks, text ) {
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

function updateClintIdForSubtree( rootNode, blocks, clientId ) {
	if ( ! rootNode ) {
		return;
	}

	let currentClientId = clientId;
	if ( rootNode.sourceCodeLocation && rootNode.sourceCodeLocation.startOffset ) {
		const block = blocks.find( ( b ) => b.contentOffset === rootNode.sourceCodeLocation.startOffset );
		if ( block ) {
			console.log( "found block: ", block );

			currentClientId = block.clientId;
		}
	}

	if ( currentClientId ) {
		rootNode.clientId = currentClientId;
	}

	( rootNode.childNodes || [] ).forEach( ( node ) => updateClintIdForSubtree( node, blocks, currentClientId ) );
}
export default function( paper, node ) {
	console.log( "parseBlocks", paper, node );

	const blocks = paper._attributes.wpBlocks;
	blockTokenizer.lastIndex = 0;
	updateBlocksOffset( blocks, paper.getText() );

	// console.log( "Paper attributes: ", attributes );

	// const blocks = getAllBlocks( paper );
	// const index = -1;
	// const blockName = "";

	// const getAndSetClientID = ( tree ) => {
	// 	let blockName = "";
	//
	// 	for ( const topNode of tree.childNodes ) {
	// 		const foundBlockName = getBlockName( topNode );
	// 		const foundYoastBlockName = getYoastBlockName( topNode );
	// 		if ( foundBlockName.blockName.length > 0 || foundYoastBlockName.blockName.length > 0 ) {
	// 			blockName = foundBlockName.blockName;
	// 			index++;
	// 		} else if ( foundBlockName.closingName.length > 0 || foundYoastBlockName.closingName.length > 0 ) {
	// 			continue;
	// 		} else {
	// 			if ( blocks.length > 0 && blocks[ index ].name === blockName ) {
	// 				topNode.clientId = blocks[ index ].clientId;
	// 				if ( topNode.childNodes && topNode.childNodes.length > 0 ) {
	// 					getAndSetClientID( topNode );
	// 				}
	// 			}
	// 			// setClientIdOnNode( index, blockName, topNode, blocks );
	// 		}
	// 	}
	// };
	// getAndSetClientID( node );
	const rawBlocks = getAllBlocks( paper );

	// eslint-disable-next-line no-undefined
	updateClintIdForSubtree( node, rawBlocks, undefined );

	console.log( "after updateClintIdForSubtree: ", node );
	// for ( const topNode of node.childNodes ) {
	// 	if ( ! topNode.sourceCodeLocation ) {
	// 		continue;
	// 	}
	// 	if ( ! topNode.sourceCodeLocation.startOffset ) {
	// 		continue;
	// 	}
	//
	// 	const block = rawBlocks.find( ( b ) => b.contentOffset === topNode.sourceCodeLocation.startOffset );
	// 	if ( block ) {
	// 		console.log( "found block: ", block );
	// 		topNode.clientId = block.clientId;
	// 		// setClientIdOnNode( index, blockName, topNode, blocks );
	// 	}
	//
	// 	// const foundBlockName = getBlockName( topNode );
	// 	// const foundYoastBlockName = getYoastBlockName( topNode );
	// 	// if ( foundBlockName.blockName.length > 0 || foundYoastBlockName.blockName.length > 0 ) {
	// 	// 	blockName = foundBlockName.blockName;
	// 	// 	index++;
	// 	// } else if ( foundBlockName.closingName.length > 0 || foundYoastBlockName.closingName.length > 0 ) {
	// 	// 	continue;
	// 	// } else {
	// 	// 	setClientIdOnNode( index, blockName, topNode, blocks );
	// 	// }
	// }
}
