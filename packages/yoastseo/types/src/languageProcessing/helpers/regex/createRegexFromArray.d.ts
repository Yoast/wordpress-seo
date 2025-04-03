/**
 * Creates a regex of combined strings from the input array.
 *
 * @param {string[]} array                      The array with strings
 * @param {boolean} [disableWordBoundary=false] Boolean indicating whether or not to disable word boundaries.
 * @param {string} [extraBoundary=""]           A string that is used as extra boundary for the regex.
 * @param {boolean} [doReplaceDiacritics=false] If set to true, it replaces diacritics. Defaults to false.
 *
 * @returns {RegExp} regex                              The regex created from the array.
 */
export default function _default(array: string[], disableWordBoundary?: boolean | undefined, extraBoundary?: string | undefined, doReplaceDiacritics?: boolean | undefined): RegExp;
