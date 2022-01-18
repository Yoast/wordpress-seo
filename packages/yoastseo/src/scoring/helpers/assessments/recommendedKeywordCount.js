import countWords from "../../../languageProcessing/helpers/word/countWords";
import keyphraseLengthFactor from "./keyphraseLengthFactor.js";

/**
 * Calculates a recommended keyword count for a text. The formula to calculate this number is based on the
 * keyword density formula.
 *
 * @param {string} text The paper text.
 * @param {number} keyphraseLength The length of the focus keyphrase in words.
 * @param {number} recommendedKeywordDensity The recommended keyword density (either maximum or minimum).
 * @param {string} maxOrMin Whether it's a maximum or minimum recommended keyword density.
 * @param {function} customGetWords A helper to get words from the text for languages that don't use the default approach.
 *
 * @returns {number} The recommended keyword count.
 */
export default function( text, keyphraseLength, recommendedKeywordDensity, maxOrMin, customGetWords ) {
	const wordCount = customGetWords ? customGetWords( text ).length : countWords( text );

	if ( wordCount === 0 ) {
		return 0;
	}

	const lengthKeyphraseFactor = keyphraseLengthFactor( keyphraseLength );
	const recommendedKeywordCount = ( recommendedKeywordDensity * wordCount ) / ( 100 * lengthKeyphraseFactor );

	/*
	 * The recommended keyword count should always be at least 2,
	 * regardless of the keyword density, the word count, or the keyphrase length.
	 */
	if ( recommendedKeywordCount < 2 ) {
		return 2;
	}

	switch ( maxOrMin ) {
		case "min":
			// Round up for the recommended minimum count.
			return Math.ceil( recommendedKeywordCount );
		default:
		case "max":
			// Round down for the recommended maximum count.
			return Math.floor( recommendedKeywordCount );
	}
}
