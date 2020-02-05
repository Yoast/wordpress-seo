import { flatten } from "lodash-es";
import { checkIfWordEndingIsOnExceptionList } from "../morphoHelpers/exceptionListHelpers";
import { doesWordMatchRegex } from "../morphoHelpers/regexHelpers";
import { searchAndReplaceWithRegex } from "../morphoHelpers/regexHelpers";
import { isVowelDoublingAllowed } from "./stemModificationHelpers";

/**
 * Checks whether the word ends in suffixes -e or -en which are preceded by -t or -d, and the -t/-d is part of the stem.
 * If it does, stem the -e/-en. Also checks if after suffix deletion the stemmed word needs modification, and applies it if
 * needed.
 *
 * @param {Object} morphologyDataNLStemming		The stemming data from the Dutch morphology data file.
 * @param {Object} eOrEnSuffixPrecededByTOrD	The non-verb past endings.
 * @param {string} word							The word to be checked.
 * @returns {string}							The stem created.
 */
const stemWordsWithEOrEnSuffix = function( morphologyDataNLStemming, eOrEnSuffixPrecededByTOrD, word ) {
	if ( doesWordMatchRegex( word, eOrEnSuffixPrecededByTOrD[ 0 ] ) ) {
		const stemmedWord = word.replace( new RegExp( eOrEnSuffixPrecededByTOrD[ 0 ] ), eOrEnSuffixPrecededByTOrD[ 1 ] );
		if ( isVowelDoublingAllowed( stemmedWord, morphologyDataNLStemming.stemExceptions ) ) {
			const replacement = searchAndReplaceWithRegex( stemmedWord, morphologyDataNLStemming.stemModifications.doubleVowel );
			return replacement ? replacement : stemmedWord;
		}
		return stemmedWord;
	}
};

/**
 * Checks whether the word is on an exception list of words that should not be stemmed or whether it is matched with a regex
 * for words ending in -t that should not be stemmed.
 *
 * @param {string}	word 			The word to check.
 * @param {string[]} exceptionList	The exception list of words that should not be stemmed.
 * @param {string}	regex			The regex to check.
 * @returns {boolean}				Whether the word should not be stemmed.
 */
const checkIfDoesNotNeedToBeStemmed = function( word, exceptionList, regex ) {
	const wordsNotToStem = flatten( Object.values( exceptionList ) );
	return ( checkIfWordEndingIsOnExceptionList( word, wordsNotToStem ) ||
		doesWordMatchRegex( word, regex ) );
};

/**
 * Stems words for which we know that -t/-d is the ending of the stem (so the -t/-d is not stemmed). This is done through
 * checking lists of words and matching the word with regexes.
 *
 * @param {string}	word						The word to check.
 * @param {Object}	morphologyDataNLStemming	The stemming data from the Dutch morphology data file.
 * @returns {?string} 							The stemmed word, if matched in one of the checks, or null if not matched.
 */
const checkWhetherTOrDIsPartOfStem = function( word, morphologyDataNLStemming ) {
	// If the stem ends in -tte, -tten, -dde or -dden leave the first -t/-d and stem the remaining ending
	let stemmedWord = searchAndReplaceWithRegex( word,
		morphologyDataNLStemming.stemExceptions.ambiguousTAndDEndings.tOrDArePartOfStem.firstTOrDPartOfStem );
	if ( stemmedWord ) {
		return stemmedWord;
	}
	// Check whether the word has the suffix -en preceded by -d, where the -d is part of the stem. If it is, stem only -en.
	if ( checkIfWordEndingIsOnExceptionList( word,
		morphologyDataNLStemming.stemExceptions.ambiguousTAndDEndings.tOrDArePartOfStem.wordsStemOnlyEnEnding ) ||
		doesWordMatchRegex( word, morphologyDataNLStemming.stemExceptions.ambiguousTAndDEndings.tOrDArePartOfStem.denEnding ) ) {
		stemmedWord = word.slice( 0, -2 );
		//	Modify the stem after deleting suffix -en.
		const replacement = searchAndReplaceWithRegex( stemmedWord, morphologyDataNLStemming.stemModifications.doubleVowel );
		return replacement ? replacement : stemmedWord;
	}

	/* Checks whether the word matches the regex for words ending in -de with -d being part of the stem. If it is matched,
	 * only stem the -e.
	 */
	const dIsPartOfStemRegex = morphologyDataNLStemming.stemExceptions.ambiguousTAndDEndings.tOrDArePartOfStem.deEnding;
	stemmedWord = stemWordsWithEOrEnSuffix( morphologyDataNLStemming, dIsPartOfStemRegex, word );
	if ( stemmedWord ) {
		return stemmedWord;
	}
	/* Checks whether the word matches the regex for words ending in -te or -ten with -t being part of the stem. If it is
	 * matched, only stem the -e/-en.
	 */
	const tIsPartOfStemRegex = morphologyDataNLStemming.stemExceptions.ambiguousTAndDEndings.tOrDArePartOfStem.teAndTenEndings;
	stemmedWord = stemWordsWithEOrEnSuffix( morphologyDataNLStemming, tIsPartOfStemRegex, word );
	if ( stemmedWord ) {
		return stemmedWord;
	}
};

/**
 * Creates the correct stem for words which end in ambiguous endings -t, -te, -ten, -de, or -den.
 *
 * @param {Object} morphologyDataNLStemming The stemming data from the Dutch morphology data file.
 * @param {string} word						The word to be checked.
 * @returns {string/string[]} 				The stemmed word.
 */
export function generateCorrectStemWithTAndDEnding( morphologyDataNLStemming, word ) {
	// Check whether the word is in the exception list of words in which -t ending needs to be stemmed. If it is, stem -t.
	if ( checkIfWordEndingIsOnExceptionList( word, morphologyDataNLStemming.stemExceptions.ambiguousTAndDEndings.verbsTShouldBeStemmed ) ) {
		return word.slice( 0, -1 );
	}

	// Check whether the word is a word which should not be stemmed. If it is, return the word.
	if ( checkIfDoesNotNeedToBeStemmed( word, morphologyDataNLStemming.stemExceptions.wordsNotToBeStemmedExceptions,
		morphologyDataNLStemming.stemExceptions.ambiguousTAndDEndings.tOrDArePartOfStem.tEnding ) ) {
		return word;
	}

	/*
	 * Check whether the word is a word for which we know that -t/-d is the ending of the stem. If yes, stem it (without
	 * the -t/-d and return it.
	 */
	const stemmedWord = checkWhetherTOrDIsPartOfStem( word, morphologyDataNLStemming );

	if ( stemmedWord ) {
		return stemmedWord;
	}
}
