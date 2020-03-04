import { checkIfWordEndingIsOnExceptionList, checkIfWordIsOnVerbExceptionList } from "../morphoHelpers/exceptionListHelpers";
import { doesWordMatchRegex, searchAndReplaceWithRegex } from "../morphoHelpers/regexHelpers";
import { isVowelDoublingAllowed } from "./stemModificationHelpers";

/**
 * Checks whether the word ends in suffixes -e or -en which are preceded by -t or -d, and the -t/-d is part of the stem.
 * If it does, stem the -e/-en. Also checks if after suffix deletion the stemmed word needs modification, and applies it if
 * needed.
 *
 * @param {Object} 		morphologyDataNLStemExceptions 		The stemming exceptions data from the Dutch morphology data file.
 * @param {Object} 		morphologyDataNLStemModifications 	The stem modifications data from the Dutch morphology data file.
 * @param {Object} 		eOrEnSuffixPrecededByTOrD			The non-verb past endings.
 * @param {string} 		word								The word to be checked.
 *
 * @returns {?string}							The stem created or null.
 */
const stemWordsWithEOrEnSuffix = function( morphologyDataNLStemExceptions, morphologyDataNLStemModifications, eOrEnSuffixPrecededByTOrD, word ) {
	if ( doesWordMatchRegex( word, eOrEnSuffixPrecededByTOrD[ 0 ] ) ) {
		const stemmedWord = word.replace( new RegExp( eOrEnSuffixPrecededByTOrD[ 0 ] ), eOrEnSuffixPrecededByTOrD[ 1 ] );
		if ( isVowelDoublingAllowed( stemmedWord, morphologyDataNLStemExceptions ) ) {
			const replacement = searchAndReplaceWithRegex( stemmedWord, morphologyDataNLStemModifications.doubleVowel );
			return replacement ? replacement : stemmedWord;
		}
		return stemmedWord;
	}

	return null;
};

/**
 * Stems words for which we know that -t/-d is the ending of the stem (so the -t/-d is not stemmed). This is done through
 * checking lists of words and matching the word with regexes.
 *
 * @param {string}	word								The word to check.
 * @param {Object} 	morphologyDataNLStemExceptions 		The stemming exceptions data from the Dutch morphology data file.
 * @param {Object} 	morphologyDataNLStemModifications 	The stem modifications data from the Dutch morphology data file.
 * @param {Object} 	morphologyDataNLVerbPrefixes 		Separable and inseparable verb prefixes.
 *
 * @returns {?string} 							The stemmed word, if matched in one of the checks, or null if not matched.
 */
