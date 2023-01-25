import createWordForms from "./createWordForms";

/**
 * Determines the canonical stem from the word forms.
 *
 * @param {string} word             The word input.
 * @param {object} morphologyData   The morphology data file.
 *
 * @returns {string}    The shortest form from the array as the canonical stem.
 */
export default function determineStem( word, morphologyData ) {
	let createdWordForms = createWordForms( word, morphologyData );
	// Sort from the shortest to the longest form.
	createdWordForms = createdWordForms.sort( ( a, b ) => a.length - b.length || a.localeCompare( b ) );

	return createdWordForms[ 0 ];
}
