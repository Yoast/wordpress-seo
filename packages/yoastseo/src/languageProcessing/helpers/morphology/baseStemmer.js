/**
 * Base stemmer that does not stem.
 * This is exported to allow for comparing if a stemmer is the base stemmer.
 *
 * @param {string} word The word to stem.
 *
 * @returns {string} The stemmed word.
 */
export default function baseStemmer( word ) {
	return word;
}
