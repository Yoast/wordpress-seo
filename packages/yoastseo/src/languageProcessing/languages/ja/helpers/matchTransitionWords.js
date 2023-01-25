import getWords from "./getWords";

/**
 * Matches the sentence against transition words.
 *
 * @param {string} sentence The sentence to match against.
 * @param {Array} transitionWords The array containing transition words.
 * @returns {Array} The found transitional words.
 */
export default function( sentence, transitionWords ) {
	// Retrieve the words from the segmenter, join into string for easier comparison through the contains function.
	const words = getWords( sentence ).join( "|" );

	const results = [];

	transitionWords.forEach( function( transitionWord ) {
		// The transitionWords are segmented, like the sentence, so join here as well.
		const target = transitionWord.join( "|" );
		if ( words.includes( target ) ) {
			results.push( transitionWord );
		}
	} );

	return results;
}
