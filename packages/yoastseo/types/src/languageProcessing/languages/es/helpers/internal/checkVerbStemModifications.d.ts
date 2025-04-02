/**
 * Checks whether a given word is a verb to which certain stem modifications need to be applied.
 *
 * @param {string}  word                The word to check.
 * @param {Object}  morphologyDataES    The Spanish morphology data.
 *
 * @returns {string|null} The modified stem if any modifications apply or null.
 */
export default function checkVerbStemModifications(word: string, morphologyDataES: Object): string | null;
