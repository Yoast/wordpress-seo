import formatNumber from "../../../../helpers/formatNumber.js";

/**
 * Returns the Flesch reading score for German.
 *
 * @param {Object} statistics The Flesch reading statistics.
 *
 * @returns {number} The Flesch reading score for German.
 */
export default function calculateScore( statistics ) {
	const score = 180 - statistics.averageWordsPerSentence - ( 58.5 * statistics.numberOfSyllables / statistics.numberOfWords );

	return formatNumber( score );
}
