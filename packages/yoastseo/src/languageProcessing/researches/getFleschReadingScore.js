/** @module analyses/calculateFleschReading */

import stripNumbers from "../helpers/sanitize/stripNumbers.js";
import countSentences from "../helpers/sentence/countSentences.js";
import countWords from "../helpers/word/countWords.js";
import countSyllables from "../helpers/syllables/countSyllables.js";

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
 * This calculates the Flesch reading score for a given text.
 *
 * @param {Paper}       paper           The paper containing the text.
 * @param {Researcher}  researcher      The researcher.
 *
 * @returns {int} The Flesch reading score.
 */
export default function( paper, researcher ) {
	const syllables = researcher.getConfig( "syllables" );
	const memoizedTokenizer = researcher.getHelper( "memoizedTokenizer" );

	let text = paper.getText();
	if ( text === "" ) {
		return 0;
	}

	text = stripNumbers( text );

	const numberOfSentences = countSentences( text, memoizedTokenizer );

	const numberOfWords = countWords( text );

	// Prevent division by zero errors.
	if ( numberOfSentences === 0 || numberOfWords === 0 ) {
		return 0;
	}

	const numberOfSyllables = countSyllables( text, syllables );
	const averageWordsPerSentence = getAverage( numberOfWords, numberOfSentences );
	const syllablesPer100Words = numberOfSyllables * ( 100 / numberOfWords );
	const statistics = {
		numberOfSentences,
		numberOfWords,
		numberOfSyllables,
		averageWordsPerSentence,
		syllablesPer100Words,
	};

	const getScore = researcher.getHelper( "fleschReadingScore" );

	return getScore( statistics );
}
