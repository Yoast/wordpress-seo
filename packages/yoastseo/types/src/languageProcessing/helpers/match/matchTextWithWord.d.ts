/**
 * Returns the number of matches in a given string
 *
 * @param {string}      text                    The text to use for matching the wordToMatch.
 * @param {string}      wordToMatch             The word to match in the text.
 * @param {string}      locale   				The locale used for transliteration.
 * @param {function}    matchWordCustomHelper  	The helper function to match word in text.
 *
 * @returns {Object} An array with all matches of the text, the number of the matches, and the lowest number of positions of the matches.
 */
export default function _default(text: string, wordToMatch: string, locale: string, matchWordCustomHelper: Function): Object;
