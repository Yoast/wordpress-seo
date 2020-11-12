import formatNumber from "../../../../helpers/formatNumber.js";

/**
 * Returns the Flesch reading score for French.
 *
 * @param {Object} statistics The Flesch reading statistics.
 *
 * @returns {number} The Flesch reading score for French.
 */
export default function calculateScore( statistics ) {
	const score = 207 - ( 1.015 * statistics.numberOfWords / statistics.numberOfSentences ) -
		( 73.6 * statistics.numberOfSyllables / statistics.numberOfWords );

	return formatNumber( score );
}
