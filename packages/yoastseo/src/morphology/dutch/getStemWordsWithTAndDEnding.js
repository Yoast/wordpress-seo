import { flatten } from "lodash-es";

/**
 * Checks whether the word ends in one of the words in the exception list.
 *
 * @param {string}	word	The word to check.
 * @param {string[]}	dataStemmingException	The list of stemming exceptions.
 * @returns {boolean}	Whether the checked word ends in one of the words in the exception list.
 */
const isWordInStemmingExceptionList = function( word, dataStemmingException ) {
	for ( let i = 0; i < dataStemmingException.length; i++ ) {
		if ( word.endsWith( dataStemmingException[ i ] ) ) {
			return true;
		}
	}
};
/**
 * Checks whether the word ends in non-verb present singular or past regex endings -t, -te, -de, -ten, -den.
 *
 * @param {string} word			The word to check.
 * @param {string} dataNonVerbEndings	The regex for non-verb endings.
 * @returns {boolean}	Whether the word ends in one of the non-verb endings.
 */
const doesWordEndInNonVerbEnding = function( word, dataNonVerbEndings ) {
	return ( word.search( new RegExp( dataNonVerbEndings ) ) ) !== -1;
};

/**
 * Modifies the stem of the word with double vowel after suffix -e/-en deletion.
 *
 * @param {string} stemmedWord The stem that needs to be modified.
 * @param {Object} doubleVowelModification The vowel doubling modification that needs to be done.
 * @returns {string} The modified stem, or the same stem if no modification was made.
 */
const modifyStem = function( stemmedWord, doubleVowelModification ) {
	for ( const needReplacement of doubleVowelModification ) {
		if ( stemmedWord.search( new RegExp( needReplacement[ 0 ] ) ) !== -1 ) {
			stemmedWord = stemmedWord.replace( new RegExp( needReplacement[ 0 ] ), needReplacement[ 1 ] );
			return stemmedWord;
		}
	}
	return stemmedWord;
};
/**
 * Checks whether the word ends in the regex of non-verb past endings -de, -te or -ten and return the stem by deleting -e/-en.
 *
 * @param {Object} morphologyDataNL		The Dutch morphology data.
 * @param {Object} nonVerbPastEndings	The non-verb past endings.
 * @param {string} word					The word to be checked.
 * @returns {string}					The stem created.
 */
const createStemWordsWithNonVerbPastEndings = function( morphologyDataNL, nonVerbPastEndings, word ) {
	if ( word.search( new RegExp( nonVerbPastEndings[ 0 ] ) ) !== -1 ) {
		const stemmedWord = word.replace( new RegExp( nonVerbPastEndings[ 0 ] ), nonVerbPastEndings[ 1 ] );
		return modifyStem( stemmedWord, morphologyDataNL.stemming.stemModifications.doubleVowel );
	}
};
/**
 * Creates the correct stem for words which end in ambiguous endings -t, -te, -ten, -de, or -den.
 *
 * @param {Object} morphologyDataNL The Dutch morphology data.
 * @param {string} word				The word to be checked.
 * @returns {string/string[]} 		The stemmed word.
 */
export function generateCorrectStemWithTAndDEnding( morphologyDataNL, word ) {
	const wordsNotToStem = flatten( Object.values( morphologyDataNL.stemming.stemExceptions.wordsNotToBeStemmedExceptions ) );
	/* Check whether the word is in the exception list of words that do not need to be stemmed
		or whether the word ends in a unique regex where the -t ending does not need to be stemmed.
		If it is or it does, return the word.
	 */
	if ( isWordInStemmingExceptionList( word, wordsNotToStem ) ||
		doesWordEndInNonVerbEnding( word, morphologyDataNL.stemming.stemExceptions.nonVerbEndingInTAndD.tEnding ) ) {
		return word;
	}
	/* Check whether the word is in the exception list of words in which only -en that needs to be stemmed, not -den,
		or whether the word ends in non-verb past suffix -den.
		If it is or it does, stem -en suffix and modify the stem after suffix deletion if it is required.
	 */
	if ( isWordInStemmingExceptionList( word, morphologyDataNL.stemming.stemExceptions.verbEndingInTAndD.wordsStemOnlyEnEnding ) ||
		doesWordEndInNonVerbEnding( word, morphologyDataNL.stemming.stemExceptions.nonVerbEndingInTAndD.denEnding ) ) {
		const stemmedWord = word.slice( 0, -2 );
		//	Modify the stem after deleting suffix -en.
		return modifyStem( stemmedWord,  morphologyDataNL.stemming.stemModifications.doubleVowel );
	}
	/* Check whether the word is in the exception list of words in which -t ending needs to be stemmed,
		If it is stem -t.
	*/
	if ( isWordInStemmingExceptionList( word, morphologyDataNL.stemming.stemExceptions.verbEndingInTAndD.wordsTShouldBeStemmed ) ) {
		return word.slice( 0, -1 );
	}
	/* Checks whether the word end in the regex of non-verb past suffix -de and return the stem by deleting -e.
		After the suffix deletion, modify the stem if it is required.
	 */
	const nonVerbPastEndingsDe = morphologyDataNL.stemming.stemExceptions.nonVerbEndingInTAndD.deEnding;
	if ( createStemWordsWithNonVerbPastEndings( morphologyDataNL, nonVerbPastEndingsDe, word ) ) {
		return createStemWordsWithNonVerbPastEndings( morphologyDataNL, nonVerbPastEndingsDe, word );
	}
	/* Checks whether the word end in the regex of non-verb past suffix -te or -ten and return the stem by deleting -e/-en.
		After the suffix deletion, modify the stem if it is required.
	 */
	const nonVerbPastEndingsTeOrTen = morphologyDataNL.stemming.stemExceptions.nonVerbEndingInTAndD.teAndTenEndings;
	if ( createStemWordsWithNonVerbPastEndings( morphologyDataNL, nonVerbPastEndingsTeOrTen, word ) ) {
		return createStemWordsWithNonVerbPastEndings( morphologyDataNL, nonVerbPastEndingsTeOrTen, word );
	}
}
