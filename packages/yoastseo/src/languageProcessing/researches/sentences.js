import getSentences from "../helpers/sentence/getSentences";
import removeHtmlBlocks from "../helpers/html/htmlParser";
import { filterShortcodesFromHTML } from "../helpers";

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

	let text = paper.getText();
	text = removeHtmlBlocks( text );
	text = filterShortcodesFromHTML( text, paper._attributes && paper._attributes.shortcodes );
	return getSentences( text, memoizedTokenizer );
}
