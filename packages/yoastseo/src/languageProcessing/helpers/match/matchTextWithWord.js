/** @module stringProcessing/matchTextWithWord */

import stripSomeTags from "../sanitize/stripNonTextTags.js";
import stripSpaces from "../sanitize/stripSpaces.js";
import removePunctuation from "../sanitize/removePunctuation.js";
import { unifyAllSpaces as unifyWhitespace } from "../sanitize/unifyWhitespace.js";
import matchStringWithTransliteration from "./matchTextWithTransliteration.js";
import { normalize as normalizeQuotes } from "../sanitize/quotes.js";
import { map } from "lodash-es";

/**
 * Returns the number of matches in a given string
 *
 * @param {string} text The text to use for matching the wordToMatch.
 * @param {string} wordToMatch The word to match in the text
 * @param {string} locale The locale used for transliteration.
 *
 * @returns {Object} The matches found and the number of matches.
 */
export default function( text, wordToMatch, locale ) {
	text = stripSomeTags( text );
	text = unifyWhitespace( text );
	text = normalizeQuotes( text );
	wordToMatch = stripSpaces( normalizeQuotes( wordToMatch ) );

	let matches = matchStringWithTransliteration( text, wordToMatch, locale );
	matches = map( matches, function( keyword ) {
		return stripSpaces( removePunctuation( keyword ) );
	} );

	// Create an array of positions of matches to determine where in the text the wordToMatch occurred first.
	const positions = map( matches, function( keyword ) {
		return text.indexOf( keyword );
	} );

	return {
		count: matches.length,
		matches: matches,
		position: Math.min( ...positions ),
	};
}
