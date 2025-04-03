declare namespace _default {
    export { getProminentWords };
    export { getProminentWordsFromPaperAttributes };
    export { filterProminentWords };
    export { sortProminentWords };
    export { collapseProminentWordsOnStem };
    export { retrieveAbbreviations };
}
export default _default;
/**
 * Gets prominent words from the paper text.
 *
 * @param {string} text             The text to retrieve the prominent words from.
 * @param {string[]} abbreviations  The abbreviations that occur in the text and attributes of the paper.
 * @param {Function} stemmer        The available stemmer.
 * @param {Array} functionWords     The available function words list.
 * @param {function} getWordsCustomHelper   The custom helper to get words.
 *
 * @returns {ProminentWord[]} All prominent words sorted and filtered for this text.
 */
export function getProminentWords(text: string, abbreviations: string[], stemmer: Function, functionWords: any[], getWordsCustomHelper: Function): ProminentWord[];
/**
 * Gets prominent words from keyphrase and synonyms, metadescription, title, and subheadings.
 *
 * @param {string[]} attributes     The array with attributes to process.
 * @param {string[]} abbreviations  The abbreviations that occur in the text and attributes of the paper.
 * @param {Function} stemmer        The available stemmer.
 * @param {Array} functionWords     The available function words list.
 * @param {function} getWordsCustomHelper   The custom helper to get words.
 *
 * @returns {ProminentWord[]} Prominent words from the paper attributes.
 */
export function getProminentWordsFromPaperAttributes(attributes: string[], abbreviations: string[], stemmer: Function, functionWords: any[], getWordsCustomHelper: Function): ProminentWord[];
/**
 * Returns only those prominent words that occur more than a certain number of times and do not consist of special characters.
 *
 * @param {ProminentWord[]} prominentWords A list of prominent words.
 * @param {int} [minimalNumberOfOccurrences] A minimal number of occurrences that is needed for a relevant prominentWord, default 2.
 *
 * @returns {ProminentWord[]} Only relevant words.
 */
export function filterProminentWords(prominentWords: ProminentWord[], minimalNumberOfOccurrences?: any): ProminentWord[];
/**
 * Sorts prominent words based on their number of occurrences and length.
 *
 * @param {ProminentWord[]} prominentWords The prominent words to sort.
 *
 * @returns {void}
 */
export function sortProminentWords(prominentWords: ProminentWord[]): void;
/**
 * Collapses prominent words that have the same stem.
 *
 * @param {ProminentWord[]} prominentWords All prominentWords.
 *
 * @returns {ProminentWord[]} The original array with collapsed duplicates.
 */
export function collapseProminentWordsOnStem(prominentWords: ProminentWord[]): ProminentWord[];
/**
 * Retrieves a list of all abbreviations from the text. Returns an empty array if the input text is empty.
 *
 * @param {string} text A text.
 *
 * @returns {string[]} A list of abbreviations from the list.
 */
export function retrieveAbbreviations(text: string): string[];
import ProminentWord from "../../values/ProminentWord";
