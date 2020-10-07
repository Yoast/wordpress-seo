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
	const { numberOfSyllables, numberOfSentences, numberOfWords } = getFleschReadingStatistics( paper );

	const score = 206.835 - ( 1.3 * numberOfWords / numberOfSentences ) - ( 60.1 * numberOfSyllables / numberOfWords );
	return formatNumber( score );
}
