/**
 * Checks if the first token is directly followed by the second token.
 * @param {Token} firstToken The first token.
 * @param {Token} secondToken The second token.
 * @returns {boolean} Whether the tokens are consecutive.
 */
const tokensAreConsecutive = ( firstToken, secondToken ) => {
	return firstToken.sourceCodeRange.endOffset + 1 === secondToken.sourceCodeRange.startOffset;
};

/**
 * Matches the keyphrase forms in an array of tokens.
 * @param {Token[]} currentMatch The current match.
 * @param {Token[]} firstPreviousMatch The first previous match.
 * @param {Token[]} secondPreviousMatch The second previous match.
 * @returns {boolean} Whether the keyphrase forms are consecutive.
 */
const isConsecutiveKeyphrase = ( currentMatch, firstPreviousMatch, secondPreviousMatch ) => {
	return currentMatch[ 0 ].text === firstPreviousMatch[ 0 ].text &&
		tokensAreConsecutive( firstPreviousMatch[ 0 ], currentMatch[ 0 ] ) &&
		firstPreviousMatch[ 0 ].text === secondPreviousMatch[ 0 ].text &&
		tokensAreConsecutive( secondPreviousMatch[ 0 ], firstPreviousMatch[ 0 ] );
};

/**
 * Matches the keyphrase forms in an array of tokens.
 * @param {Object} result The result object.
 * @returns {{primaryMatches: *[], secondaryMatches: *[], position: number}} The result object with the consecutive keyphrase removed.
 */
const removeConsecutiveKeyphraseFromResult = ( result ) => {
	const newResult = { ...result, primaryMatches: [] };
	// If three or more matches are consecutive, only keep the first two.
	// Iterate backwards over the primary matches
	for ( let i = result.primaryMatches.length - 1; i >= 0; i-- ) {
		const currentMatch = result.primaryMatches[ i ];
		// If the current match consists of two or more tokens, add it to the front of the new primary matches.
		if ( currentMatch.length > 1 ) {
			newResult.primaryMatches.unshift( currentMatch );
			continue;
		}

		// If the current match is the same as the previous two matches, and it is consecutive, do not add it to the primary matches.
		const firstPreviousMatch = result.primaryMatches[ i - 1 ];
		const secondPreviousMatch = result.primaryMatches[ i - 2 ];

		if ( firstPreviousMatch && secondPreviousMatch ) {
			if ( isConsecutiveKeyphrase( currentMatch, firstPreviousMatch, secondPreviousMatch ) ) {
				continue;
			} else {
				newResult.primaryMatches.unshift( currentMatch );
			}
		} else {
			newResult.primaryMatches.unshift( currentMatch );
		}
	}
	return newResult;
};

export default removeConsecutiveKeyphraseFromResult;
