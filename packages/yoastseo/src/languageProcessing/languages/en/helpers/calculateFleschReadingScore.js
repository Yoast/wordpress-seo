/** @module analyses/calculateFleschReading */

import formatNumber from "../../../../helpers/formatNumber.js";
import getFleschReadingStatistics from "../../../helpers/fleschReading/getFleschReadingStatistics";
import syllables from "../config/internal/syllables";

/**
 * This calculates the flesch reading score for a given text in English.
 *
 * @param {Object} paper The paper containing the text.
 *
 * @returns {number} The score of the flesch reading test in English.
 */
export default function( paper ) {
	const { averageWordsPerSentence, numberOfSyllables, numberOfWords } = getFleschReadingStatistics( paper, syllables );

	const score = 206.835 - ( 1.015 * ( averageWordsPerSentence ) ) - ( 84.6 * ( numberOfSyllables / numberOfWords ) );
	return formatNumber( score );
}
