import { map } from "lodash-es";
import { languageProcessing } from "yoastseo";
const { sanitizeString, normalize } = languageProcessing;

const centerAlignRegex = /class=["']has-text-align-center["']/i;
const paragraphsRegex = /<p(?:[^>]+)?>(.*?)<\/p>/ig;
const headingsRegex = /<h([1-6])(?:[^>]+)?>(.*?)<\/h\1>/ig;

/**
 * Finds all instances of a specified HTML element in the text.
 *
 * @param {string} text 		The text to match the element in.
 * @param {RegExp} elementRegex The regex for matching the element.
 *
 * @returns {string[]} An array with all the matched elements.
 */
const getAllElementsFromText = function( text, elementRegex ) {
	const elements = [];
	let match;

	while ( ( match = elementRegex.exec( text ) ) !== null ) {
		elements.push( match );
	}

	// Returns the whole element, including html tags.
	return map( elements, function( element ) {
		return element[ 0 ];
	} );
};

/**
 *
 * Filters out all elements that are center-aligned and longer than 50 characters (after stripping HTML tags).
 *
 * @param {string[]} elements	An array containing all cases of a specific element that were found in a text.
 *
 * @returns {string[]}	An array containing all elements of a specific type that are center-aligned and longer than 50 characters.
 */
const getLongCenterAlignedElements = function( elements ) {
	const elementsWithCenterAlignedText = [];

	// Get all elements that have the .has-text-align-center class.
	elements.forEach( element => {
		if ( centerAlignRegex.test( element ) ) {
			elementsWithCenterAlignedText.push( element );
		}
	} );

	// Return empty array if no center aligned elements were found.
	if ( elementsWithCenterAlignedText.length === 0 ) {
		return [];
	}

	// Remove HTML tags from the elements before counting characters and returning too long elements.
	const sanitizedElements = elementsWithCenterAlignedText.map( element => sanitizeString( element ) );

	return sanitizedElements.filter( element => element.length > 50 );
};

/**
 *
 * Finds all paragraphs and headings that are center-aligned and longer than 50 characters (after stripping html tags).
 *
 * Returns an array with one object per paragraph/heading.
 * For example: [ {text: "abc", typeOfBlock: "heading"}, {text: "123", typeOfBlock: "paragraph"} ].
 *
 * @param {string}	paper	The paper to analyze.
 *
 * @returns {Object[]}	An array of objects for each too long center-aligned paragraph/heading.
 */
export default function getLongBlocksOfCenterAlignedText( paper ) {
	let text = paper.getText();
	// Normalize quotes.
	text = normalize( text );
	console.log( text, "Text" );
	const allParagraphs = getAllElementsFromText( text, paragraphsRegex );
	const allHeadings = getAllElementsFromText( text, headingsRegex );
	const longBlocksOfCenterAlignedText = [];

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
