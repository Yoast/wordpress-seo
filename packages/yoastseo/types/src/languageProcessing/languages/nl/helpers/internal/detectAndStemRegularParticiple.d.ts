/**
 * Detects whether a word is a regular participle and if so, returns the stem.
 *
 * @param {Object}  morphologyDataNL 	The Dutch morphology data.
 * @param {string}  word                The word (not stemmed) to check.
 *
 * @returns {string|null} The participle stem or null if no regular participle was matched.
 */
export function detectAndStemRegularParticiple(morphologyDataNL: Object, word: string): string | null;
