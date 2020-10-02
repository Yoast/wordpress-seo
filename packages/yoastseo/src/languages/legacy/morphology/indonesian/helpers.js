import { buildOneFormFromRegex } from "../morphoHelpers/buildFormRule";
import createRulesFromMorphologyData from "../morphoHelpers/createRulesFromMorphologyData";

const vowelCharacters = [ "a", "e", "i", "o", "u" ];

/**
 * Determines if an input character is a vowel.
 *
 * @param {string} character The character to check.
 *
 * @returns {boolean} Whether the input character is an Indonesian vowel.
 */
function isVowel( character ) {
	return vowelCharacters.includes( character );
}

/**
 * Calculates the total number of syllables in the input word.
 *
 * @param {string} word The word to calculate the number of syllables in.
 *
 * @returns {int} The total number of syllables in the word.
 */
export function calculateTotalNumberOfSyllables( word ) {
	let result = 0;

	for ( let i = 0; i < word.length; i++ ) {
		if ( isVowel( word[ i ] ) ) {
			result++;
		}
	}

	return result;
}

/**
 * Stems the ending of a word based on some regexRules after checking if the word is in the exception list.
 *
 * @param {string} word         The word to stem.
 * @param {Array} regexRules    The list of regex-based rules to apply to the word in order to stem it.
 * @param {string[]} exceptions The list of words that should not get the ending removed.
 * @param {Object} morphologyData The Indonesian morphology data file
 *
 * @returns {string} The stemmed word.
 */
export function removeEnding( word, regexRules, exceptions, morphologyData ) {
	if ( exceptions.includes( word ) ) {
		return word;
	}

	// Check words ending in -kan whether they are words whose stem ending in -k that get suffix -an or not.
	const wordsWithKEnding = morphologyData.stemming.doNotStemWords.doNotStemK;
	if ( word.endsWith( "kan" ) ) {
		const wordWithoutSuffixAn = word.substring( 0, word.length - 2 );
		// If a word has stem ending -k and gets suffix -an, then only stem -an here.
		if ( wordsWithKEnding.includes( wordWithoutSuffixAn ) ) {
			word = wordWithoutSuffixAn;
		}
	}

	const removePartRegex = createRulesFromMorphologyData( regexRules );
	const withRemovedPart = buildOneFormFromRegex( word, removePartRegex );
	return withRemovedPart || word;
}

/**
 * Checks if the beginning of the word is present in an exception list.
 *
 * @param {string}   word         The word to stem.
 * @param {int}      prefixLength The length of the prefix to be trimmed before checking in the list.
 * @param {string[]} beginnings   The list of word beginnings that should be checked.
 *
 * @returns {boolean} Whether the word is found in the list with beginnings.
 */
export function checkBeginningsList( word, prefixLength, beginnings ) {
	const wordWithoutPrefix = word.slice( prefixLength );
	return beginnings.some( beginning => wordWithoutPrefix.startsWith( beginning ) );
}
