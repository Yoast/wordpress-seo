/**
 * Modifies the stem of the word according to the specified modification type.
 *
 * @param {string} word The stem that needs to be modified.
 * @param {string[]} modificationGroup The type of modification that needs to be done.
 * @returns {string} The modified stem, or the same stem if no modification was made.
 */
export function modifyStem(word: string, modificationGroup: string[]): string;
/**
 * Checks whether the final vowel of the stem should be doubled by going through four checks.
 *
 * @param {string}  word                               The stemmed word that the check should be executed on.
 * @param {Object}  morphologyDataNLStemmingExceptions The Dutch morphology data for stemming exceptions.
 * @param {Object}  morphologyDataNLVerbPrefixes	   The separable and inseparable verb prefixes.
 *
 * @returns {boolean} Whether the vowel should be doubled or not.
 */
export function isVowelDoublingAllowed(word: string, morphologyDataNLStemmingExceptions: Object, morphologyDataNLVerbPrefixes: Object): boolean;
