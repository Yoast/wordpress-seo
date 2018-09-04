import replaceString from '../stringProcessing/replaceString.js';
import removalWordsFactory from '../config/removalWords.js';
const removalWords = removalWordsFactory();
import matchTextWithWord from '../stringProcessing/matchTextWithWord.js';

/**
 * Matches the keyword in an array of strings
 *
 * @param {Array} matches The array with the matched headings.
 * @param {String} keyword The keyword to match
 * @param {string} locale The locale used for transliteration.
 * @returns {number} The number of occurrences of the keyword in the headings.
 */
export default function( matches, keyword, locale ) {
	let foundInHeader = -1;

	if ( matches !== null ) {
		foundInHeader = 0;
		for ( let i = 0; i < matches.length; i++ ) {
			// TODO: This replaceString call seemingly doesn't work, as no replacement value is being sent to the .replace method in replaceString
			const formattedHeaders = replaceString(
				matches[ i ], removalWords
			);
			if (
				matchTextWithWord( formattedHeaders, keyword, locale ).count > 0 ||
				matchTextWithWord( matches[ i ], keyword, locale ).count > 0
			) {
				foundInHeader++;
			}
		}
	}
	return foundInHeader;
};
