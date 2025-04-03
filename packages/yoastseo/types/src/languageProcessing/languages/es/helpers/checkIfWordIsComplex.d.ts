/**
 * Checks if a word is complex.
 * This is a helper for the Word Complexity assessment. As such, this helper is not bundled in Yoast SEO.
 *
 * @param {object} config The configuration needed for assessing the word's complexity, e.g., the frequency list.
 * @param {string} word The word to check.
 * @param {object}	premiumData The object that contains data for the assessment including the frequency list.
 *
 * @returns {boolean} Whether or not a word is complex.
 */
export default function checkIfWordIsComplex(config: object, word: string, premiumData: object): boolean;
