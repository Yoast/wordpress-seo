import getSentences from "../helpers/sentence/getSentences.js";
import removeHtmlBlocks from "../helpers/html/htmlParser.js";
import { filterShortcodesFromHTML } from "../helpers/index.js";

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
