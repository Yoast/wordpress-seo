/**
 * Calculates the keyphrase length weighting factor used to calculate the keyword density and the recommended keyword count.
 * Keyphrase length gets a base weight of 0.7, plus a specific weight for the keyphrase length (keyphraseLength / 3).
 *
 * @param {number} keyphraseLength The length of the keyphrase in words.
 * @returns {number} The keyphrase length weighting factor.
 */
export default function( keyphraseLength ) {
	return ( 0.7 + keyphraseLength / 3 );
}
