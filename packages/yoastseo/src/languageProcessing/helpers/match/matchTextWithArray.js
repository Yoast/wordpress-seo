/** @module stringProcessing/matchTextWithArray */

import matchTextWithWord from "./matchTextWithWord";
import { normalize as normalizeQuotes } from "../sanitize/quotes.js";
import { uniq as unique } from "lodash-es";

/**
 * Matches strings from an array against a given text.
 *
 * @param {String}      text                    The text to match.
 * @param {Array}       array                   The array with strings to match.
 * @param {String}      [locale = "en_EN"]      The locale of the text to get transliterations.
 * @param {function}    matchWordCustomHelper   The language-specific helper function to match word in text.
 *
 * @returns {Object} An array with all matches of the text, the number of the matches, and the lowest number of positions of the matches.
 */
export default function( text, array, locale = "en_EN", matchWordCustomHelper ) {
	let count = 0;
	let matches = [];
	let positions = [];

	array = array.map( normalizeQuotes );

	unique( array ).forEach( function( wordToMatch ) {
		const occurrence = matchTextWithWord( text, wordToMatch, locale, matchWordCustomHelper );
		count += occurrence.count;
		matches = matches.concat( occurrence.matches );
		positions.push( occurrence.position );
	} );

	// Filtered out negative number, i.e. -1.
	positions = positions.filter( position => position >= 0 );

	return {
		count: count,
		matches: matches,
		position: positions.length === 0 ? -1 : Math.min( ...positions ),
	};
}
