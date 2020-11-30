import formatNumber from "../../../../helpers/formatNumber.js";

/**
 * Returns the Flesch reading score for Dutch.
 *
 * @param {Object} statistics The Flesch reading statistics.
 *
 * @returns {number} The Flesch reading score for Dutch.
 */
export default function calculateScore( statistics ) {
	const score = 206.84 - ( 0.77 * statistics.syllablesPer100Words ) - ( 0.93 * ( statistics.averageWordsPerSentence  ) );

	return formatNumber( score );
}
