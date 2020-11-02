/** @module analyses/calculateFleschReading */

import formatNumber from "../../../../helpers/formatNumber.js";
import getFleschReadingStatistics from "../../../researches/base/getFleschReadingStatistics";
import syllables from "../config/syllables";

/**
 * This calculates the flesch reading score for a given text.
 *
 * @param {Object} paper The paper containing the text.
 *
 * @returns {number} The score of the flesch reading test.
 */
export default function( paper ) {
	const { syllablesPer100Words, averageWordsPerSentence } = getFleschReadingStatistics( paper, syllables );

	const score = 206.84 - ( 0.77 * syllablesPer100Words ) - ( 0.93 * ( averageWordsPerSentence  ) );
	return formatNumber( score );
}
