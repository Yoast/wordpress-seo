import { flatten } from "lodash";
import removeHtmlBlocks from "../helpers/html/htmlParser";
import matchStringWithRegex from "../helpers/regex/matchStringWithRegex";
import sanitizeString from "../helpers/sanitize/sanitizeString";
import { filterShortcodesFromHTML } from "../helpers/sanitize/filterShortcodesFromTree.js";

const centerAlignRegex = /class=["'].*?has-text-align-center.*?["']/i;
const paragraphsRegex = /<p(?:[^>]+)?>(.*?)<\/p>/ig;
const headingsRegex = /<h([1-6])(?:[^>]+)?>(.*?)<\/h\1>/ig;

/**
 * Filters out all elements that are center-aligned and longer than 50 characters (after stripping HTML tags).
 *
 * @param {string[]}    elements    An array containing all cases of a specific element that were found in a text.
 * @param {string}      elementType The type of the elements.
 *
 * @returns {Object[]}	An array containing all elements of a specific type that are center-aligned and longer than 50 characters.
 */
function getLongCenterAlignedElements( elements, elementType ) {
	/**
	 * Before counting the characters of a text, we sanitize the text first by removing HTML tags.
	 * In the filtered array, we save the un-sanitized text.
	 * This text will be used for highlighting feature where we will match this with the html of a post.
	 */
	const longCenterAlignedTexts = elements.filter( element => centerAlignRegex.test( element ) && sanitizeString( element ).length > 50  );

	/*
	 * Also specify the type of the element.
	 * This information will be used when applying the highlighting to the text in the editor.
	 */
	return longCenterAlignedTexts.map( text => {
		return { text, elementType };
	} );
}

/**
 * Finds all paragraphs and headings that are center-aligned and longer than 50 characters (after stripping html tags).
 *
 * Returns an array with one object per paragraph/heading.
 * For example: [ {text: "abc", elementType: "heading"}, {text: "123", elementType: "paragraph"} ].
 *
 * @param {Paper}   paper   The paper to analyze.
 *
 * @returns {Object[]}	An array of objects for each too long center-aligned paragraph/heading.
 */
export default function( paper ) {
	let text = paper.getText();
	text = removeHtmlBlocks( text );
	text = filterShortcodesFromHTML( text, paper._attributes && paper._attributes.shortcodes );

	// Get all paragraphs from the text. We only retrieve the paragraphs with <p> tags.
	const allParagraphs = matchStringWithRegex( text, paragraphsRegex );
	// Get all the headings from the text. Here we retrieve the headings from level 1-6.
	const allHeadings = matchStringWithRegex( text, headingsRegex );

	const longParagraphsWithCenterAlignedText = getLongCenterAlignedElements( allParagraphs, "paragraph" );
	const longHeadingsWithCenterAlignedText = getLongCenterAlignedElements( allHeadings, "heading" );

	return flatten( longParagraphsWithCenterAlignedText.concat( longHeadingsWithCenterAlignedText ) );
}
