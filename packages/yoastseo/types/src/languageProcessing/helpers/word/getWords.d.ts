/**
 * Returns an array with words used in the text.
 *
 * @param {string} text The text to be counted.
 * @param {string} [wordBoundaryRegexString=\\s] The regex string for the word boundary that should be used to split the text into words.
 * @param {boolean} [shouldRemovePunctuation=true] If punctuation should be removed. Defaults to `true`.
 *
 * @returns {Array} The array with all words.
 */
export default function _default(text: string, wordBoundaryRegexString?: string | undefined, shouldRemovePunctuation?: boolean | undefined): any[];
