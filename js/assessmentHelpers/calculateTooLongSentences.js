/**
 * Calculates the score based on the percentage of too long sentences.
 * @param {number} percentage The percentage of too long sentences
 * @returns {number} the score
 */
module.exports = function( percentage ) {

	// Scale percentages from 21.7 to 31.7 to a score. 21.7 scores 9, 31.7 score 3.
	// We use 10 steps (between 9 and 3), so each step is 0.6
	var unboundedScore = 9 - ( 0.6 ) * ( percentage - 21.7 );

	// Scores exceeding 9 are 9, scores below 3 are 3.
	return Math.max( Math.min( unboundedScore, 9 ), 3 );
};
