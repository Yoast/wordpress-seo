import formatNumber from "../../../../helpers/formatNumber.js";

/**
 * Returns the Flesch reading score for Italian.
 *
 * @param {Object} statistics The Flesch reading statistics.
 *
 * @returns {number} The Flesch reading score for Italian.
 */
export default function calculateScore( statistics ) {
	const score = 217 - ( 1.3 * statistics.averageWordsPerSentence ) - ( 0.6 * statistics.syllablesPer100Words );

	return formatNumber( score );
}
