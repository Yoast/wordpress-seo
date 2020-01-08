import checkExceptionsWithFullForms from "../../morphology/morphoHelpers/checkExceptionsWithFullForms";

/**
 *  Returns form of the indeclinable words. These words should not get any suffixes.
 *
 * @param {Object}  indeclinableWords    The Dutch morphology data for adjectives.
 * @param {string}  stemmedWord                 The stemmed word for which to get suffixes.
 *
 * @returns {string[]}  The original form. The form returned should be the same with the input.
 *
 */
export function checkIndeclinableExceptions( indeclinableWords, stemmedWord ) {
	if ( indeclinableWords.includes( stemmedWord ) ) {
		return stemmedWord;
	}
	return [];
}

/**
 * Checks whether a given stem falls into the exception categories and creates the
 * correct forms if that is the case.
 *
 * @param {Object}  exceptionStemsWithFullForms		List of exception words with full forms.
 * @param {string}  stemmedWordToCheck  The stem to check.
 * @param {Object}	indeclinableExceptions	List of indeclinable stems.
 * @returns {string[]} The created word forms.
 */
export function generateExceptionsAllPartsOfSpeech( exceptionStemsWithFullForms, stemmedWordToCheck, indeclinableExceptions ) {
	// Check exceptions with full forms.
	const exceptionsFullForms = checkExceptionsWithFullForms( exceptionStemsWithFullForms, stemmedWordToCheck );

	if ( exceptionsFullForms.length > 0 ) {
		return exceptionsFullForms;
	}

	const exceptionsIndeclinable = checkIndeclinableExceptions( indeclinableExceptions, stemmedWordToCheck );

	if ( exceptionsIndeclinable.length > 0 ) {
		return exceptionsIndeclinable;
	}
	return [];
}


