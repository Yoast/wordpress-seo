/**
 * Returns a callback that checks whether a non-inclusive word is standalone:
 * "The undocumented are there". is not inclusive, "The undocumented" is standalone.
 * "The undocumented people are there." is inclusive, in "The undocumented people", "the undocumented" is not standalone.
 * @param {string[]} words A list of words that is being queried.
 * @param {string[]} nonInclusivePhrase A list of words that are the non-inclusive phrase.
 * @returns {function} A callback that checks whether a non-inclusive term is standalone.
 */
export default function notInclusiveWhenStandalone(words: string[], nonInclusivePhrase: string[]): Function;
