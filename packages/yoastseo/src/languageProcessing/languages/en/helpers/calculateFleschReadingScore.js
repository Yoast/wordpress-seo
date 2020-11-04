import formatNumber from "../../../../helpers/formatNumber.js";

/**
 * Returns the flesch reading score for English.
 *
 * @param {Object} statistics   The flesch reading statistics.
 *
 * @returns {number}    The flesch reading score for English.
 */
function calculateScore( statistics ) {
	const score = 206.835 - ( 1.015 * ( statistics.averageWordsPerSentence ) ) -
		( 84.6 * ( statistics.numberOfSyllables / statistics.numberOfWords ) );
	return formatNumber( score );
}

/**
 * Returns the function that calculates the score of the flesch reading test for a given text in English.
 *
 * @param {Object} statistics   The flesch reading statistics.
 *
 * @returns {Function} The function that calculates the score of the flesch reading test in English.
 */
export default function( statistics ) {
	return calculateScore( statistics );
}
