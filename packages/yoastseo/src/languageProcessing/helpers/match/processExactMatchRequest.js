/**
 * Checks if exact match functionality is requested by enclosing the keyphrase in double quotation marks.
 *
 * @param {string}  keyphrase       The keyphrase to check.
 * @param {array}   doubleQuotes    The double quotes to check.
 *
 * @returns {Object} Whether the exact match functionality is requested and the keyword stripped from double quotes.
 */
export default function processExactMatchRequest( keyphrase, doubleQuotes ) {
	const exactMatchRequest = { exactMatchRequested: false, keyphrase: keyphrase };

	// Check if only exact match processing is requested by the user. If so, strip the quotation marks from the keyphrase.
	if ( doubleQuotes.includes( keyphrase[ 0 ] ) && doubleQuotes.includes( keyphrase[ keyphrase.length - 1 ] ) ) {
		exactMatchRequest.keyphrase = keyphrase.substring( 1, keyphrase.length - 1 );
		exactMatchRequest.exactMatchRequested = true;
	}

	return exactMatchRequest;
}
