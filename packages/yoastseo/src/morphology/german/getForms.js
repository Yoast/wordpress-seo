import { addAllAdjectiveSuffixes } from "./addAdjectiveSuffixes";
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
	const forms = [ word ];

	/*
	 * Generate exception forms if the word is on an exception list. Since a given stem might sometimes be
	 * on an exception list in different word categories (e.g., "sau-" from the noun "Sau" or the adjective "sauer")
	 * we need to do this cumulatively.
	 */
	const exceptionsNouns = generateNounExceptionForms( morphologyData.nouns, stemmedWord );
	const exceptionsAdjectives = generateAdjectiveExceptionForms( morphologyData.adjectives, stemmedWord );
	const exceptionsVerbs = generateVerbExceptionForms( morphologyData.verbs, stemmedWord );
	const exceptions = [ ...exceptionsNouns, ...exceptionsAdjectives, ...exceptionsVerbs ];

	if ( exceptions.length > 0 ) {
		// Add the original word as a safeguard.
		exceptions.push( word );

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

	// Also add the stemmed word, since it might be a valid word form on its own.
	forms.push( stemmedWord );

	return unique( forms );
}
