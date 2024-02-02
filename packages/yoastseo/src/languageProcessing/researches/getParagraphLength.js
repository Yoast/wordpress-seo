import { imageRegex } from "../helpers/image/imageInText";
import sanitizeLineBreakTag from "../helpers/sanitize/sanitizeLineBreakTag";
import countWords from "../helpers/word/countWords.js";
import matchParagraphs from "../helpers/html/matchParagraphs.js";
import { filter } from "lodash-es";
import removeHtmlBlocks from "../helpers/html/htmlParser";
import { filterShortcodesFromHTML } from "../helpers";

/**
 * Gets all paragraphs and their word counts or character counts from the text.
 *
 * @param {Paper} 		paper 		The paper object to get the text from.
 * @param {Researcher} 	researcher 	The researcher to use for analysis.
 *
 * @returns {Array} The array containing an object with the paragraph word or character count and paragraph text.
 */
export default function( paper, researcher ) {
	let text = paper.getText();
	text = removeHtmlBlocks( text );
	text = filterShortcodesFromHTML( text, paper._attributes && paper._attributes.shortcodes );

	// Remove images from text before retrieving the paragraphs.
	// This step is done here so that applying highlight in captions is possible for ParagraphTooLongAssessment.
	text = text.replace( imageRegex, "" );

	// Replace line break tags containing attribute(s) with paragraph tag.
	text = sanitizeLineBreakTag( text );
	const paragraphs = matchParagraphs( text );
	const paragraphsLength = [];

	// An optional custom helper to count length to use instead of countWords.
	const customCountLength = researcher.getHelper( "customCountLength" );

	paragraphs.map( function( paragraph ) {
		paragraphsLength.push( {
			countLength: customCountLength ? customCountLength( paragraph ) : countWords( paragraph ),
			text: paragraph,
		} );
	} );

	return filter( paragraphsLength, function( paragraphLength ) {
		return ( paragraphLength.countLength > 0 );
	} );
}
