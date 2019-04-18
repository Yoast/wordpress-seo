import { addAllAdjectiveSuffixes } from "./addAdjectiveSuffixes";
import { createFormsForStemmed3rdSgVerbs } from "./createFormsForStemmed3rdSgVerbs";
import { detectAndStemRegularParticiple } from "./detectAndStemRegularParticiple";
import { generateAdjectiveExceptionForms } from "./generateAdjectiveExceptionForms";
import { generateNounExceptionForms } from "./generateNounExceptionForms";
import { generateRegularVerbForms } from "./generateRegularVerbForms";
import { generateRegularNounForms } from "./generateRegularNounForms";
import { generateVerbExceptionForms } from "./generateVerbExceptionForms";
import stem from "./stem";

import { uniq as unique } from "lodash-es";

/**
 * Creates morphological forms for a given German word.
 *
 * @param {string} word             The word to create the forms for.
 * @param {Object} morphologyData   The German morphology data (false if unavailable).
 *
 * @returns {Array<string>} The created word forms.
 */
export function getForms( word, morphologyData ) {
	const stemmedWord = stem( word );
	// Add the original word to the forms and also the stemmed word, since that might be a valid word form on its own.
	const forms = [ word, stemmedWord ];

	/*
	 * Generate exception forms if the word is on an exception list. Since a given stem might sometimes be
	 * on an exception list in different word categories (e.g., "sau-" from the noun "Sau" or the adjective "sauer")
	 * we need to do this cumulatively.
	 */
	const exceptions = [
		...generateNounExceptionForms( morphologyData.nouns, stemmedWord ),
		...generateAdjectiveExceptionForms( morphologyData.adjectives, stemmedWord ),
		...generateVerbExceptionForms( morphologyData.verbs, stemmedWord ),
	];

	if ( exceptions.length > 0 ) {
		// Add the original word and the stem as a safeguard.
		exceptions.push( ...forms );

		return unique( exceptions );
	}

	const stemIfWordIsParticiple = detectAndStemRegularParticiple( morphologyData.verbs, word );

	/*
	 * If the original word is a regular participle, it gets stemmed here. We then only create verb forms (assuming
	 * that the participle was used verbally, e.g. "er hat sich die Haare gefärbt" - "he dyed his hair") and adjective
	 * forms (assuming that the participle was used adjectivally, e.g. "die Haare sind gefärbt" - "the hair is dyed").
	 * The adjective forms are based on the stem that has only the suffixes removed, not the prefixes. This is because
	 * we want forms such as "die gefärbten Haare" and not (incorrectly) "*die färbten Haare".
	 */
	if ( stemIfWordIsParticiple ) {
		return unique( [
			...forms,
			...generateRegularVerbForms( morphologyData.verbs, stemIfWordIsParticiple ),
			...addAllAdjectiveSuffixes( morphologyData.adjectives, stemmedWord ),
		] );
	}

	// If the stem wasn't found on any exception list, add regular noun suffixes.
	forms.push( ...generateRegularNounForms( morphologyData.nouns, stemmedWord ) );

	// Also add regular adjective suffixes.
	forms.push( ...addAllAdjectiveSuffixes( morphologyData.adjectives, stemmedWord ) );

	// Also add regular verb suffixes.
	forms.push( ...generateRegularVerbForms( morphologyData.verbs, stemmedWord ) );

	const formsBasedOnStemmed3rdSgVerbs = createFormsForStemmed3rdSgVerbs( morphologyData, stemmedWord, word );

	/*
	 * For words certain words ending in -t, it is ambiguous whether it's actually a stem that ends in -t/-et (e.g., test)
	 * or whether the -t/-et ending is a 3rd person singular verb ending (e.g, kauft). When it's possible that the ending
	 * is a 3rd person singular ending, we strip it and create additional verb forms based on the stem without the -t or -et.
	 */
	if ( formsBasedOnStemmed3rdSgVerbs ) {
		forms.push( ...formsBasedOnStemmed3rdSgVerbs );
	}

	return unique( forms );
}
