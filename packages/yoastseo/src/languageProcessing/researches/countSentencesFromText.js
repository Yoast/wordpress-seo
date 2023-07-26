import getSentences from "../helpers/sentence/getSentences";
import sentencesLength from "../helpers/sentence/sentencesLength.js";
import removeHtmlBlocks from "../helpers/html/htmlParser";
import { filterShortcodesFromHTML } from "../helpers";

/**
 * Count sentences in the text.
 * @param {Paper} paper The Paper object to get text from.
 * @param {Researcher} 	researcher 	The researcher to use for analysis.
 * @returns {Array} The sentences from the text.
 */
export default function( paper, researcher ) {
	const memoizedTokenizer = researcher.getHelper( "memoizedTokenizer" );
	let text = paper.getText();
	text = removeHtmlBlocks( text );
	text = filterShortcodesFromHTML( text, paper._attributes && paper._attributes.shortcodes );
	const sentences = getSentences( text, memoizedTokenizer );
	return sentencesLength( sentences, researcher );
}
