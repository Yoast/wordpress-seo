/** @module stringProcessing/matchTextWithArray */

import stripSpaces from '../stringProcessing/stripSpaces.js';

import removePunctuation from '../stringProcessing/removePunctuation.js';
import matchTextWithWord from '../stringProcessing/matchTextWithWord';
import { uniq as unique } from "lodash-es";

/**
 * Matches strings from an array against a given text.
 *
 * @param {String} text The text to match
 * @param {Array} array The array with strings to match
 * @param {String} [locale = "en_EN"] The locale of the text to get transliterations
 *
 * @returns {Array} array An array with all matches of the text.
 */
export default function( text, array, locale = "en_EN" ) {
	let count = 0;
	let matches = [];
	unique( array ).forEach( function( wordToMatch ) {
		const occurrence = matchTextWithWord( text, wordToMatch, locale );
		count += occurrence.count;
		matches = matches.concat( occurrence.matches );
	} );

	if ( matches === null ) {
		matches = [];
	}

	matches = matches.map( function( string ) {
		return stripSpaces( removePunctuation( string ) );
	} );

	return {
		count: count,
		matches: matches,
	};
};
