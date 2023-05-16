import getSentences from "../helpers/sentence/getSentences";
import removeHtmlBlocks from "../helpers/html/htmlParser";

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
	paper._text = removeHtmlBlocks( paper.getText() );

	return getSentences( paper.getText(), memoizedTokenizer );
}
