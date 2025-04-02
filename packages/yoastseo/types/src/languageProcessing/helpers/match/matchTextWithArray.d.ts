/**
 * Matches strings from an array against a given text.
 *
 * @param {String}      text                    The text to match.
 * @param {Array}       array                   The array with strings to match.
 * @param {String}      [locale = "en_EN"]      The locale of the text to get transliterations.
 * @param {function}    matchWordCustomHelper   The language-specific helper function to match word in text.
 *
 * @returns {Object} An array with all matches of the text, the number of the matches, and the lowest number of positions of the matches.
 */
export default function _default(text: string, array: any[], locale?: string | undefined, matchWordCustomHelper: Function): Object;
