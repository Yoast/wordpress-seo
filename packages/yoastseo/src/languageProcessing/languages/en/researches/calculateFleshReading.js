/** @module analyses/calculateFleschReading */

import formatNumber from "../../../../helpers/formatNumber.js";
import getFleschReadingStatistics from "../../../helpers/fleschReadingTest/getFleschReadingStatistics";

/**
 * This calculates the flesch reading score for a given text.
 *
 * @param {object} paper The paper containing the text
 * @returns {number} The score of the flesch reading test
 */
export default function( paper ) {
	const { numberOfWords, numberOfSyllables, averageWordsPerSentence } = getFleschReadingStatistics( paper );

	const score = 206.835 - ( 1.015 * ( averageWordsPerSentence ) ) - ( 84.6 * ( numberOfSyllables / numberOfWords ) );
	return formatNumber( score );
}
