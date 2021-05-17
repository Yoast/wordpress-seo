import getSubheadingTexts from "../helpers/html/getSubheadingTexts";
import countWords from "../helpers/word/countWords";
import { forEach } from "lodash-es";

/**
 * Gets the subheadings from the text and returns the length of these subheading in an array.
 * @param {Paper} paper The Paper object to get the text from.
 * @returns {Array} The array with the length of each subheading.
 */
export default function( paper ) {
	const text = paper.getText();
	const matches = getSubheadingTexts( text );

	const subHeadingTexts = [];
	forEach( matches, function( subHeading ) {
		subHeadingTexts.push( {
			text: subHeading,
			wordCount: countWords( subHeading ),
		} );
	} );
	return subHeadingTexts;
}
