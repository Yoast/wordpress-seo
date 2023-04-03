/**
 * Gets the start and end positions of all descendant nodes' tags and stores them in an array.
 * Each object in the array represents an opening or closing tag.
 * The startOffset and endOffset properties of the objects correspond to the start and end positions of the tags.
 * Extracting this data into a separate array makes it easier to work with it (e.g. sort it and loop over it).
 *
 * @param {Node[]} descendantNodes	The descendant nodes to get tag positions from.
 *
 * @returns {SourceCodeRange[]}	An array of the locations of each start and end tag in the source code.
 *
 */
function getDescendantPositions( descendantNodes ) {
	const descendantTagPositions = [];
	descendantNodes.forEach( ( node ) => {
		descendantTagPositions.push( node.sourceCodeLocation.startTag );
		descendantTagPositions.push( node.sourceCodeLocation.endTag );
	} );
	// Sort the tag position objects by the start tag position in ascending order.
	descendantTagPositions.sort( ( a, b ) => a.startOffset - b.startOffset );

	return descendantTagPositions;
}

/**
 *
 * Adjusts the end position of the sentence to account for any descendant node tags that overlap with the sentence.
 * We want to add the length of any tags that are within the sentence, as well as start tags at the beginning of the
 * sentence and end tags at the end of the sentence, to the end position of the sentence.
 * We don't want to include start tags at the end of the sentence in order to reduce the risk of invalid HTML after
 * adding mark tags around the sentence. (Same goes for end tags at the start of the sentence, but this should already
 * never happen, as these tags should be added to the end position of the previous sentence).
 *
 * @param {Node[]}				descendantNodes			The descendant nodes.
 * @param {SourceCodeRange[]}	descendantTagPositions	The positions of the descendant nodes' tags.
 * @param {number}				sentenceStart			The start position of a sentence.
 * @param {number}				sentenceEnd				The end position of a sentence.
 *
 * @returns {number}	The adjusted end position of the sentence.
 */
function adjustSentenceEnd( descendantNodes, descendantTagPositions, sentenceStart, sentenceEnd ) {
	/*
	 * If the start position of a descendant's node tag is between the start and end position of the sentence, or is
	 * the same as the start/end position of the sentence, add the tag's length to the end position of the sentence.
	 */
	descendantTagPositions.forEach( ( position ) => {
		if ( position.startOffset >= sentenceStart && position.startOffset <= sentenceEnd ) {
			sentenceEnd += ( position.endOffset - position.startOffset );
		}
	} );
	/*
	 * If the length of a start tag at the end of the sentence was added to the sentenceEnd in the step above,
	 * remove it. We are using the data from the original descendantNodes array for this check, as the
	 * descendantTagPositions array doesn't specify whether each tag is an opening or closing tag.
	 */
	const startTagAtEndOfSentence = descendantNodes.find( node =>
		node.sourceCodeLocation.startTag.endOffset === sentenceEnd );
	if ( startTagAtEndOfSentence ) {
		const startTagLocation = startTagAtEndOfSentence.sourceCodeLocation.startTag;
		sentenceEnd = sentenceEnd - ( startTagLocation.endOffset - startTagLocation.startOffset );
	}

	return sentenceEnd;
}

/**
 * Gets the start and end positions of the sentences in the source code.
 *
 * @param {Node} 		node  		The paragraph or heading node.
 * @param {Sentence[]} 	sentences 	The sentences in the node.
 *
 * @returns {Sentence[]} The sentences, with their positions in the source code.
 */
export default function getSentencePositions( node, sentences ) {
	/*
	 * We cannot calculate sentence positions if there are no sentences, or if we don't know the node's source code
	 * location.
	 */
	if (  sentences.length === 0 || ! node.sourceCodeLocation ) {
		return sentences;
	}
	/*
	 * Set the start position of the first sentence. If the node is an implicit paragraph, which don't have start and
	 * end tags, set the start position to the start of the node. Otherwise, set the start position to the end of the
	 * node's start tag.
	 */
	let sentenceStart = node.name === "p" && node.isImplicit
		? node.sourceCodeLocation.startOffset
		: node.sourceCodeLocation.startTag.endOffset;
	let sentenceEnd;
	let descendantNodes = [];
	let descendantTagPositions = [];

	/*
	 * Check if the node has any descendant nodes that have a sourceCodeLocation property (all nodes other than Text nodes
	 * should have this property). If such nodes exist, store the positions of each node's opening and closing tags in
	 * an array. These positions will have to be taken into account when calculating the position of the sentences.
	 */
	descendantNodes = node.findAll( descendantNode => descendantNode.sourceCodeLocation );
	if ( descendantNodes.length > 0 ) {
		descendantTagPositions = getDescendantPositions( descendantNodes );
	}

	for ( let i = 0; i < sentences.length; i++ ) {
		// Set the sentence end position to the start position + the length of the sentence.
		sentenceEnd = sentenceStart + sentences[ i ].text.length;

		// If there are descendant tags, possibly adjust the sentenceEnd to account for tags within/next to the sentence.
		if ( descendantTagPositions.length > 0 ) {
			sentenceEnd = adjustSentenceEnd( descendantNodes, descendantTagPositions, sentenceStart, sentenceEnd );
		}

		// Add the start and end positions to the sentence object.
		sentences[ i ].sourceCodeRange = { startOffset: sentenceStart, endOffset: sentenceEnd };

		// Start position of the next sentence is the end position of current sentence.
		sentenceStart = sentenceEnd;
	}

	return sentences;
}
