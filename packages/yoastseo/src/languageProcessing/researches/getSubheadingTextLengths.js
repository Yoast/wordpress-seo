import getSubheadingTexts from "../helpers/html/getSubheadingTexts";
import excludeTableOfContentsTag from "../helpers/sanitize/excludeTableOfContentsTag";
import wordCount from "../helpers/word/countWords";
import countWords from "../helpers/word/countWords";
import { forEach } from "lodash-es";

/**
 * Gets the subheadings from the text and returns the length of these subheading in an array.
 *
 * @param {Paper}       paper       The Paper object to get the text from.
 * @param {Researcher}  researcher  The researcher to use for analysis.
 *
 * @returns {Object} The object containing the array of found subheadings and the length of the text before the first subheading.
 */
export default function( paper, researcher ) {
	const text = excludeTableOfContentsTag( paper.getText() );
	const matches = getSubheadingTexts( text );

	// An optional custom helper to count length to use instead of countWords.
	const customCountLength = researcher.getHelper( "customCountLength" );

	const foundSubheadings = [];

	forEach( matches, function( match ) {
		foundSubheadings.push( {
			subheading: match.subheading,
			text: match.text,
			countLength: customCountLength ? customCountLength( match.text ) : countWords( match.text ),
			index: match.index,
		} );
	} );

	let textBeforeFirstSubheadingLength = 0;
	if ( foundSubheadings.length > 0 ) {
		// Find first subheading.
		const firstSubheading =  foundSubheadings[ 0 ];
		// Retrieve text preceding first subheading.
		const textBeforeFirstSubheading = text.slice( 0, firstSubheading.index );
		textBeforeFirstSubheadingLength = customCountLength
			? customCountLength( textBeforeFirstSubheading )
			: wordCount( textBeforeFirstSubheading );
	}

	return { foundSubheadings: foundSubheadings, textBeforeFirstSubheadingLength: textBeforeFirstSubheadingLength };
}
