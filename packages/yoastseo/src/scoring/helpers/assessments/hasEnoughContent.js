import { stripFullTags as stripHTMLTags } from "../../../languageProcessing/helpers/sanitize/stripHTMLTags";
import excludeTableOfContentsTag from "../../../languageProcessing/helpers/sanitize/excludeTableOfContentsTag";

/**
 * Tests whether a paper object has enough content for assessments to be displayed.
 * @param {Paper} paper A Paper.js object that will be tested.
 * @param {number} minimalContentNeeded The minimum length in characters a text must have for assessments to be displayed.
 * @returns {boolean} true if the text is of the required length, false otherwise.
 */
export default function( paper, minimalContentNeeded = 50 ) {
	const text = stripHTMLTags( excludeTableOfContentsTag( paper.getText() ) );
	return ( text.length >= minimalContentNeeded );
}
