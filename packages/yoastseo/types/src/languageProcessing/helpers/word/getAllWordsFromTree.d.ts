/**
 * Gets the words from the tokens.
 *
 * @param {Token[]} tokens The tokens to get the words from.
 * @param {boolean} splitOnHyphens Whether to split words on hyphens.
 *
 * @returns {string[]} Array of words retrieved from the tokens.
 */
export function getWordsFromTokens(tokens: Token[], splitOnHyphens?: boolean): string[];
/**
 * Gets the words from the tree, i.e. from the paragraph and heading nodes.
 * These two node types are the nodes that should contain words for the analysis.
 *
 * @param {Paper} paper The paper to get the tree and words from.
 *
 * @returns {string[]} Array of words retrieved from the tree.
 */
export default function _default(paper: Paper): string[];
export type Token = import("../../../parse/structure/Token").default;
export type Paper = import("../../../values/").Paper;
