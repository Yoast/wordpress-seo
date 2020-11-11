import formatNumber from "../../../../helpers/formatNumber.js";

/**
 * Returns the Flesch reading score for Spanish.
 *
 * @param {Object} statistics The Flesch reading statistics.
 *
 * @returns {number} The Flesch reading score for Spanish.
 */
export default function calculateScore( statistics ) {
	const score = 206.84 - ( 1.02 * statistics.numberOfWords / statistics.numberOfSentences ) - ( 0.6 * statistics.syllablesPer100Words );

	return formatNumber( score );
}
