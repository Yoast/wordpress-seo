import { map } from "lodash-es";
import { languageProcessing } from "yoastseo";
const { sanitizeString } = languageProcessing;

const centerAlignClass = "class=\"has-text-align-center\"";
const paragraphsRegex = /<p(?:[^>]+)?>(.*?)<\/p>/ig;
const headingsRegex = /<h([1-6])(?:[^>]+)?>(.*?)<\/h\1>/ig;

/**
 * Matches the paragraphs in <p>-tags and returns the text in them.
 *
 * @param {string} text 		The text to match the element in.
 * @param {RegExp} elementRegex The regex for matching the element.
 *
 * @returns {array} An array containing all paragraphs texts.
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
 * @param elements
 * @returns {*[]}
 */
const getLongCenterAlignedElements = function( elements ) {
	const elementsWithCenterAlignedText = [];

	// Get all elements that have the .has-text-align-center class.
	elements.forEach( element => {
		if ( element.includes( centerAlignClass ) ) {
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
 * @param paper
 * @returns {Array}
 */
export default function getLongBlocksOfCenterAlignedText( paper ) {
	const text = paper.getText();
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
