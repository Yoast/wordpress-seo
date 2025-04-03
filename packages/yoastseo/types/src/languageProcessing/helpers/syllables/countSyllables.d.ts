export function countSyllablesInWord(word: string, syllables: Object): number;
export default countSyllablesInText;
/**
 * Counts the number of syllables in a text per word based on vowels.
 * Uses exclusion words for words that cannot be matched with vowel matching.
 *
 * @param {String} text         The text to count the syllables of.
 * @param {Object} syllables    The syllables data for the specific language.
 *
 * @returns {int} The total number of syllables found in the text.
 */
declare function countSyllablesInText(text: string, syllables: Object): int;
