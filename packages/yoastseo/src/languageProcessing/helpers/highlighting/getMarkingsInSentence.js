import Mark from "../../../values/Mark";

const markStart = "<yoastmark class='yoast-text-mark'>";
const markEnd = "</yoastmark>";

/**
 * Adds `yoastmark` tags to the keyphrase matches in the sentence.
 *
 * This is a helper for search-based highlighting.
 *
 * @param {Sentence}	sentence	The sentence to add the `yoastmark` tags to.
 * @param {Token[]}		matches		The array of the keyphrase matches.
 *
 * @returns {string} The sentence with the added `yoastmark` tags.
 */
const createMarksForSentence = ( sentence, matches  ) => {
	const tokens = sentence.tokens;

	const newTokens = [];
	for ( let i = tokens.length - 1; i >= 0; i-- ) {
		const token = tokens[ i ];
		if ( matches.some( match => match.sourceCodeRange.startOffset === token.sourceCodeRange.startOffset ||
			match.sourceCodeRange.endOffset === token.sourceCodeRange.endOffset ) ) {
			newTokens.unshift( markStart, token.text, markEnd );
		} else {
			newTokens.unshift( token.text );
		}
	}
	const markedSentence = newTokens.join( "" );
	// Merge consecutive markings into one marking.
	return markedSentence.replace( new RegExp( "</yoastmark>([ \u00A0]?)<yoastmark class='yoast-text-mark'>", "ig" ), "$1" );
};

/**
 * Merges consecutive and overlapping markings into one marking.
 *
 * This is a helper for position-based highlighting.
 *
 * @param {Mark[]}	markings	An array of markings to merge.
 *
 * @returns {Mark[]} An array of markings where consecutive and overlapping markings are merged.
 */
const mergeConsecutiveAndOverlappingMarkings = ( markings ) => {
	const newMarkings = [];

	// Sort markings by start offset. This is probably redundant, but for extra safety.
	markings.sort( function( a, b ) {
		return a.getPositionStart() - b.getPositionStart();
	} );

	markings.forEach( ( marking ) => {
		if ( newMarkings.length === 0 ) {
			newMarkings.push( marking );
			return;
		}

		const lastMarking = newMarkings[ newMarkings.length - 1 ];
		// Adding 1 to the position end, with the assumption that the language uses spaces.
		// When we adapt Japanese to use this helper, this check should also be adapted.
		if ( ( lastMarking.getPositionEnd() + 1 === marking.getPositionStart() ) ||
			( marking.getPositionStart() <= lastMarking.getPositionEnd() ) ) {
			// The marking is consecutive to the last marking, so we extend the last marking to include the new marking.
			lastMarking.setPositionEnd( marking.getPositionEnd() );
			lastMarking.setBlockPositionEnd( marking.getBlockPositionEnd() );
		} else {
			// The marking is not consecutive to the last marking, so we add it to the array by itself.
			newMarkings.push( marking );
		}
	} );

	return newMarkings;
};


/**
 * Gets the Mark objects of all keyphrase matches in the sentence.
 * Currently, this function creates Mark objects compatible for both search-based and position-based highlighting.
 * In a pure position-based highlighting, we don't need to provide 'marked' and 'original' when creating the Mark object.
 *
 * @param {Sentence}	sentence			The sentence to check.
 * @param {Token[]}		matchesInSentence	An array containing the keyphrase matches in the sentence.
 *
 * @returns {Mark[]} The array of Mark objects of the keyphrase matches in the sentence.
 */
function getMarkingsInSentence( sentence, matchesInSentence ) {
	if ( matchesInSentence.length === 0 ) {
		return [];
	}

	// Create the marked sentence that is used for search-based highlighting.
	const markedSentence = createMarksForSentence( sentence, matchesInSentence );

	/*
	 * Note that there is a paradigm shift:
	 * With search-based highlighting, there would be one Mark object for the entire sentence.
	 * With position-based highlighting, there is a Mark object for each match.
	 * Hence, in order to be backwards compatible with search-based highlighting,
	 * all Mark objects for a sentence have the same markedSentence.
	 */
	const markings = matchesInSentence.map( token => {
		const startOffset = token.sourceCodeRange.startOffset;
		const endOffset =  token.sourceCodeRange.endOffset;
		return new Mark( {
			position: {
				startOffset: startOffset,
				endOffset: endOffset,
				// Relative to start of block positions.
				startOffsetBlock: startOffset - ( sentence.parentStartOffset || 0 ),
				endOffsetBlock: endOffset - ( sentence.parentStartOffset || 0 ),
				// The client id of the block the match was found in.
				clientId: sentence.parentClientId || "",
				// The attribute id of the Yoast sub-block the match was found in.
				attributeId: sentence.parentAttributeId || "",
				// Whether the match was found in the first section of the Yoast sub-block.
				isFirstSection: sentence.isParentFirstSectionOfBlock || false,
			},
			marked: markedSentence,
			original: sentence.text,
		} );
	} );

	return mergeConsecutiveAndOverlappingMarkings( markings );
}

export default getMarkingsInSentence;
