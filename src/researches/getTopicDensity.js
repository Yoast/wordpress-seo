/** @module analyses/getTopicDensity */

import countWords from '../stringProcessing/countWords.js';

import topicCount from './topicCount.js';

/**
 * Calculates the topic density .
 *
 * @param {Object} paper The paper containing keyword, (synonyms) and text.
 * @returns {number} The topic density.
 */
export default function( paper ) {
	const wordCount = countWords( paper.getText() );
	if ( wordCount === 0 ) {
		return 0;
	}
	const topicCountResult = topicCount( paper ).count;
	return ( topicCountResult / wordCount ) * 100;
};
