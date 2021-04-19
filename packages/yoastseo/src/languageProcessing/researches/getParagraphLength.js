import countWords from "../helpers/word/countWords.js";
import matchParagraphs from "../helpers/html/matchParagraphs.js";
import { filter } from "lodash-es";

/**
 * Gets all paragraphs and their word counts from the text.
 *
 * @param {Paper} paper The paper object to get the text from.
 * @returns {Array} The array containing an object with the paragraph word count and paragraph text.
 */
export default function( paper ) {
	const text = paper.getText();
	const paragraphs = matchParagraphs( text );
	const paragraphsLength = [];
	paragraphs.map( function( paragraph ) {
		paragraphsLength.push( {
			wordCount: countWords( paragraph ),
			text: paragraph,
		} );
	} );

	return filter( paragraphsLength, function( paragraphLength ) {
		return ( paragraphLength.wordCount > 0 );
	} );
}
