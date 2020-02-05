import { detectAndStemRegularParticiple } from "./detectAndStemRegularParticiple";
import { generateCorrectStemWithTAndDEnding } from "./getStemWordsWithTAndDEnding";

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
 * @returns {null|string}				The stemmed word or null if the -t/-d should not .
 */
export function createSecondStemWithoutAmbiguousEnding( morphologyDataNL, stemmedWord, word ) {
	if ( detectAndStemRegularParticiple( morphologyDataNL.verbs, word ) ||
		generateCorrectStemWithTAndDEnding( morphologyDataNL.stemming, word ) ) {
		return null;
	}

	const ambiguousEndings = morphologyDataNL.stemming.stemExceptions.ambiguousTAndDEndings.tAndDEndings;
	for ( const ending of ambiguousEndings ) {
		if ( stemmedWord.endsWith( ending ) ) {
			return stemmedWord.slice( 0, -1 );
		}
	}
	return null;
}


