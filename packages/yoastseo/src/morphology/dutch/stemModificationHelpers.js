import { checkIfWordEndingIsOnExceptionList, checkIfWordIsOnVerbExceptionList } from "../morphoHelpers/exceptionListHelpers.js";

/**
 * Checks whether the word is on any of the sub-lists of the noVowelOrConsonantDoublingList (ending match, exact match,
 * and verbs) and returns true if it is.
 *
 * @param {string}	word							The word to check.
 * @param {Object}	noVowelOrConsonantDoublingList	The list of stems that should not have the vowel doubled.
 * @param {Object}	compoundVerbPrefixes			The list of inseparable and separable verb prefixes.
 *
 * @returns {boolean} Whether the word was found on one of the lists
 */
const checkIfWordIsOnNoVowelDoublingList = function( word, noVowelOrConsonantDoublingList, compoundVerbPrefixes ) {
	if ( checkIfWordEndingIsOnExceptionList( word, noVowelOrConsonantDoublingList.endingMatch ) ||
		checkIfWordIsOnVerbExceptionList( word, noVowelOrConsonantDoublingList.verbs, compoundVerbPrefixes ) ||
		noVowelOrConsonantDoublingList.exactMatch.includes( word ) ) {
		return true;
	}
};

/**
 * Checks whether the third to last and fourth to last characters of the stem are the same. This, in principle, checks
 * whether the last vowel of the stem is preceded by a double consonant (as only consonants can precede the vowel).
 * If the third and fourth to last characters are the same, it means that vowel doubling is allowed. For example, in the
 * word 'luttel', the third and fourth to last characters are both t's so it should not become 'lutteel'.
 *
 * @param {string} word The stemmed word to check.
 *
 * @returns {boolean} Whether the vowel should be doubled or not.
 */
const isVowelPrecededByDoubleConsonant = function( word ) {
	const fourthToLastLetter = word.charAt( word.length - 4 );
	const thirdToLastLetter = word.charAt( word.length - 3 );
	return fourthToLastLetter !== thirdToLastLetter;
};

/**
 * Checks whether the second to last syllable contains a diphthong. If it does, the vowel in the last syllable should
 * not be doubled.
 *
 * @param {string} word                 The stemmed word to check.
 * @param {string} noVowelDoublingRegex The regex to match a word with.
 *
 * @returns {boolean} Whether the vowel should be doubled or not.
 */
const doesPrecedingSyllableContainDiphthong = function( word, noVowelDoublingRegex ) {
	return ( word.search( new RegExp( noVowelDoublingRegex ) ) ) === -1;
};

/**
 * Modifies the stem of the word according to the specified modification type.
 *
 * @param {string} word The stem that needs to be modified.
 * @param {string[]} modificationGroup The type of modification that needs to be done.
 * @returns {string} The modified stem, or the same stem if no modification was made.
 */
export function modifyStem( word, modificationGroup ) {
	const neededReplacement = modificationGroup.find( replacement => word.search( new RegExp( replacement[ 0 ] ) ) !== -1 );
	if ( typeof neededReplacement !== "undefined" ) {
		word = word.replace( new RegExp( neededReplacement[ 0 ] ), neededReplacement[ 1 ] );
	} return word;
}

/**
 * Checks whether the final vowel of the stem should be doubled by going through four checks.
 *
 * @param {string}  word                               The stemmed word that the check should be executed on.
 * @param {Object}  morphologyDataNLStemmingExceptions The Dutch morphology data for stemming exceptions.
 * @param {Object}  morphologyDataNLVerbPrefixes	   The separable and inseparable verb prefixes.
 *
 * @returns {boolean} Whether the vowel should be doubled or not.
 */
export function isVowelDoublingAllowed( word, morphologyDataNLStemmingExceptions, morphologyDataNLVerbPrefixes ) {
	// Check whether the word is on the list of verbs which should have the vowel doubled (exception to third check)
	const firstCheck = checkIfWordIsOnVerbExceptionList( word, morphologyDataNLStemmingExceptions.getVowelDoubling, morphologyDataNLVerbPrefixes );
	// Check whether the word is on the list of words which should NOT have the vowel doubled
	const secondCheck = checkIfWordIsOnNoVowelDoublingList( word, morphologyDataNLStemmingExceptions.noVowelOrConsonantDoubling,
		morphologyDataNLVerbPrefixes );
	const thirdCheck = isVowelPrecededByDoubleConsonant( word );
	const fourthCheck = doesPrecedingSyllableContainDiphthong(  word, morphologyDataNLStemmingExceptions.noVowelOrConsonantDoubling.rule );

	return firstCheck || ( ! secondCheck && thirdCheck && fourthCheck );
}
