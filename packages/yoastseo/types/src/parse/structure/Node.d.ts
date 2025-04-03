export default Node;
export type Text = import(".").Text;
/**
 * @typedef {import(".").Text} Text
 */
/**
 * A node in the tree.
 */
declare class Node {
    /**
     * Creates a new node.
     *
     * @param {string} 			name 					The node's name or tag.
     * @param {Object} 			attributes 				This node's attributes.
     * @param {(Node|Text)[]} 	childNodes 				This node's child nodes.
     * @param {Object} 			sourceCodeLocationInfo 	This node's location in the source code, from parse5.
     */
    constructor(name: string, attributes?: Object, childNodes?: (Node | Text)[], sourceCodeLocationInfo?: Object);
    /**
     * This node's name or tag.
     * @type {string}
     */
    name: string;
    /**
     * This node's attributes.
     * @type {Object}
     */
    attributes: Object;
    /**
     * This node's child nodes.
     * @type {(Node|Text)[]}
     */
    childNodes: (Node | Text)[];
    /**
     * The location of this node inside the HTML.
     * @type {SourceCodeLocation}
     */
    sourceCodeLocation: SourceCodeLocation;
    /**
     * Finds all nodes in the tree that satisfies the given condition.
     *
     * @param {function} 	condition 					The condition that a node should satisfy to end up in the list.
     * @param {boolean} 	recurseFoundNodes=false 	Whether to recurse into found nodes to see if the condition
     *  also applies to sub-nodes of the found node.
     *
     * @returns {(Node|Text)[]} The list of nodes that satisfy the condition.
     */
    findAll(condition: Function, recurseFoundNodes?: boolean): (Node | Text)[];
    /**
     * Retrieves the parent node for the current node.
     * @param {Node} tree The full tree for this node.
     * @returns {Node} The parent node.
     */
    getParentNode(tree: Node): Node;
    /**
     * Returns the inner text (text without any markup) from this node.
     *
     * @returns {string} The inner text from this node.
     */
    innerText(): string;
    /**
     * Retrieves the start offset for this node.
     * @returns {number} The start offset.
     */
    getStartOffset(): number;
}
import SourceCodeLocation from "./SourceCodeLocation";
