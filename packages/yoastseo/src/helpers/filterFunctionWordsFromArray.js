import getFunctionWordsFactory from "../helpers/getFunctionWords.js";
import { filter, get, includes, isUndefined } from "lodash-es";

const getFunctionWords = getFunctionWordsFactory();

/**
 * Filters function words from an array of words based on the language.
 *
 * @param {Array} array The words to check.
 * @param {string} language The language to take function words for.
 *
 * @returns {Array} The original array with the function words filtered out.
 */
export default function( array, language ) {
	if ( isUndefined( language ) || language === "" ) {
		language = "en";
	}

	const functionWords = get( getFunctionWords, [ language ], [] );

	if ( array.length > 1 ) {
		const arrayFiltered = filter( array, function( word ) {
			return ( ! includes( functionWords.all, word.trim().toLocaleLowerCase() ) );
		} );

		if ( arrayFiltered.length > 0 ) {
			return arrayFiltered;
		}
	}

	return array;
}
