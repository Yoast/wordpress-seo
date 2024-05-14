import getSubheadingTexts from "../helpers/html/getSubheadingTexts";
import countWords from "../helpers/word/countWords";
import { forEach } from "lodash";
import removeHtmlBlocks from "../helpers/html/htmlParser";
import { filterShortcodesFromHTML } from "../helpers";

/**
 * Gets the subheadings from the text and returns the length of these subheading in an array.
 *
 * @param {Paper}       paper       The Paper object to get the text from.
 * @param {Researcher}  researcher  The researcher to use for analysis.
 *
 * @returns {Object} The object containing the array of found subheadings and the length of the text before the first subheading.
 */
export default function( paper, researcher ) {
	let text = paper.getText();
	text = removeHtmlBlocks( text );
	text = filterShortcodesFromHTML( text, paper._attributes && paper._attributes.shortcodes );
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
	let textBeforeFirstSubheading = "";
	if ( foundSubheadings.length > 0 ) {
		// Find first subheading.
		const firstSubheading =  foundSubheadings[ 0 ];
		// Retrieve text preceding first subheading.
		textBeforeFirstSubheading = text.slice( 0, firstSubheading.index );
		textBeforeFirstSubheadingLength = customCountLength
			? customCountLength( textBeforeFirstSubheading )
			: countWords( textBeforeFirstSubheading );
	}

	// Check if there is a text before the first subheading.
	if ( textBeforeFirstSubheadingLength > 0 && textBeforeFirstSubheading !== "" ) {
		// Also add the text before the first subheading to the array.
		foundSubheadings.unshift( {
			// Assign an empty string for the subheading for text that comes before the first subheading.
			subheading: "",
			text: textBeforeFirstSubheading,
			countLength: textBeforeFirstSubheadingLength,
		} );
	}

	return foundSubheadings;
}
