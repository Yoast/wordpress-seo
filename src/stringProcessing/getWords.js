/** @module stringProcessing/countWords */

import { stripFullTags as stripTags } from './stripHTMLTags.js';

import stripSpaces from './stripSpaces.js';
import removePunctuation from './removePunctuation.js';
import { map } from "lodash-es";
import { filter } from "lodash-es";

/**
 * Returns an array with words used in the text.
 *
 * @param {string} text The text to be counted.
 * @returns {Array} The array with all words.
 */
export default function( text ) {
	text = stripSpaces( stripTags( text ) );
	if ( text === "" ) {
		return [];
	}

	var words = text.split( /\s/g );

	words = map( words, function( word ) {
		return removePunctuation( word );
	} );

	return filter( words, function( word ) {
		return word.trim() !== "";
	} );
};

