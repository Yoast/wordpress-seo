import getSentences from '../stringProcessing/getSentences';
import sentencesLength from './../stringProcessing/sentencesLength.js';

/**
 * Counts sentences in the description..
 * @param {Paper} paper The Paper object to get description from.
 * @returns {Array} The sentences from the text.
 */
export default function( paper ) {
	var sentences = getSentences( paper.getDescription() );
	return sentencesLength( sentences );
};
