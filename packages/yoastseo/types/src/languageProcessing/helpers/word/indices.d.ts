declare namespace _default {
    export { getIndicesByWord };
    export { getIndicesByWordList };
    export { filterIndices };
    export { sortIndices };
    export { getIndicesByWordListSorted };
}
export default _default;
/**
 * Returns the indices of a string in a text. If it is found multiple times, it will return multiple indices.
 *
 * @param {string} word The word to find in the text.
 * @param {string} text The text to check for the given word.
 *
 * @returns {Array} All indices found.
 */
export function getIndicesByWord(word: string, text: string): any[];
/**
 * Matches string with an array, returns the word and the index it was found on.
 *
 * @param {Array} words The array with strings to match.
 * @param {string} text The text to match the strings from the array to.
 *
 * @returns {Array} The array with words, containing the index of the match and the matched string.
 * Returns an empty array if none are found.
 */
export function getIndicesByWordList(words: any[], text: string): any[];
/**
 * Filters duplicate entries if the indices overlap.
 *
 * @param {Array} indices The array with indices to be filtered.
 *
 * @returns {Array} The filtered array.
 */
export function filterIndices(indices: any[]): any[];
/**
 * Sorts the array on the index property of each entry.
 *
 * @param {Array} indices The array with indices.
 *
 * @returns {Array} The sorted array with indices.
 */
export function sortIndices(indices: any[]): any[];
/**
 * Matches string with an array, returns the word and the index it was found on, and sorts the match instances based on
 * the index property of the match.
 *
 * @param {Array} words The array with strings to match.
 * @param {string} text The text to match the strings from the array to.
 *
 * @returns {Array} The array with words, containing the index of the match and the matched string.
 * Returns an empty array if none are found.
 */
export function getIndicesByWordListSorted(words: any[], text: string): any[];
