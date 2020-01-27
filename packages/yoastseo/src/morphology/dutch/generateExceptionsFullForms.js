import checkExceptionsWithFullForms from "../../morphology/morphoHelpers/checkExceptionsWithFullForms";

/**
 *  Returns form of the indeclinable words. These words should not get any suffixes.
 *
 * @param {Object}  morphologyDataNouns    The Dutch morphology data for adjectives.
 * @param {string}  stemmedWord                 The stemmed word for which to get suffixes.
 *
 * @returns {string/[]}  The original form. The form returned should be the same with the input.
 *
 */
const checkIndeclinableExceptions = function( morphologyDataNouns, stemmedWord ) {
	const indeclinableExceptions = morphologyDataNouns.exceptions.exceptionsAllPartsOfSpeech.indeclinable;
	const foundIndeclinableException = indeclinableExceptions.find( indeclinableWord => stemmedWord.endsWith( indeclinableWord ) );
	return foundIndeclinableException ? stemmedWord : [];
};

/**
 * Checks whether a given stem falls into the exception categories and creates the
 * correct forms if that is the case.
 *
 * @param {Object}  morphologyDataNouns The Dutch noun data.
 * @param {string}  stemmedWordToCheck  The stem to check.
 * @returns {string[]} The created word forms.
 */
export function generateExceptionsAllPartsOfSpeech( morphologyDataNouns, stemmedWordToCheck ) {
	// Check exceptions with full forms.
	const exceptionStemsWithFullForms = morphologyDataNouns.exceptions.exceptionsAllPartsOfSpeech.stemmingExceptionStemsWithFullForms;
	const exceptionsFullForms = checkExceptionsWithFullForms( exceptionStemsWithFullForms, stemmedWordToCheck );

	if ( exceptionsFullForms.length > 0 ) {
		return exceptionsFullForms;
	}
	const exceptionsIndeclinable = checkIndeclinableExceptions( morphologyDataNouns, stemmedWordToCheck );

	if ( exceptionsIndeclinable.length > 0 ) {
		return exceptionsIndeclinable;
	}
	return [];
}


