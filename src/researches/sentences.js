const getSentences = require( "../stringProcessing/getSentences" );

/**
 * Returns the sentences from a paper.
 *
 * @param {Paper} paper The paper to analyze.
 *
 * @returns {Array} Sentences found in the paper.
 */
export default function( paper ) {
	return getSentences( paper.getText() );
}
