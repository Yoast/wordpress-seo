import { languageProcessing } from "yoastseo";
const { sanitizeString, helpers } = languageProcessing;

const centerAlignRegex = /class=["']has-text-align-center["']/i;
const paragraphsRegex = /<p(?:[^>]+)?>(.*?)<\/p>/ig;
const headingsRegex = /<h([1-6])(?:[^>]+)?>(.*?)<\/h\1>/ig;

/**
 *
 * Filters out all elements that are center-aligned and longer than 50 characters (after stripping HTML tags).
 *
 * @param {string[]} elements	An array containing all cases of a specific element that were found in a text.
 *
 * @returns {string[]}	An array containing all elements of a specific type that are center-aligned and longer than 50 characters.
 */
function getLongCenterAlignedElements( elements ) {
	/**
	 * Before counting characters of the text, we sanitize the text first by removing HTML tags.
	 * In the filtered array, we save the unsanitized text.
	 * This text will be used for highlighting feature where we will match this with the html of a post.
	 */
	return elements.filter( element => centerAlignRegex.test( element ) && sanitizeString( element ).length > 50  );
}

/**
 *
 * Finds all paragraphs and headings that are center-aligned and longer than 50 characters (after stripping html tags).
 *
 * Returns an array with one object per paragraph/heading.
 * For example: [ {text: "abc", typeOfBlock: "heading"}, {text: "123", typeOfBlock: "paragraph"} ].
 *
 * @param {Paper}	paper	The paper to analyze.
 *
 * @returns {Object[]}	An array of objects for each too long center-aligned paragraph/heading.
 */
export default function( paper ) {
	let text = paper.getText();
	// Normalize quotes.
	text = helpers.normalize( text );

	const longBlocksOfCenterAlignedText = [];
	// Get all paragraphs from the text. We only retrieve the paragraphs with <p> tags.
	const allParagraphs = helpers.matchStringWithRegex( text, paragraphsRegex );
	// Get all the headings from the text. Here we retrieve the headings from level 1-6.
	const allHeadings = helpers.matchStringWithRegex( text, headingsRegex );

	const longParagraphsWithCenterAlignedText = getLongCenterAlignedElements( allParagraphs );
	const longHeadingsWithCenterAlignedText = getLongCenterAlignedElements( allHeadings );

	if ( longParagraphsWithCenterAlignedText.length > 0 ) {
		longParagraphsWithCenterAlignedText.forEach( paragraph => {
			longBlocksOfCenterAlignedText.push( { text: paragraph, typeOfBlock: "paragraph" } );
		} );
	}

	if ( longHeadingsWithCenterAlignedText.length > 0 ) {
		longHeadingsWithCenterAlignedText.forEach( heading => {
			longBlocksOfCenterAlignedText.push( { text: heading, typeOfBlock: "heading" } );
		} );
	}

	return longBlocksOfCenterAlignedText;
}
