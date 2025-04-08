import { getWordsFromTokens } from "../helpers/word/getAllWordsFromTree";

/**
 * @typedef {Object} ParagraphLength
 * @property {Paragraph} paragraph The paragraph.
 * @property {number} paragraphLength The length of the paragraph.
 */

/**
 * Gets all paragraphs and their word counts or character counts from the text.
 *
 * @param {Paper} 		paper 		The paper object to get the text from.
 * @param {Researcher} 	researcher 	The researcher to use for analysis.
 *
 * @returns {ParagraphLength[]} The array containing an object with the paragraph word or character count and paragraph text.
 */
export default function( paper, researcher ) {
	const paragraphs = paper.getTree().findAll( node => node.name === "p" );
	const paragraphLengths = [];

	paragraphs.forEach( paragraph => {
		const customLengthHelper = researcher.getHelper( "customCountLength" );
		const tokens = paragraph.sentences.map( sentence => sentence.tokens ).flat();
		const length = customLengthHelper ? customLengthHelper( paragraph.innerText() ) : getWordsFromTokens( tokens, false ).length;
		if ( length > 0 ) {
			paragraphLengths.push( {
				paragraph: paragraph,
				paragraphLength: length,
			} );
		}
	} );

	return paragraphLengths;
}
