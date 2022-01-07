/**
 * Checks if exact match functionality is requested by enclosing the keyphrase in double quotation marks.
 * This function should be called after the single and double quotes are normalised using `normalizeQuotes()`.
 *
 * @param {string}  keyphrase       The keyphrase to check. This must be the keyphrase accessed directly from the Paper.
 *
 * @returns {Object} Whether the exact match functionality is requested and the keyword stripped from double quotes.
 */
export default function processExactMatchRequest( keyphrase ) {
	const exactMatchRequest = { exactMatchRequested: false, keyphrase: keyphrase };

	// Check if only exact match processing is requested by the user. If so, strip the quotation marks from the keyphrase.
	if ( keyphrase[ 0 ] === "\"" && keyphrase[ keyphrase.length - 1 ] === "\"" ) {
		exactMatchRequest.keyphrase = keyphrase.substring( 1, keyphrase.length - 1 );
		exactMatchRequest.exactMatchRequested = true;
	}

	return exactMatchRequest;
}
