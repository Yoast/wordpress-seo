import { generateVerbExceptionForms } from "./generateVerbExceptionForms";
import { detectAndStemRegularParticiple } from "./detectAndStemRegularParticiple";
import { addVerbSuffixes } from "./addVerbSuffixes";


/**
 * Recognizes words ending in -t or -d that might be still incorrectly stemmed using the regular stem.
 * For example 'poolt' will not be stemmed using the regular stemmer while -t actually needs to be stemmed.
 * Thus, in this check, word like 'poolt' will be stemmed.
 *
 * @param {Object} morphologyDataNL	The Dutch morphology data.
 * @param {string}	stemmedWord							The stemmed word.
 * @returns {null|string}	The stemmed word.
 */
const getVerbStemWithTAndDEndings = function( morphologyDataNL, stemmedWord ) {
	if ( detectAndStemRegularParticiple( morphologyDataNL.verbs, stemmedWord ) ) {
		return null;
	}
	const ambiguousEndings = morphologyDataNL.stemming.stemExceptions.verbEndingInTAndD.ambiguousTAndDEndings;
	for ( const ending of ambiguousEndings ) {
		if ( stemmedWord.endsWith( ending ) ) {
			return stemmedWord.slice( 0, -1 );
		}
	}
	return null;
};
/**
 * Checks whether a given stemmed word needs to be stemmed further because it could be a verb
 * form and if so, creates appropriate forms.
 *
 * @param {Object} morphologyDataNL	The Dutch morphology data.
 * @param {string} stemmedWord		The stemmed word.
 * @returns {null|string[]}	The forms created.
 */
export function createVerbFormsWithTAndDEndings( morphologyDataNL, stemmedWord ) {
	const stemmedWordWithoutTOrD = getVerbStemWithTAndDEndings( morphologyDataNL, stemmedWord );

	if ( stemmedWordWithoutTOrD ) {
		const exceptions = generateVerbExceptionForms( morphologyDataNL.verbs, morphologyDataNL.addSuffixes, stemmedWordWithoutTOrD );
		/* First check the exception and generate forms using that.
			If it is not an exception, generate the verb forms including the past participle form using the regular generate verb forms.
			Creates the forms from the returned stem.
			 */
		return exceptions.length > 0
			? exceptions
			: addVerbSuffixes( stemmedWordWithoutTOrD, morphologyDataNL.addSuffixes, morphologyDataNL.verbs );
	}
	return null;
}


