/** @module stringProcessing/countWords */
import sanitizeString from "../sanitize/sanitizeString";
import removePunctuation from "../sanitize/removePunctuation.js";
import { map, filter } from "lodash-es";

/**
 * Returns an array with words used in the text.
 *
 * @param {string} text The text to be counted.
 *
 * @returns {Array} The array with all words.
 */
export default function( text ) {
	// Unify whitespaces and non-breaking spaces, remove table of content and strip the tags and multiple spaces.
	text = sanitizeString( text );

	if ( text === "" ) {
		return [];
	}

	let words = text.split( /\s/g );

	words = map( words, function( word ) {
		return removePunctuation( word );
	} );

	return filter( words, function( word ) {
		return word.trim() !== "";
	} );
}

