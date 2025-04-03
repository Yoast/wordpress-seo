/**
 * @typedef {import("../../../parse/structure").Node} Node
 * @typedef {import("../../../parse/structure/Sentence").default} Sentence
 */
/**
 * Gets all the sentences from paragraph and heading nodes.
 * These two node types are the nodes that should contain sentences for the analysis.
 *
 * @param {Node} tree The tree to get the sentences from.
 *
 * @returns {Sentence[]} The array of sentences retrieved from paragraph and heading nodes plus sourceCodeLocation of the parent node.
 */
export default function _default(tree: Node): Sentence[];
export type Node = import("../../../parse/structure").Node;
export type Sentence = import("../../../parse/structure/Sentence").default;
