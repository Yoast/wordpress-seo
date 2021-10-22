import excludeTableOfContentsTag from "../../../helpers/sanitize/excludeTableOfContentsTag";
import countCharacters from "../../ja/helpers/countCharacters.js";
import matchParagraphs from "../../../helpers/html/matchParagraphs.js";
import { filter } from "lodash-es";

/**
 * Gets all paragraphs and their character counts from the text.
 *
 * @param {Paper} paper The paper object to get the text from.
 * @returns {Array} The array containing an object with the paragraph character count and paragraph text.
 */
export default function( paper ) {
	const text = excludeTableOfContentsTag( paper.getText() );
	const textNoImg = text.replace( "<img(?:[^>]+)?>", "" );
	const paragraphs = matchParagraphs( textNoImg );
	const paragraphsLength = [];
	paragraphs.map( function( paragraph ) {
		paragraphsLength.push( {
			characterCount: countCharacters( paragraph ),
			textNoImg: paragraph,
		} );
	} );

	return filter( paragraphsLength, function( paragraphLength ) {
		return ( paragraphLength.characterCount > 0 );
	} );
}
