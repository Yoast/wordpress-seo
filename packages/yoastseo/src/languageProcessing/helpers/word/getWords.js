/** @module stringProcessing/countWords */
import sanitizeString from "../sanitize/sanitizeString";
import { filter, flatMap } from "lodash";
import removePunctuation, { punctuationRegexString } from "../sanitize/removePunctuation.js";

const punctuationRegex = new RegExp( `([${punctuationRegexString}])`, "g" );

/**
 * Returns an array with words used in the text.
 *
 * @param {string} text The text to be counted.
 * @param {string} [wordBoundaryRegexString=\\s] The regex string for the word boundary that should be used to split the text into words.
 * @param {boolean} [shouldRemovePunctuation=true] If punctuation should be removed. Defaults to `true`.
 *
 * @returns {Array} The array with all words.
 */
export default function( text, wordBoundaryRegexString = "\\s", shouldRemovePunctuation = true ) {
	// Unify whitespaces and non-breaking spaces, remove table of content and strip the tags and multiple spaces.
	text = sanitizeString( text );

	if ( text === "" ) {
		return [];
	}

	const wordBoundaryRegex = new RegExp( wordBoundaryRegexString, "g" );

	let words = text.split( wordBoundaryRegex );

	if ( shouldRemovePunctuation ) {
		words = words.map( removePunctuation );
	} else {
		// If punctuation is not removed, punctuation marks are tokenized as if they were words.
		words = flatMap( words, ( word ) => {
			const newWord = word.replace( punctuationRegex, " $1 " );
			return newWord.split( " " );
		} );
	}

	return filter( words, function( word ) {
		return word.trim() !== "";
	} );
}

