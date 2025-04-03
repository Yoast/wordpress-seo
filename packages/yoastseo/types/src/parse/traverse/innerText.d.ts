/**
 * @typedef {import("../structure").Node} Node
 * @typedef {import("../structure").Text} Text
 */
/**
 * Gathers the text content of the given node.
 *
 * @param {Node|Text} node The node to gather the text content from.
 *
 * @returns {string} The text content.
 */
export default function innerText(node: Node | Text): string;
export type Node = import("../structure").Node;
export type Text = import("../structure").Text;
