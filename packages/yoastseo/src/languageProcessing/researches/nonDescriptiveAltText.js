import getImagesInScope from "../helpers/image/getImagesInScope";
import getAltAttribute from "../helpers/image/getAltAttribute";
import getImageIdentifier from "../helpers/image/getImageIdentifier";
import { atMostFiveLetters } from "../helpers/regex/wordBoundaries";
import { hashedHtmlEntities } from "../../helpers/htmlEntities";

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
// second word, so any word is accepted there, as long as a number follows. The word may contain combining marks,
// such as the vowel signs in "छवि" (Hindi for "image").
const WHATSAPP_FILE_NAME = new RegExp( `^whatsapp\\s+[\\p{L}\\p{M}]+(?=\\s+\\p{N})${ atMostFiveLetters }$`, "iu" );

// Screenshot names that operating systems generate in English: "Screenshot 2026-03-14 at 10.32.45" (macOS),
// "Screen Shot 2026-03-14 at 10.32.45 AM" (older macOS), "Screenshot (12)" (Windows), "Screenshot_20260314_103245"
// (Android) and "Screenshot from 2026-03-14 10-32-45" (GNOME). The number has to follow the name directly, so
// "Screenshot of iOS 17.5" is not matched. These count in every language, because the language of the computer that
// took the screenshot is often not the language of the site.
const SCREENSHOT_FILE_NAME = new RegExp( `^(?:screenshot|screen\\s+shot)(?:\\s+from)?[\\s_(-]*(?=\\p{N})${ atMostFiveLetters }$`, "iu" );

// The HTML entities that the tree builder protects as "#nbsp;", "#mdash;" and so on (see `build`).
const HASHED_HTML_ENTITY = new RegExp( [ ...hashedHtmlEntities.keys() ].join( "|" ), "gi" );

// Invisible characters that only set the text direction: the left-to-right and right-to-left marks, the Arabic letter
// mark, and the embedding, override and isolate controls. Zero-width (non-)joiners are not here: they are part of the
// spelling of Farsi and Indic words.
const DIRECTION_MARKS = /[\u200E\u200F\u061C\u202A-\u202E\u2066-\u2069]/g;

// Single characters for `removeTrailingNumber`.
const SPACE_OR_PUNCTUATION = /[\s\p{P}]/u;
const DIGIT = /\p{N}/u;
const SPACE_UNDERSCORE_OR_HYPHEN = /[\s_-]/;

// The suffixes of a scaled, edited or resized copy at the end of a file name: "-scaled", "-edited", "-edited-1" or an
// edit timestamp ("-e1700000000000"), then a size ("-1024x576", "_800x600", "_800x", "_x600"). Each one may be missing.
const SIZE_SUFFIX = /(?:-(?:scaled|edited(?:-\d+)?|e\d{10,}))*(?:[-_](?:\d+x\d*|x\d+))?$/;

// How much of the end of a file name `SIZE_SUFFIX` is tested against. The longest real suffix is about 40 characters.
const SIZE_SUFFIX_SEARCH_LENGTH = 64;

/**
 * Removes a trailing number with optional brackets and the surrounding punctuation, e.g. " 1", "1", " (1)" or "-1.",
 * so "Image (1)." becomes "Image".
 *
 * This walks back from the end once instead of using a regex. The equivalent regex,
 * `/(?:[\s_-]*\(?\p{N}+\)?)?[\s\p{P}]*$/u`, cannot be anchored at the start, so it is retried at every position, and its
 * two runs overlap on spaces and hyphens. That makes it quadratic: an alt text of 100,000 digits or hyphens followed by
 * a letter took 14 to 35 seconds. Alt text is user input, and `yoastseo` also runs on servers, so that would let anyone
 * who can write alt text keep the analysis busy. The loop gives the same result in linear time.
 *
 * @param {string} text The text to remove the trailing number from.
 *
 * @returns {string} The text without the trailing number.
 */
const removeTrailingNumber = ( text ) => {
	let end = text.length;
	while ( end > 0 && SPACE_OR_PUNCTUATION.test( text[ end - 1 ] ) ) {
		end--;
	}

	let start = end;
	while ( start > 0 && DIGIT.test( text[ start - 1 ] ) ) {
		start--;
	}
	if ( start === end ) {
		return text.slice( 0, end );
	}

	if ( text[ start - 1 ] === "(" ) {
		start--;
	}
	while ( start > 0 && SPACE_UNDERSCORE_OR_HYPHEN.test( text[ start - 1 ] ) ) {
		start--;
	}
	return text.slice( 0, start );
};

