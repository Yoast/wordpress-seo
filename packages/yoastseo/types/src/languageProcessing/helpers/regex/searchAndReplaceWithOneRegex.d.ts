/**
 * Checks whether a given regex matches a given word and if so, performs the replacement.
 *
 * @param {string}      word 					The word that may need to be modified.
 * @param {string[]}    regexAndReplacement     A regex and the required replacement.
 *
 * @returns {?string} The modified stem or undefined if no match was found.
 */
export default function searchAndReplaceWithOneRegex(word: string, regexAndReplacement: string[]): string | null;
