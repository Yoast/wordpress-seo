/**
 * @typedef {import("../structure").Node} Node
 */
/**
 * Retrieves the parent node for a given node.
 * @param {Node} 	tree 	The current tree.
 * @param {Node} 	node 	The current node.
 * @returns {Node} The parent node.
 */
export default function getParentNode(tree: Node, node: Node): Node;
export type Node = import("../structure").Node;
