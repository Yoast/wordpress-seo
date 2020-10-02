import replaceString from "../stringProcessing/replaceString.js";
import removalWordsFactory from "../config/removalWords.js";
const removalWords = removalWordsFactory();
import matchTextWithArray from "../stringProcessing/matchTextWithArray.js";

/**
 * Matches the keyword in an array of strings
 *
 * @param {Array} matches The array with the matched headings.
 * @param {String[]} keywordForms The array of keyword forms to match
 * @param {string} locale The locale used for transliteration.
 * @returns {number} The number of occurrences of the keyword in the headings.
 */
export default function( matches, keywordForms, locale ) {
	let foundInHeader = -1;

	if ( matches !== null ) {
		foundInHeader = 0;
		for ( let i = 0; i < matches.length; i++ ) {
			// NOTE: This replaceString call seemingly doesn't work, as no replacement value is being sent to the .replace method in replaceString
			const formattedHeaders = replaceString(
				matches[ i ], removalWords
			);
			if (
				matchTextWithArray( formattedHeaders, keywordForms, locale ).count > 0 ||
				matchTextWithArray( matches[ i ], keywordForms, locale ).count > 0
			) {
				foundInHeader++;
			}
		}
	}
	return foundInHeader;
}
