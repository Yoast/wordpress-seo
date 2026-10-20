import getImagesInScope from "../helpers/image/getImagesInScope";
import getAltAttribute from "../helpers/image/getAltAttribute";
import getImageIdentifier from "../helpers/image/getImageIdentifier";
import { atMostFiveLetters } from "../helpers/regex/wordBoundaries";

/**
 * @typedef {import("../AbstractResearcher").default } Researcher
 * @typedef {import("../../values/").Paper } Paper
 */

// Alt text made of only numbers, punctuation, symbols and spaces, e.g. "-", "." or "2026-03-14".
const ONLY_NUMBERS_AND_PUNCTUATION = /^[\p{N}\p{P}\p{S}\s]+$/u;

// Alt text ending in an image file extension, e.g. "red-shoes.jpg".
const IMAGE_FILE_EXTENSION = /\.(?:jpe?g|png|gif|webp|avif|svg|heic|heif|bmp|tiff?)$/i;

// File names that cameras and phones generate, e.g. "IMG_1234", "DSC01234", "PXL_20260314_103245123" or "GOPR0001".
const CAMERA_FILE_NAME = /^(?:img|dscn?|pxl|dji|gopr|mvimg)[_-]?\d[\d_-]*(?:\s*\(\d+\))?$/i;

// File names that WhatsApp generates, e.g. "WhatsApp Image 2026-03-14 at 10.32.45". WhatsApp translates the
// second word, so any word is accepted there, as long as a number follows.
const WHATSAPP_FILE_NAME = new RegExp( `^whatsapp\\s+\\p{L}+(?=\\s+\\p{N})${ atMostFiveLetters }$`, "iu" );

// A trailing number with optional brackets and the punctuation around it, e.g. " 1", "1", " (1)" or "-1.".
const TRAILING_NUMBER = /(?:[\s_-]*\(?\p{N}+\)?)?[\s\p{P}]*$/u;

/**
 * Returns the file name of an image source, with and without its extension, in lowercase.
 *
 * @param {string} src The image source.
 *
 * @returns {string[]} The file names, or an empty array when the source has none.
 */
const getFileNames = ( src ) => {
	const path = src.split( /[?#]/ )[ 0 ];
	let fileName = path.slice( path.lastIndexOf( "/" ) + 1 );

	try {
		fileName = decodeURIComponent( fileName );
	} catch ( error ) {
		// A malformed escape sequence: compare the file name as it is written.
	}

	if ( fileName === "" ) {
		return [];
	}

	fileName = fileName.toLowerCase();
	return [ fileName, fileName.replace( /\.[^.]+$/, "" ) ];
};

/**
 * Checks whether an alt text is non-descriptive in any language: only numbers or punctuation, a file name, or the
 * exact file name of the image itself.
 *
 * @param {string} altText The alt text, trimmed and with collapsed whitespace.
 * @param {string} src     The image source.
 *
 * @returns {boolean} Whether the alt text is non-descriptive.
 */
const isNonDescriptiveInAnyLanguage = ( altText, src ) => ONLY_NUMBERS_AND_PUNCTUATION.test( altText ) ||
	IMAGE_FILE_EXTENSION.test( altText ) ||
	CAMERA_FILE_NAME.test( altText ) ||
	WHATSAPP_FILE_NAME.test( altText ) ||
	getFileNames( src ).includes( altText.toLowerCase() );

/**
 * Counts how many of the images in scope have alt text that consists only of a meaningless phrase: a placeholder,
 * a file name, or a generic default such as "Product image" that says nothing about the image.
 *
 * The whole alt text is matched, not a part of it: "Product image" is counted, "Product image of a red bike on a
 * beach" is not. Before matching, the whitespace inside the alt text is collapsed.
 *
 * Two kinds of checks apply:
 * - checks that work in every language, also in a language without its own phrases: only numbers or punctuation,
 *   a name ending in an image file extension, a file name that cameras, phones or WhatsApp generate, and the exact
 *   file name of the image (with or without the extension, ignoring case);
 * - language-specific phrases. A language supplies them as a regex through the `nonDescriptiveAltText` config.
 *   The regex is tested against the alt text without a trailing number, so a phrase such as "image" also matches
 *   "image 1", "image1" and "image (1)". The regex has to match the whole text, so it needs `^` and `$`.
 *
 * Images without alt text are not counted: that case is covered by the _image alt attributes_ assessment.
 *
 * The images in scope are the images in the text, unless the Paper carries a `providedImages`
 * attribute (see `getImagesInScope`).
 *
 * `flagged` lists the identifier of every image that is counted, so a consumer can point at the images that
 * need work instead of only knowing how many there are. It is a set of things to point at, so it can be shorter
 * than the count: two `img` tags in the text that share a src are two images but one identifier, and an image
 * that carries neither an id nor a src cannot be pointed at and is left out. The count stays authoritative for
 * the feedback string.
 *
 * @param {Paper}      paper      The paper to check for images.
 * @param {Researcher} researcher The researcher, for the language-specific phrases.
 *
 * @returns {{count: number, flagged: Array<string|number>}} The number of images whose alt text is
 *                                                           non-descriptive, and the identifiers of those images.
 */
export default function nonDescriptiveAltText( paper, researcher ) {
	const phrasePattern = researcher.getConfig( "nonDescriptiveAltText" );
	const result = {
		count: 0,
		flagged: [],
	};

	getImagesInScope( paper ).forEach( ( image ) => {
		const altText = getAltAttribute( image ).replace( /\s+/g, " " );

		if ( altText === "" ) {
			return;
		}

		const isNonDescriptive = isNonDescriptiveInAnyLanguage( altText, image.attributes?.src || "" ) ||
			( !! phrasePattern && phrasePattern.test( altText.replace( TRAILING_NUMBER, "" ) ) );

		if ( ! isNonDescriptive ) {
			return;
		}

		result.count++;

		const identifier = getImageIdentifier( image );
		if ( identifier !== "" && ! result.flagged.includes( identifier ) ) {
			result.flagged.push( identifier );
		}
	} );

	return result;
}
