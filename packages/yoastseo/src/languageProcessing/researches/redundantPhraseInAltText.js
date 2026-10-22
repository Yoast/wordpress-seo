import getImagesInScope from "../helpers/image/getImagesInScope";
import getAltAttribute from "../helpers/image/getAltAttribute";
import getImageIdentifier from "../helpers/image/getImageIdentifier";
import getSentences from "../helpers/sentence/getSentences";

/**
 * @typedef {import("../AbstractResearcher").default } Researcher
 * @typedef {import("../../values/").Paper } Paper
 */

/**
 * Counts how many of the images in scope have alt text with a redundant phrase such as "Image of": screen
 * readers already announce the element as an image, so the phrase adds nothing. In most languages the phrase
 * opens the alt text; in some (Hungarian, Japanese, Turkish) it can appear at the end of the sentence describing the image.
 *
 * The phrases are language-specific. A language supplies a regex through the `redundantPhraseInAltText` config.
 * A language without this config counts nothing.
 *
 * The alt text is tested with its surrounding whitespace already stripped, because that is what `getAltAttribute` returns.
 * The pattern is tested against the first sentence of the alt text only, using the language's own sentence
 * tokenizer.
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
 * @returns {{count: number, flagged: Array<string|number>}} The number of images whose alt text contains a
 *                                                           redundant phrase, and the identifiers of those images.
 */
export default function redundantPhraseInAltText( paper, researcher ) {
	const phrasePattern = researcher.getConfig( "redundantPhraseInAltText" );
	const result = {
		count: 0,
		flagged: [],
	};

	if ( ! phrasePattern ) {
		return result;
	}

	const memoizedTokenizer = researcher.getHelper( "memoizedTokenizer" );

	getImagesInScope( paper ).forEach( ( image ) => {
		const altText = getAltAttribute( image );

		if ( altText === "" ) {
			return;
		}

		const firstSentence = getSentences( altText, memoizedTokenizer )[ 0 ] || "";
		if ( ! phrasePattern.test( firstSentence ) ) {
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
