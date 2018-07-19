/** @module analyses/getTopicDensity */

const countWords = require( "../stringProcessing/countWords.js" );
const topicCount = require( "./topicCount.js" );

/**
 * Calculates the topic density .
 *
 * @param {Object} paper The paper containing keyword, (synonyms) and text.
 * @returns {number} The topic density.
 */
module.exports = function( paper ) {
	const wordCount = countWords( paper.getText() );
	if ( wordCount === 0 ) {
		return 0;
	}
	const topicCountResult = topicCount( paper ).count;
	return ( topicCountResult / wordCount ) * 100;
};
