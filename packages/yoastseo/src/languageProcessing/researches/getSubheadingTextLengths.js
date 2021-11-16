import getSubheadingTexts from "../helpers/html/getSubheadingTexts";
import excludeTableOfContentsTag from "../helpers/sanitize/excludeTableOfContentsTag";
import countWords from "../helpers/word/countWords";
import { forEach } from "lodash-es";

/**
 * Gets the subheadings from the text and returns the length of these subheading in an array.
 *
 * @param {Paper}       paper       The Paper object to get the text from.
 * @param {Researcher}  researcher  The researcher to use for analysis.
 *
 * @returns {Array} The array with the length of each subheading.
 */
export default function( paper, researcher ) {
	const text = excludeTableOfContentsTag( paper.getText() );
	const matches = getSubheadingTexts( text );

	// An optional custom helper to count length to use instead of countWords.
	const customCountLength = researcher.getHelper( "customCountLength" );

	const subHeadingTexts = [];
	forEach( matches, function( subHeading ) {
		subHeadingTexts.push( {
			text: subHeading,
			countLength: customCountLength ? customCountLength( subHeading ) : countWords( subHeading ),
		} );
	} );
	return subHeadingTexts;
}