/**
 * Removes the suffix of a scaled, edited or resized copy from the end of a file name (see `SIZE_SUFFIX`).
 *
 * Only the last `SIZE_SUFFIX_SEARCH_LENGTH` characters are tested. `SIZE_SUFFIX` cannot be anchored at the start
 * either, and its repeated group makes it slower than linear on a long name full of "-e1234567890" parts. Real
 * suffixes are short, so testing the end only gives the same result for real file names.
 *
 * @param {string} fileName The file name, without its extension.
 *
 * @returns {string} The file name without the suffix.
 */
const removeSizeSuffix = ( fileName ) => {
	const headLength = Math.max( 0, fileName.length - SIZE_SUFFIX_SEARCH_LENGTH );
	return fileName.slice( 0, headLength ) + fileName.slice( headLength ).replace( SIZE_SUFFIX, "" );
};

/**
 * Returns the file name of an image source in lowercase: with its extension, without it, and without a size suffix,
 * so a resized copy such as `red-bike-1024x576.jpg` also yields `red-bike`.
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
	const withoutExtension = fileName.replace( /\.[^.]+$/, "" );
	return [ fileName, withoutExtension, removeSizeSuffix( withoutExtension ) ];
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
	SCREENSHOT_FILE_NAME.test( altText ) ||
	getFileNames( src ).includes( altText.toLowerCase() );

/**
 * Returns the alt text of an image, prepared for matching: with the protected HTML entities of a text image turned
 * back into their characters, the direction marks removed, the whitespace collapsed, and trimmed.
 *
 * The tree builder changes "&nbsp;" into "#nbsp;" in the whole text, attributes included, and `getAltAttribute` does
 * not change it back. Without this, `alt="Product&nbsp;image"` would be read as "Product#nbsp;image" and missed.
 * The alt text of a provided image is not changed: it never went through the tree builder, so a "#nbsp;" in it is
 * real text.
 *
 * Direction marks are removed from every alt text. Typing or pasting Latin text in a right-to-left field often adds
 * one, invisibly, and a single mark is enough to stop "IMG_1234" from matching.
 *
 * @param {string}  altText         The alt text, as `getAltAttribute` returns it.
 * @param {boolean} isFromTheText   Whether the image comes from the text, rather than from the provided images.
 *
 * @returns {string} The prepared alt text.
 */
const prepareAltText = ( altText, isFromTheText ) => {
	const restored = isFromTheText
		? altText.replace( HASHED_HTML_ENTITY, ( entity ) => hashedHtmlEntities.get( entity.toLowerCase() ) )
		: altText;

	return restored.replace( DIRECTION_MARKS, "" ).replace( /\s+/g, " " ).trim();
};

/**
 * Counts how many of the images in scope have alt text that consists only of a meaningless phrase: a placeholder,
 * a file name, or a generic default such as "Product image" that says nothing about the image.
 *
 * The whole alt text is matched, not a part of it: "Product image" is counted, "Product image of a red bike on a
 * beach" is not. Before matching, HTML entities are turned back into characters, direction marks are removed and the
 * whitespace inside the alt text is collapsed (see `prepareAltText`).
 *
 * Two kinds of checks apply:
 * - checks that work in every language, also in a language without its own phrases: only numbers or punctuation,
 *   a name ending in an image file extension, a file name that cameras, phones, WhatsApp or screenshot tools
 *   generate, and the exact file name of the image (with or without the extension, or without the suffix of a
 *   scaled, edited or resized copy such as "-1024x576", "_800x", "-scaled", "-edited" or "-e1700000000000", ignoring
 *   case);
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

	const isFromTheText = ! paper.hasProvidedImages();

	getImagesInScope( paper ).forEach( ( image ) => {
		const rawAltText = getAltAttribute( image );

		if ( rawAltText === "" ) {
			return;
		}

		// Empty after preparing means the alt text is only non-breaking spaces, which is as meaningless as "-".
		const altText = prepareAltText( rawAltText, isFromTheText );
		const isNonDescriptive = altText === "" || isNonDescriptiveInAnyLanguage( altText, image.attributes?.src || "" ) ||
			( !! phrasePattern && phrasePattern.test( removeTrailingNumber( altText ) ) );

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
