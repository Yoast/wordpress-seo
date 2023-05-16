import getSentences from "../helpers/sentence/getSentences";

/**
 * Returns the sentences from a paper.
 *
 * @param {Paper}   paper       The paper to analyze.
 * @param {object}  researcher  The researcher.
 *
 * @returns {Array} Sentences found in the paper.
 */
export default function( paper, researcher ) {
	const memoizedTokenizer = researcher.getHelper( "memoizedTokenizer" );

	return getSentences( paper.getText(), memoizedTokenizer );
}
