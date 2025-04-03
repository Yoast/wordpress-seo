/**
 * Calculates the total number of syllables in the input word.
 *
 * @param {string} word     The word to calculate the number of syllables in.
 *
 * @returns {int} The total number of syllables in the word.
 */
export function calculateTotalNumberOfSyllables(word: string): int;
/**
 * Stems the ending of a word based on some regexRules after checking if the word is in the exception list.
 *
 * @param {string} word             The word to stem.
 * @param {Array} regexRules        The list of regex-based rules to apply to the word in order to stem it.
 * @param {string[]} exceptions     The list of words that should not get the ending removed.
 * @param {Object} morphologyData   The Indonesian morphology data file
 *
 * @returns {string} The stemmed word.
 */
export function removeEnding(word: string, regexRules: any[], exceptions: string[], morphologyData: Object): string;
/**
 * Checks if the beginning of the word is present in an exception list.
 *
 * @param {string}   word         The word to stem.
 * @param {int}      prefixLength The length of the prefix to be trimmed before checking in the list.
 * @param {string[]} beginnings   The list of word beginnings that should be checked.
 *
 * @returns {boolean} Whether the word is found in the list with beginnings.
 */
export function checkBeginningsList(word: string, prefixLength: int, beginnings: string[]): boolean;
