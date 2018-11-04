import getWords from "yoastsrc/stringProcessing/getWords";
import { getRelevantWords } from "yoastsrc/stringProcessing/relevantWords";
import WordCombination from "yoastsrc/values/WordCombination";

/**
 * Rounds number to four decimals.
 *
 * @param {number} number The number to be rounded.
 *
 * @returns {number} The rounded number.
 */
function formatNumber( number ) {
	if ( Math.round( number ) === number ) {
		return number;
	}

	return Math.round( number * 10000 ) / 10000;
}

/**
 * Calculates all properties for the relevant word objects.
 *
 * @param {string} text             The content.
 * @param {string} [locale="en_US"] The locale of the text.
 *
 * @returns {Object} The relevant word objects.
 */
export default function calculateRelevantWords( text, locale = "en_US" ) {
	const words = getWords( text );

	return getRelevantWords( text, locale ).map( ( word ) => {
		const output = {
			word: word.getCombination(),
			relevance: formatNumber( word.getRelevance() ),
			length: word._length,
			occurrences: word.getOccurrences(),
			multiplier: formatNumber( word.getMultiplier( word.getRelevantWordPercentage() ) ),
			relevantWordPercentage: formatNumber( word.getRelevantWordPercentage() ),
		};

		if ( word._length === 1 ) {
			output.lengthBonus = "";
		} else {
			output.lengthBonus = WordCombination.lengthBonus[ word._length ];
		}

		output.density = formatNumber( word.getDensity( words.length ) );

		return output;
	} );
}
