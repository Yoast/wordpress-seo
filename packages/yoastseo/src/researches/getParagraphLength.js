import countWords from "../stringProcessing/countWords.js";
import matchParagraphs from "../stringProcessing/matchParagraphs.js";
import { filter } from "lodash-es";

/**
 * Gets all paragraphs and their word counts from the text.
 *
 * @param {Paper} paper The paper object to get the text from.
 * @returns {Array} The array containing an object with the paragraph word count and paragraph text.
 */
export default function( paper ) {
	var text = paper.getText();
	var paragraphs = matchParagraphs( text );
	var paragraphsLength = [];
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
