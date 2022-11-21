/** @module stringProcessing/countWords */
import sanitizeString from "../sanitize/sanitizeString";
import removePunctuation from "../sanitize/removePunctuation.js";
import { map, filter, flatMap } from "lodash-es";
import { punctuationRegexString } from "../sanitize/removePunctuation.js";

const interJectionRegexString = `([${punctuationRegexString}])`;
const interJectionRegex = new RegExp( interJectionRegexString, "g" );

/**
 * Returns an array with words used in the text.
 *
 * @param {string} text The text to be counted.
 * @param {boolean} doRemovePunctuation A
 *
 * @returns {Array} The array with all words.
 */
export default function( text, doRemovePunctuation = true ) {
	// Unify whitespaces and non-breaking spaces, remove table of content and strip the tags and multiple spaces.
	text = sanitizeString( text );

	if ( text === "" ) {
		return [];
	}

	let words = text.split( /\s/g );

	if ( doRemovePunctuation ) {
		words = map( words, function( word ) {
			return removePunctuation( word );
		} );
	} else {
		// If punctuation is not removed, punctuation marks are tokenized as if they were words.
		words = flatMap( words, ( word ) => {
			const newWord = word.replace( interJectionRegex, " $1 " );
			return newWord.split( " " );
		} );
	}

	return filter( words, function( word ) {
		return word.trim() !== "";
	} );
}

