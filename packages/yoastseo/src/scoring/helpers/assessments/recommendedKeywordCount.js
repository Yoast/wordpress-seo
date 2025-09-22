import keyphraseLengthFactor from "./keyphraseLengthFactor.js";

/**
 * Calculates a recommended keyphrase count for a paper's text. The formula to calculate this number is based on the
 * keyphrase density formula.
 *
 * @param {number}	keyphraseLength				The length of the focus keyphrase in words.
 * @param {number}	recommendedKeyphraseDensity	The recommended keyphrase density (either maximum or minimum).
 * @param {string}	maxOrMin					Whether it's a maximum or minimum recommended keyphrase density.
 * @param {number}	textLength					The length of the text in words.
 *
 * @returns {number} The recommended keyphrase count.
 */
export default function( keyphraseLength, recommendedKeyphraseDensity, maxOrMin, textLength ) {
	if ( textLength === 0 ) {
		return 0;
	}

	const lengthKeyphraseFactor = keyphraseLengthFactor( keyphraseLength );
	const recommendedKeyphraseCount = ( recommendedKeyphraseDensity * textLength ) / ( 100 * lengthKeyphraseFactor );

	// Always recommend at least two occurrences for longer texts.
	if ( recommendedKeyphraseCount < 2 ) {
		return 2;
	}

	switch ( maxOrMin ) {
		case "min":
			// Round up for the recommended minimum count.
			return Math.ceil( recommendedKeyphraseCount );
		default:
		case "max":
			// Round down for the recommended maximum count.
			return Math.floor( recommendedKeyphraseCount );
	}
}
