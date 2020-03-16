import { checkIfWordEndingIsOnExceptionList, checkExceptionListWithTwoStems,
	checkIfWordIsOnVerbExceptionList } from "../morphoHelpers/exceptionListHelpers";
import { detectAndStemRegularParticiple } from "./detectAndStemRegularParticiple";
import { generateCorrectStemWithTAndDEnding } from "./getStemWordsWithTAndDEnding";
import checkExceptionsWithFullForms from "../morphoHelpers/checkExceptionsWithFullForms";

/**
 * If the word ending in -t/-d was not matched in any of the checks for whether -t/-d should be stemmed or not, other checks still need
 * to be done in order to be sure whether we need to stem the word further or not.
 * If one of these checks returns true, we do not need to stem the word further.
 *
 * @param {Object}  morphologyDataNL	The Dutch morphology data.
 * @param {string}	stemmedWord			The stemmed word.
 * @param {string}	word				The unstemmed word.
 * @returns {boolean}	Whether one of the conditions returns true or not.
 */
const checkIfTorDIsUnambiguous = function( morphologyDataNL, stemmedWord, word ) {
	const wordsNotToBeStemmed = morphologyDataNL.stemming.stemExceptions.wordsNotToBeStemmedExceptions;
	const adjectivesEndingInRd = morphologyDataNL.stemming.stemExceptions.adjectivesEndInRD;
	const wordsEndingInTOrDExceptionList = morphologyDataNL.stemming.stemExceptions.ambiguousTAndDEndings.tOrDArePartOfStem.doNotStemTOrD;

	// Run the checks below. If one of the conditions returns true, return the stem.
	if ( detectAndStemRegularParticiple( morphologyDataNL, word ) ||
		 generateCorrectStemWithTAndDEnding( morphologyDataNL, word ) ||
		 checkIfWordIsOnVerbExceptionList( word, wordsNotToBeStemmed.verbs, morphologyDataNL.verbs.compoundVerbsPrefixes ) ||
		 checkIfWordEndingIsOnExceptionList( word, wordsNotToBeStemmed.endingMatch ) ||
		 wordsNotToBeStemmed.exactMatch.includes( word ) ||
		 adjectivesEndingInRd.includes( stemmedWord ) ||
		 checkExceptionsWithFullForms( morphologyDataNL, word ) ||
		 stemmedWord.endsWith( "heid" ) ||
		 wordsEndingInTOrDExceptionList.includes( stemmedWord ) ) {
		return true;
	}
};

/**
 * Checks if the word after t/d deletion is in the noun exception list. If it is, return the correct stem.
 *
 * @param {Object}  morphologyDataNL	The Dutch morphology data.
 * @param {string}	stemmedWord			The stemmed word.
 * @returns {string} The correct stem from noun exception list.
 */
const checkIfWordIsInNounException = function( morphologyDataNL, stemmedWord ) {
	// Check if after t/d deletion, the word is in noun exception list.
	const nounExceptionList = morphologyDataNL.nouns.exceptions.nounExceptionWithTwoStems;
	const checkIfWordIsInNounExceptionList = checkExceptionListWithTwoStems( nounExceptionList, stemmedWord );
	// If it is, return the correct stem.
	if ( checkIfWordIsInNounExceptionList ) {
		return checkIfWordIsInNounExceptionList;
	}
};

/**
 * If the word ending in -t/-d was not matched in any of the checks for whether -t/-d should be stemmed or not, and if it
 * is not a participle (which has its separate check), then it is still ambiguous whether -t/-d is part of the stem or a suffix.
 * Therefore, a second stem should be created with the -t/-d removed in case it was a suffix. For example, in the verb 'poolt',
 * -t is a suffix, but we could not predict in any of the previous checks that -t should be stemmed. To account for such cases,
 * we stem the -t here.
 *
 * @param {Object}  morphologyDataNL	The Dutch morphology data.
 * @param {string}	stemmedWord			The stemmed word.
 * @param {string}	word				The unstemmed word.
 *
 * @returns {?string}				    The stemmed word or null if the -t/-d should not be stemmed.
 */
export function stemTOrDFromEndOfWord( morphologyDataNL, stemmedWord, word ) {
	if ( checkIfTorDIsUnambiguous( morphologyDataNL, stemmedWord, word ) ) {
		return null;
	}
	// If none of the conditions above is true, stem the t/d from the word.
	stemmedWord = stemmedWord.slice( 0, -1 );
	if ( checkIfWordIsInNounException( morphologyDataNL, stemmedWord ) ) {
		return checkIfWordIsInNounException( morphologyDataNL, stemmedWord );
	}
	// If it was not in the noun exception list, return the stem without t/d.
	return stemmedWord;
}
