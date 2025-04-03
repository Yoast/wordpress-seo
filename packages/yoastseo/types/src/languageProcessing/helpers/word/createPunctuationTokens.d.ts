export default createPunctuationTokens;
/**
 * Removes punctuation from the beginning and end of a word token, and creates separate tokens from them.
 *
 * @param {string[]} rawTokens	The tokens that may contain punctuation at the beginning and end of words.
 *
 * @returns {string[]} The tokens with the punctuation moved into separate tokens.
 */
declare function createPunctuationTokens(rawTokens: string[]): string[];
