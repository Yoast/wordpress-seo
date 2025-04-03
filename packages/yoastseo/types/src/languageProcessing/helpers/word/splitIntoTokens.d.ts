export default splitIntoTokens;
/**
 * Tokenizes a text similarly to `getWords`, but in a way that's suitable for the HTML parser.
 * 1. It does not normalize whitespace.
 * This operation is too risky for the HTML parser because it may throw away characters and as a result, the token positions are corrupted.
 * 2. It does not remove punctuation marks but keeps them.
 *
 * This algorithm splits the text by word separators: tokens that are the border between two words.
 * This algorithm separates punctuation marks from words and keeps them as separate tokens.
 * It only splits them off if they appear at the start or the end of a word.
 *
 * @param {string} text The text to tokenize.
 *
 * @returns {string[]} 	An array of tokens.
 */
declare function splitIntoTokens(text: string): string[];
