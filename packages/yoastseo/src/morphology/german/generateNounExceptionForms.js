import checkExceptionsWithFullForms from "../../morphology/morphoHelpers/checkExceptionsWithFullForms";

/**
 * Checks whether a stemmed word has an ending for which we can predict possible suffix forms.
 *
 * @param {array} exceptionCategory     The exception category to check.
 * @param {string} stemmedWordToCheck   The stem to check.
 *
 * @returns {string[]} The created word forms.
 */
const checkStemsWithPredictableSuffixes = function( exceptionCategory, stemmedWordToCheck ) {
	// There are some exceptions to this rule. If the current stem falls into this category, the rule doesn't apply.
	const exceptionsToTheException = exceptionCategory[ 2 ];

	if ( exceptionsToTheException.some( ending => stemmedWordToCheck.endsWith( ending ) ) ) {
		return [];
	}

	const exceptionStems = exceptionCategory[ 0 ];

	// Return forms of stemmed word with appended suffixes.
	if ( exceptionStems.some( ending => stemmedWordToCheck.endsWith( ending ) ) ) {
		const suffixes = exceptionCategory[ 1 ];

		return suffixes.map( suffix => stemmedWordToCheck.concat( suffix ) );
	}

	return [];
};

/**
 * Checks whether a give stem stem falls into any of the noun exception categories and creates the
 * correct forms if that is the case.
 *
 * @param {Object}  morphologyDataNouns The German morphology data for nouns.
 * @param {string}  stemmedWordToCheck  The stem to check.
 *
 * @returns {string[]} The created word forms.
 */
export function generateNounExceptionForms( morphologyDataNouns, stemmedWordToCheck ) {
	// Check exceptions with full forms.
	let exceptions = checkExceptionsWithFullForms( morphologyDataNouns.exceptionStemsWithFullForms, stemmedWordToCheck );

	if ( exceptions.length > 0 ) {
		return exceptions;
	}

	// Check exceptions with predictable suffixes.
	const exceptionsStemsPredictableSuffixes = morphologyDataNouns.exceptionsStemsPredictableSuffixes;

	for ( const key of Object.keys( exceptionsStemsPredictableSuffixes ) ) {
		exceptions = checkStemsWithPredictableSuffixes( exceptionsStemsPredictableSuffixes[ key ], stemmedWordToCheck );
		if ( exceptions.length > 0 ) {
			// For this class of words, the stemmed word is the singular form and therefore needs to be added.
			exceptions.push( stemmedWordToCheck );
			return exceptions;
		}
	}

	return exceptions;
}
