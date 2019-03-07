/** @module analyses/calculateFleschReading */

import stripNumbers from "../stringProcessing/stripNumbers.js";

import countSentences from "../stringProcessing/countSentences.js";
import countWords from "../stringProcessing/countWords.js";
import countSyllables from "../stringProcessing/syllables/count.js";
import formatNumber from "../helpers/formatNumber.js";
import getLanguage from "../helpers/getLanguage.js";

/**
 * Calculates an average from a total and an amount
 *
 * @param {number} total The total.
 * @param {number} amount The amount.
 * @returns {number} The average from the total and the amount.
 */
const getAverage = function( total, amount ) {
	return total / amount;
};

/**
 * This calculates the flesch reading score for a given text.
 *
 * @param {object} paper The paper containing the text
 * @returns {number} The score of the flesch reading test
 */
export default function( paper ) {
	let score;
	let text = paper.getText();
	const locale = paper.getLocale();
	const language = getLanguage( locale );
	if ( text === "" ) {
		return 0;
	}

	text = stripNumbers( text );

	const numberOfSentences = countSentences( text );

	const numberOfWords = countWords( text );

	// Prevent division by zero errors.
	if ( numberOfSentences === 0 || numberOfWords === 0 ) {
		return 0;
	}

	const numberOfSyllables = countSyllables( text, locale );
	const averageWordsPerSentence = getAverage( numberOfWords, numberOfSentences );
	const syllablesPer100Words = numberOfSyllables * ( 100 / numberOfWords );

	switch ( language ) {
		case "nl":
			score = 206.84 - ( 0.77 * syllablesPer100Words ) - ( 0.93 * ( averageWordsPerSentence  ) );
			break;
		case "de":
			score = 180 - averageWordsPerSentence - ( 58.5 * numberOfSyllables / numberOfWords );
			break;
		case "it":
			score = 217 - ( 1.3 * averageWordsPerSentence ) - ( 0.6 * syllablesPer100Words );
			break;
		case "ru":
			score = 206.835 - ( 1.3 * numberOfWords / numberOfSentences ) - ( 60.1 * numberOfSyllables / numberOfWords );
			break;

		case "es":
			score = 206.84 - ( 1.02 * numberOfWords / numberOfSentences ) - ( 0.6 * syllablesPer100Words );
			break;

		case "fr":
			score = 207 - ( 1.015 * numberOfWords / numberOfSentences ) - ( 73.6 * numberOfSyllables / numberOfWords );
			break;

		case "en":
		default:
			score = 206.835 - ( 1.015 * ( averageWordsPerSentence ) ) - ( 84.6 * ( numberOfSyllables / numberOfWords ) );
			break;
	}


	return formatNumber( score );
}
