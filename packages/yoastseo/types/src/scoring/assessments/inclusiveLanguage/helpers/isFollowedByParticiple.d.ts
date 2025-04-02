/**
 * Checks if a given word is a participle.
 *
 * @param {string} word The word that needs to be checked for whether it is a participle.
 * @returns {boolean} True if the words is a participle, false otherwise.
 */
export function isParticiple(word: string): boolean;
/**
 * Generates a callback that checks if a non-inclusive phrase is followed by a participle.
 *
 * @param {string[]} words an array of the words that form the text that contains the non inclusive phrase.
 * @param {string[]} nonInclusivePhrase a list of words that are a non inclusive phrase.
 * @returns {function} a callback function that checks if the word after a non inclusive phrase is a participle.
 */
export function isFollowedByParticiple(words: string[], nonInclusivePhrase: string[]): Function;
