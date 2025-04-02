/**
 * Replaces punctuation characters from the given text string.
 *
 * @param {String} text The text to remove the punctuation characters for.
 *
 * @returns {String} The sanitized text.
 */
export default function _default(text: string): string;
/**
 * String containing all the characters that we consider punctuation.
 * Characters that can also be used as control characters in regular expressions (like `-` and `(`) are escaped.
 * @type {string}
 */
export const punctuationRegexString: string;
/**
 * Array containing all the characters that we consider punctuation.
 * Characters that can also be used as control characters in regular expressions (like `-` and `(`) are escaped.
 * @type {string[]}
 */
export const punctuationList: string[];
export const punctuationRegexStart: RegExp;
export const punctuationRegexEnd: RegExp;
