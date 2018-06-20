/** @module analyses/getTopicDensity */

const countWords = require( "../stringProcessing/countWords.js" );

/**
 * Calculates the topic density .
 *
 * @param {object} paper The paper containing keyword, (synonyms) and text.
 * @param {object} researcher The researcher.
 * @returns {number} The topic density.
 */
module.exports = function( paper, researcher ) {
	const wordCount = countWords( paper.getText() );
	if ( wordCount === 0 ) {
		return 0;
	}
	const topicCount = researcher.getResearch( "topicCount" ).count;
	return ( topicCount / wordCount ) * 100;
};
