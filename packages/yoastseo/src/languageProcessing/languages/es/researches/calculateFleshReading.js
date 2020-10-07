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
	const { numberOfWords, numberOfSentences, syllablesPer100Words } = getFleschReadingStatistics( paper );

	const score = 206.84 - ( 1.02 * numberOfWords / numberOfSentences ) - ( 0.6 * syllablesPer100Words );
	return formatNumber( score );
}
