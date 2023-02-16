import { map } from "lodash-es";
import { languageProcessing } from "yoastseo";
const { sanitizeString } = languageProcessing;

const centerAlignClass = "class=\"has-text-align-center\"";

// TODO: mostly duplicate code from matchParagraphs.js, see if we can avoid the duplicate code.
/**
 * Matches the paragraphs in <p>-tags and returns the text in them.
 *
 * @param {string} text The text to match paragraph in.
 *
 * @returns {array} An array containing all paragraphs texts.
 */
const getParagraphsInTags = function( text ) {
	const paragraphs = [];
	// Matches everything between the <p> and </p> tags.
	const regex = /<p(?:[^>]+)?>(.*?)<\/p>/ig;
	let match;

	while ( ( match = regex.exec( text ) ) !== null ) {
		paragraphs.push( match );
	}

	// Returns the content of the paragraphs.
	return map( paragraphs, function( paragraph ) {
		return paragraph[ 0 ];
	} );
};

// TODO: consider adding this function inside getSubheadings.js so that all functions related to getting subheadings are in one place. Make into function and pass regex.
/**
 * Gets all subheadings from the text and returns these in an array.
 *
 * @param {string} text The text to return the headings from.
 *
 * @returns {Array<string[]>} Matches of subheadings in the text, first key is everything including tags,
 *                            second is the heading level, third is the content of the subheading.
 */
function getAllSubheadings( text ) {
	const subheadings = [];
	const regex = /<h([1-6])(?:[^>]+)?>(.*?)<\/h\1>/ig;
	let match;

	while ( ( match = regex.exec( text ) ) !== null ) {
		subheadings.push( match );
	}

	// Returns content of the headings.
	return map( subheadings, function( subheading ) {
		return subheading[ 0 ];
	} );
}

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
	const allParagraphs = getParagraphsInTags( text );
	const allHeadings = getAllSubheadings( text );
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


/*
[
	{ text: "gsdg", typeOfBlock: "heading" }, { text: "gfgss", typeOfBlock: "paragraph" }
]*/
