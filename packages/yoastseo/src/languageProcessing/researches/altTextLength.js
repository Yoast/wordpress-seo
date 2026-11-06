import getImagesInScope from "../helpers/image/getImagesInScope";
import getAltAttribute from "../helpers/image/getAltAttribute";
import getImageIdentifier from "../helpers/image/getImageIdentifier";

/**
 * @typedef {import("../AbstractResearcher").default } Researcher
 * @typedef {import("../../values/").Paper } Paper
 */

/**
 * The number of characters up to which an alt text is considered too short, unless the language sets its own.
 * @type {number}
 */
export const TOO_SHORT_BOUNDARY = 10;

/**
 * The number of characters from which an alt text is considered too long, unless the language sets its own.
 * @type {number}
 */
export const TOO_LONG_BOUNDARY = 200;

/**
 * Returns the boundaries for the language of the researcher: its `altTextLength` config when it has one,
 * the defaults above otherwise.
 *
 * @param {Researcher} researcher The researcher to read the language-specific config from.
 *
 * @returns {{tooShortBoundary: number, tooLongBoundary: number}} The character boundaries to use.
 */
export function getAltTextLengthBoundaries( researcher ) {
	return {
		tooShortBoundary: TOO_SHORT_BOUNDARY,
		tooLongBoundary: TOO_LONG_BOUNDARY,
		...researcher.getConfig( "altTextLength" ),
	};
}

/**
 * Counts how many of the images in scope have an alt text that is too short or too long.
 *
 * The images in scope are the images in the text, unless the Paper carries a `providedImages`
 * attribute (see `getImagesInScope`). `getAltAttribute` returns the alt text with the surrounding
 * whitespace already stripped, so the character count is taken on the trimmed text.
 *
 * Images without alt text are counted as neither: an empty alt text is not "too short", it is the
 * absence of alt text, which the _image alt attributes_ assessment covers.
 *
 * `flagged` lists the identifier of every image that is counted, so a consumer can point at the images that
 * need work instead of only knowing how many there are. It is a set of things to point at, so it can be shorter
 * than the counts: two `img` tags in the text that share a src are two images but one identifier, and an image
 * that carries neither an id nor a src cannot be pointed at and is left out. The counts stay authoritative for
 * the feedback string.
 *
 * The boundaries depend on the language: see `getAltTextLengthBoundaries`.
 *
 * @param {Paper}      paper      The paper to check for images.
 * @param {Researcher} researcher The researcher, for the language-specific boundaries.
 *
 * @returns {{tooShort: number, tooLong: number, flagged: Array<string|number>}} The number of images whose alt
 *                                                                              text is too short and too long,
 *                                                                              and the identifiers of those images.
 */
export default function altTextLength( paper, researcher ) {
	const { tooShortBoundary, tooLongBoundary } = getAltTextLengthBoundaries( researcher );
	const result = {
		tooShort: 0,
		tooLong: 0,
		flagged: [],
	};

	getImagesInScope( paper ).forEach( ( image ) => {
		const altText = getAltAttribute( image );

		if ( altText === "" ) {
			return;
		}

		if ( altText.length <= tooShortBoundary ) {
			result.tooShort++;
		} else if ( altText.length >= tooLongBoundary ) {
			result.tooLong++;
		} else {
			return;
		}

		const identifier = getImageIdentifier( image );
		if ( identifier !== "" && ! result.flagged.includes( identifier ) ) {
			result.flagged.push( identifier );
		}
	} );

	return result;
}
