export const START_MARK = "<yoastmark class='yoast-text-mark'>";
export const END_MARK = "</yoastmark>";

const START_MARK_DOUBLE_QUOTED = "<yoastmark class=\"yoast-text-mark\">";

/**
 * Returns the offsets of the `<yoastmark>` occurrences in the given marked sentence.
 * A helper for search-based highlighting.
 *
 * @param {string} markedSentence The marked sentence to calculate the yoastmark offsets for.
 *
 * @returns {[{startOffset: number, endOffset: number}]} The start and end indices for this sentence.
 */
export function getYoastmarkOffsets( markedSentence ) {
	let startMarkIndex = markedSentence.indexOf( START_MARK );

	// Checks if the start mark is single quoted.
	// Note: if doesNotContainDoubleQuotedMark is true, this does necessary mean that the start mark is single quoted.
	// It could also be that the start mark doesn't occur at all in startMarkIndex.
	// In that case, startMarkIndex will be -1 during later tests.
	const doesNotContainDoubleQuotedMark = startMarkIndex >= 0;

	// If the start mark is not found, try the double-quoted version.
	if ( ! doesNotContainDoubleQuotedMark ) {
		startMarkIndex = markedSentence.indexOf( START_MARK_DOUBLE_QUOTED );
	}

	let endMarkIndex = null;

	const offsets = [];

	/**
	 * Step by step search for a yoastmark-tag and its corresponding end tag. Each time a tag is found
	 * it is removed from the string because the function should return the indexes based on the string
	 * without the tags.
	 */
	while ( startMarkIndex >= 0 ) {
		markedSentence = doesNotContainDoubleQuotedMark
			? markedSentence.replace( START_MARK, "" )
			: markedSentence.replace( START_MARK_DOUBLE_QUOTED, "" );

		endMarkIndex = markedSentence.indexOf( END_MARK );

		if ( endMarkIndex < startMarkIndex ) {
			return [];
		}
		markedSentence = markedSentence.replace( END_MARK, "" );

		offsets.push( {
			startOffset: startMarkIndex,
			endOffset: endMarkIndex,
		} );

		startMarkIndex = doesNotContainDoubleQuotedMark
			? markedSentence.indexOf( START_MARK )
			: markedSentence.indexOf( START_MARK_DOUBLE_QUOTED );

		endMarkIndex = null;
	}

	return offsets;
}

/**
 * Finds all indices for a given string in a text.
 * A helper for search-based highlighting.
 *
 * @param {string}  text          Text to search through.
 * @param {string}  stringToFind  Text to search for.
 * @param {boolean} caseSensitive True if the search is case-sensitive.
 *
 * @returns {number[]} All indices of the found occurrences.
 */
export function getIndicesOf( text, stringToFind, caseSensitive = true ) {
	const indices = [];
	if ( text.length  === 0 ) {
		return indices;
	}

	let searchStartIndex = 0;
	let index;

	if ( ! caseSensitive ) {
		stringToFind = stringToFind.toLowerCase();
		text = text.toLowerCase();
	}

	while ( ( index = text.indexOf( stringToFind, searchStartIndex ) ) > -1 ) {
		indices.push( index );
		searchStartIndex = index + stringToFind.length;
	}

	return indices;
}

/**
 * Calculates an annotation if the given mark is applicable to the content of a block.
 * A helper for search-based highlighting.
 *
 * @param {string} text The content of the block.
 * @param {Mark}   mark The mark to apply to the content.
 *
 * @returns {[{startOffset: number, endOffset: number}]} The annotations to apply.
 */
export function calculateAnnotationsForTextFormat( text, mark ) {
	/*
	 * Remove all tags from the original sentence.
	 *
     * A cool <b>keyword</b>. => A cool keyword.
	 */
	const originalSentence = mark.getOriginal().replace( /(<([^>]+)>)/ig, "" );
	/*
	 * Remove all tags except yoastmark tags from the marked sentence.
	 *
     * A cool <b><yoastmark>keyword</yoastmark></b>. => A cool <yoastmark>keyword</yoastmark>
	 */
	const markedSentence = mark.getMarked().replace( /(<(?!\/?yoastmark)[^>]+>)/ig, "" );
	/*
	 * A sentence can occur multiple times in a text, therefore we calculate all indices where
	 * the sentence occurs. We then calculate the marker offsets for a single sentence and offset
	 * them with each sentence index.
	 *
	 * ( "A cool text. A cool keyword.", "A cool keyword." ) => [ 13 ]
	 */
	const sentenceIndices = getIndicesOf( text, originalSentence );

	if ( sentenceIndices.length === 0 ) {
		return [];
	}

	/*
	 * Calculate the mark offsets within the sentence that the current mark targets.
	 *
	 * "A cool <yoastmark>keyword</yoastmark>." => [ { startOffset: 7, endOffset: 14 } ]
	 */
	const yoastmarkOffsets = getYoastmarkOffsets( markedSentence );

	const blockOffsets = [];

	/*
	 * The offsets array holds all start- and endtag offsets for a single sentence. We now need
	 * to apply all sentence offsets to each offset to properly map them to the blocks content.
	 */
	yoastmarkOffsets.forEach( ( yoastmarkOffset ) => {
		sentenceIndices.forEach( sentenceIndex => {
			/*
			 * The yoastmarkOffset.startOffset and yoastmarkOffset.endOffset are offsets of the <yoastmark>
			 * relative to the start of the Mark object. The sentenceIndex is the index form the start of the
			 * RichText until the matched Mark, so to calculate the offset from the RichText to the <yoastmark>
			 * we need to add those offsets.
			 *
			 * startOffset = ( sentenceIndex ) 13 + ( yoastmarkOffset.startOffset ) 7 = 20
			 * endOffset =   ( sentenceIndex ) 13 + ( yoastmarkOffset.endOffset ) 14  = 27
			 *
			 * "A cool text. A cool keyword."
			 *      ( startOffset ) ^20   ^27 ( endOffset )
			 */
			const startOffset = sentenceIndex + yoastmarkOffset.startOffset;
			let endOffset = sentenceIndex + yoastmarkOffset.endOffset;

			/*
			 * If the marks are at the beginning and the end we can use the length, which gives more
			 * consistent results given we strip HTML tags.
			 */
			if ( yoastmarkOffset.startOffset === 0 && yoastmarkOffset.endOffset === mark.getOriginal().length ) {
				endOffset = sentenceIndex + originalSentence.length;
			}

			blockOffsets.push( {
				startOffset,
				endOffset,
			} );
		} );
	} );
	return blockOffsets;
}
