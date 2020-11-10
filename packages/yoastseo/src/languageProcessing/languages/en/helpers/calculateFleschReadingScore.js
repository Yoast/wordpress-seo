import formatNumber from "../../../../helpers/formatNumber.js";

/**
 * Returns the Flesch reading score for English.
 *
 * @param {Object} statistics The Flesch reading statistics.
 *
 * @returns {number} The Flesch reading score for English.
 */
export default function calculateScore( statistics ) {
	const score = 206.835 - ( 1.015 * ( statistics.averageWordsPerSentence ) ) -
		( 84.6 * ( statistics.numberOfSyllables / statistics.numberOfWords ) );

	return formatNumber( score );
}
