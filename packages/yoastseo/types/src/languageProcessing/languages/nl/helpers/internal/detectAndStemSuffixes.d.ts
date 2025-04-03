/**
 * Search for suffixes in a word, remove them if found, and modify the stem if needed.
 *
 * @param {string} word  The word to stem.
 * @param {Object} morphologyDataNL The Dutch morphology data file.
 *
 * @returns {string} The stemmed word.
 */
export default function detectAndStemSuffixes(word: string, morphologyDataNL: Object): string;
