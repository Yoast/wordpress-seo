declare namespace _default {
    export { characterInBoundary };
    export { isWordInSentence };
}
export default _default;
/**
 * Checks whether a character is present in the list of word boundaries.
 *
 * @param {string} character The character to look for.
 * @returns {boolean} Whether or not the character is present in the list of word boundaries.
 */
export function characterInBoundary(character: string): boolean;
/**
 * Checks whether a word is present in a sentence.
 *
 * @param {string} word The word to search for in the sentence.
 * @param {string} sentence The sentence to look through.
 * @returns {boolean} Whether or not the word is present in the sentence.
 */
export function isWordInSentence(word: string, sentence: string): boolean;
