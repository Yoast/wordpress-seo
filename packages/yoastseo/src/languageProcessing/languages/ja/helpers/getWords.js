import { filter, map } from "lodash-es";
import { languageProcessing } from "yoastseo";
const { sanitizeString, removePunctuation } = languageProcessing;
import TinySegmenter from "tiny-segmenter";

const segmenter = new TinySegmenter();

/**
 * Returns an array with words used in the text.
 *
 * @param {string} text The text to be counted.
 *
 * @returns {Array} The array with all words.
 */
export default function( text ) {
	// Strips HTML tags and exclude Table of Contents from the analysis.
	text = sanitizeString( text );
	if ( text === "" ) {
		return [];
	}

	let words = segmenter.segment( text );

	words = map( words, function( word ) {
		return removePunctuation( word );
	} );

	return filter( words, function( word ) {
		return word.trim() !== "";
	} );
}
