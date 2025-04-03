/**
 * Stems Hebrew words (removes possible prefixes and returns lemma if found in the dictionary).
 *
 * @param {string}	word			The word to stem.
 * @param {Object}	morphologyData	The Hebrew morphology data.
 *
 * @returns {string} The stemmed word or the original word if no stem was found.
 */
export default function stem(word: string, morphologyData: Object): string;
