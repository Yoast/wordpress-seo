import { findAllInTree } from "../../traverse";

/**
 * Gets the start and end positions of the sentences in the source code.
 *
 * @param {Node} 		node  		The paragraph or heading node.
 * @param {Sentence[]} 	sentences 	The sentences in the node.
 *
 * @returns {Sentence[]} The sentences, with their positions in the source code.
 */
export default function getSentencePositions( node, sentences ) {
	// Set the start position of the first sentence to the end position of the node’s start tag.
	let startPosition = node.sourceCodeLocation.startTag.endOffset;
	let endPosition;
	let allNodesWithSourceCodeLocation = [];
	const descendantTagPositions = [];

	/*
	* Get all descendant nodes that have a sourceCodeLocation property (which all nodes apart from Text nodes should have).
	* If any such nodes exist, they will have to be taken into account when calculating the position of the sentences.
	*/
	if ( node.childNodes ) {
		allNodesWithSourceCodeLocation = findAllInTree(node, node => node.sourceCodeLocation);
	}

	/*
	 * If descendant nodes with a sourceCodeLocation property are found, create an array of objects containing the
	 * positions of all nodes' tags. The array will have the following structure: { startOffset: [number], endOffset: [number] }.
	 * Each object represents an opening or closing tag.
	 * startOffset is the starting position of the tag, and endOffset is its ending position.
	 */
	if ( allNodesWithSourceCodeLocation.length > 0 ) {
		allNodesWithSourceCodeLocation.forEach( ( node ) => {
			descendantTagPositions.push( node.sourceCodeLocation.startTag )
			descendantTagPositions.push( node.sourceCodeLocation.endTag )
		} );
		// Sort the tag position objects by the start tag position in ascending order.
		descendantTagPositions.sort(( a, b ) => a.startOffset - b.startOffset );
		console.log( descendantTagPositions, "descendantTagPositions" );

	}

	// Calculate and assign the sentence positions.
	for ( let i = 0; i < sentences.length; i++) {
		// Set the end position to the start position + the length of the sentence.
		endPosition = startPosition + sentences[ i ].text.length;
		console.log( endPosition, "endPosition" );

		// If there are descendant tags, possibly adjust the endPosition to include any tags that are within the sentence.
		if ( descendantTagPositions.length > 0 ) {
			/*
			 * If the start position of a descendant node's tag is equal to or higher than the sentence start position,
			 * and equal to or lower than the sentence end position, add the tag's length to the end position of the sentence.
			 */
			descendantTagPositions.forEach( ( position ) => {
				console.log( position, "position" );
				console.log( startPosition, "startPosition" );
				console.log( endPosition, "endPosition" );
				if( position.startOffset >= startPosition && position.startOffset <= endPosition ) {
					endPosition += ( position.endOffset - position.startOffset )
					console.log( endPosition, "endPosition after first adjustment" );
				}
			} )
			/*
			 * 	If there is a start tag in the array that has the same end position as the end position of the sentence,
			 *  subtract the length of that tag from the endPosition. We don't want to include start tags at the end of
			 *  the sentence in order to reduce the risk of invalid HTML after adding mark tags around the sentence.
			 */
			const startingTagAtEndOfSentence = allNodesWithSourceCodeLocation.find( node =>
				node.sourceCodeLocation.startTag.endOffset === endPosition );
			console.log( startingTagAtEndOfSentence, "startingTagAtEndOfSentence" );
			if ( startingTagAtEndOfSentence ) {
				endPosition = endPosition - ( startingTagAtEndOfSentence.sourceCodeLocation.startTag.endOffset -
					startingTagAtEndOfSentence.sourceCodeLocation.startTag.startOffset )
			}
			console.log( endPosition, "endPosition after second adjustment" );
		}

		// Add the start and end positions to the sentence object.
		sentences[ i ].sourceCodeRange = { startOffset: startPosition, endOffset: endPosition };

		// Start position of the next sentence is the end position of current sentence.
		startPosition = endPosition;
	}

	return sentences;
}