const checkWhetherTOrDIsPartOfStem = function( word, morphologyDataNLStemExceptions, morphologyDataNLStemModifications,
											   morphologyDataNLVerbPrefixes ) {
	/*
	 * Step 1:
	 * - If the stem ends in -tte, -tten, -dde or -dden leave the first -t/-d and stem the remaining ending.
	 * - Example: "katten" (-ten should be stemmed, leaving "kat").
	 */
	let stemmedWord = searchAndReplaceWithRegex( word,
		morphologyDataNLStemExceptions.ambiguousTAndDEndings.tOrDArePartOfStem.firstTOrDPartOfStem );

	if ( stemmedWord ) {
		return stemmedWord;
	}

	/*
	 * Step 2:
	 * - Check whether the word has the suffix -en preceded by -d, where the -d is part of the stem. If it is, stem only -en.
	 * - Example: "eenden" (-en should be stemmed, leaving "eend").
	 */
	if ( checkIfWordEndingIsOnExceptionList( word,
		morphologyDataNLStemExceptions.ambiguousTAndDEndings.tOrDArePartOfStem.wordsStemOnlyEnEnding.endingMatch ) ||
		checkIfWordIsOnVerbExceptionList( word, morphologyDataNLStemExceptions.ambiguousTAndDEndings.tOrDArePartOfStem.wordsStemOnlyEnEnding.verbs,
			morphologyDataNLVerbPrefixes ) ||
		doesWordMatchRegex( word, morphologyDataNLStemExceptions.ambiguousTAndDEndings.tOrDArePartOfStem.denEnding ) ) {
		stemmedWord = word.slice( 0, -2 );
		//	Check if the vowel needs to be doubled after deleting suffix -en.
		if ( isVowelDoublingAllowed( stemmedWord, morphologyDataNLStemExceptions ) ) {
			const replacement = searchAndReplaceWithRegex( stemmedWord, morphologyDataNLStemModifications.doubleVowel );
			return replacement ? replacement : stemmedWord;
		}
		return stemmedWord;
	}

	/*
	 * Step 3:
	 * - Checks whether the word matches the regex for words ending in -de with -d being part of the stem. If it is matched,
	 * only stem the -e.
	 * - Example: "beenharde" (-e should be stemmed, leaving "beenhard")
	 */
	const dIsPartOfStemRegex = morphologyDataNLStemExceptions.ambiguousTAndDEndings.tOrDArePartOfStem.deEnding;
	stemmedWord = stemWordsWithEOrEnSuffix( morphologyDataNLStemExceptions, morphologyDataNLStemModifications, dIsPartOfStemRegex, word );

	if ( stemmedWord ) {
		return stemmedWord;
	}
	/*
	 * Step 4:
	 * - Checks whether the word matches the regex for words ending in -te or -ten with -t being part of the stem. If it is
	 * matched, only stem the -e/-en.
	 * - Example: "castraten" (-en should be stemmed, leaving "castraat")
	 */
	const tIsPartOfStemRegex = morphologyDataNLStemExceptions.ambiguousTAndDEndings.tOrDArePartOfStem.teAndTenEndings;
	stemmedWord = stemWordsWithEOrEnSuffix( morphologyDataNLStemExceptions, morphologyDataNLStemModifications, tIsPartOfStemRegex, word );

	if ( stemmedWord ) {
		return stemmedWord;
	}

	return null;
};

/**
 * Creates the correct stem for words which end in ambiguous endings -t, -te, -ten, -de, or -den.
 *
 * @param {Object} 		morphologyDataNLStemExceptions 		The stemming exceptions data from the Dutch morphology data file.
 * @param {Object} 		morphologyDataNLStemModifications 	The stem modifications data from the Dutch morphology data file.
 * @param {Object} 		morphologyDataNLVerbPrefixes 		Separable and inseparable verb prefixes.
 * @param {string} 		word								The word to be checked.
 *
 * @returns {?string} 	The stemmed word or null.
 */
export function generateCorrectStemWithTAndDEnding( morphologyDataNLStemExceptions, morphologyDataNLStemModifications,
	morphologyDataNLVerbPrefixes, word ) {
	/*
	 * Step 1:
	 * - Check whether the word is in the exception list of words in which -t ending needs to be stemmed. If it is, stem -t.
	 * - Example: "squasht".
	 * - This is an exception to one of the rule in step 2.
	 */
	if ( checkIfWordEndingIsOnExceptionList( word, morphologyDataNLStemExceptions.ambiguousTAndDEndings.verbsTShouldBeStemmed ) ) {
		return word.slice( 0, -1 );
	}

	/*
	 * Step 2:
	 * - Check if word is matched by a regex for a t that shouldn't be stemmed.
	 * - Example: "boot".
	 */
	if ( doesWordMatchRegex( word, morphologyDataNLStemExceptions.ambiguousTAndDEndings.tOrDArePartOfStem.tEnding ) ) {
		return word;
	}

	/*
	 * Step 3:
	 * - Check whether the word has another suffix that should be stemmed (e.g. -en) preceded by -t or -d which is part of the stem.
	 *  If yes, stem the suffix that should be stemmed and return the stem which ends in -t/-d.
	 * - Example: "tijden" (only -en should be removed, not -den).
	 */
	const stemmedWord = checkWhetherTOrDIsPartOfStem( word, morphologyDataNLStemExceptions, morphologyDataNLStemModifications, morphologyDataNLVerbPrefixes );

	if ( stemmedWord ) {
		return stemmedWord;
	}

	return null;
}
