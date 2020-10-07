/** @module analyses/calculateFleschReading */

import stripNumbers from "../helpers/sanitize/stripNumbers.js";
import countSentences from "../helpers/sentence/countSentences.js";
import countWords from "../helpers/word/countWords.js";
import countSyllables from "../helpers/syllables/count.js";

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
 * @returns {object} The flesch reading statistics
 */
export default function( paper ) {
	let text = paper.getText();
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

	return {
		numberOfSentences,
		numberOfWords,
		numberOfSyllables,
		averageWordsPerSentence,
		syllablesPer100Words
	};
}
