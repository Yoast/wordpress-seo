/**
 * Gets positions of the first character of a word in the input text.
 *
 * @param {string} text The original text, for which the indices of word beginnings need to be determined.
 *
 * @returns {Array} indices The array of indices in the text at which words start.
 */
export function getIndicesOfWords(text: string): any[];
/**
 * Gets indices of a specific character in the input text.
 *
 * @param {string} text             The original text, for which the indices of specific characters have to be determined.
 * @param {string} characterToFind  The character that needs to be found in the text.
 *
 * @returns {Array} indices The array of indices in the text at which the characterToFind occurs.
 */
export function getIndicesOfCharacter(text: string, characterToFind: string): any[];
/**
 * Compares two arrays of which the second array is the sub-array of the first array.
 * Returns the array of elements of the first array which are not in the second array.
 *
 * @param {Array} bigArray The array with all elements.
 * @param {Array} subarray The array with some elements from the bigArray.
 *
 * @returns {Array} difference An array of all elements of bigArray which are not in subarray.
 */
export function arraysDifference(bigArray: any[], subarray: any[]): any[];
/**
 * Compares two arrays and returns the array of elements that occur in both arrays.
 *
 * @param {Array} firstArray    The first array with elements to compare.
 * @param {Array} secondArray   The second array with elements to compare.
 *
 * @returns {Array} overlap An array of all elements of firstArray which are also in secondArray.
 */
export function arraysOverlap(firstArray: any[], secondArray: any[]): any[];
/**
 * Generates all possible combinations of the elements of an array (treated as unique).
 * https://gist.github.com/jpillora/4435759
 *
 * @param {Array} collection The array with elements that should be combined.
 *
 * @returns {Array} result An array of all possible combinations of elements of the original array.
 */
export function combinations(collection: any[]): any[];
/**
 * Generates upper and lower case for Turkish strings that contain characters İ or ı, which appear to not be processed correctly by regexes.
 *
 * @param {string} text The text to build possible upper and lower case alternatives.
 *
 * @returns {Array} An array of strings that contains all possible upper and lower case alternatives of the original string
 */
export function replaceTurkishIs(text: string): any[];
export const replaceTurkishIsMemoized: typeof replaceTurkishIs & import("lodash").MemoizedFunction;
