import { checkIfWordEndingIsOnExceptionList, checkExceptionListWithTwoStems } from "../morphoHelpers/exceptionListHelpers";
import { detectAndStemRegularParticiple } from "./detectAndStemRegularParticiple";
import { generateCorrectStemWithTAndDEnding } from "./getStemWordsWithTAndDEnding";
import checkExceptionsWithFullForms from "../morphoHelpers/checkExceptionsWithFullForms";
import { removeSuffixFromFullForm } from "../morphoHelpers/stemHelpers";
import nonParticiples from "../../researches/dutch/passiveVoice/nonParticiples.js";

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
export function createSecondStemWithoutAmbiguousEnding( morphologyDataNL, stemmedWord, word ) {
	const ambiguousEndings = morphologyDataNL.stemming.stemExceptions.ambiguousTAndDEndings.tAndDEndings;
	for ( const ending of ambiguousEndings ) {
		// Check if the stem checked does not end in t/d. If it does not, return the stem.
		if ( ! stemmedWord.endsWith( ending ) ) {
			return stemmedWord;
		}
	}

	// If the stem checked ends in t/d, run the checks below. If one of the conditions returns true, return the stem.
	if ( detectAndStemRegularParticiple( morphologyDataNL, word ) ||
		 generateCorrectStemWithTAndDEnding( morphologyDataNL.stemming, word ) ||
		 checkIfWordEndingIsOnExceptionList( word, morphologyDataNL.stemming.stemExceptions.wordsNotToBeStemmedExceptions ) ||
		 checkIfWordEndingIsOnExceptionList( word, morphologyDataNL.stemming.stemExceptions.adjectivesEndInRD ) ||
		 checkExceptionsWithFullForms( morphologyDataNL.stemming.stemmingExceptionStemsWithFullForms, word ) ||
		 removeSuffixFromFullForm( morphologyDataNL.stemming.stemExceptions.removeSuffixFromFullForms, word ) ||
		 word.endsWith( "heid" ) || word.endsWith( "teit" ) || word.endsWith( "tijd" ) || nonParticiples().includes( word ) ) {
		return stemmedWord;
	}
	// If none of the conditions above true, stem the t/d from the word.
	stemmedWord = stemmedWord.slice( 0, -1 );
	// Check if after t/d deletion, the word is in noun exception list.
	const nounExceptionList = morphologyDataNL.nouns.exceptions.nounExceptionWithTwoStems;
	const checkIfWordIsInNounExceptionList = checkExceptionListWithTwoStems( nounExceptionList, stemmedWord );
	// If it is, return the correct stem.
	if ( checkIfWordIsInNounExceptionList ) {
		return checkIfWordIsInNounExceptionList;
	}
	// If it was not in the noun exception list, return the stem without t/d.
	return stemmedWord;
}
