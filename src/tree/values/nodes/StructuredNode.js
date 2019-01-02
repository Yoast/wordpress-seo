import Node from "./Node";
/**
 * Represents a piece of structure that is present in the original text, but is not relevant for the further analysis
 * of the text.
 *
 * Talking about HTML, this would encompass thing like <div>, <section>, <aside>, <fieldset> and other HTML block elements.
 */
class StructuredNode extends Node {
	/**
	 * Represents a piece of structure that is present in the original text, but is not relevant for the further
	 * analysis of the text.
	 *
	 * Talking about HTML, this would encompass thing like <div>, <section>, <aside>, <fieldset> and other HTML block elements.
	 *
	 * @param {string}        tag         The tag used in the node.
	 *
	 * @returns {void}
	 */
	constructor( tag ) {
		super( "StructuredNode" );
		/**
		 * Type of structured node (e.g. "div", "section" etc.).
		 * @type {string}
		 */
		this.tag = tag;
		/**
		 * This node's child nodes.
		 * @type {Node[]}
		 */
		this.children = [];
	}
}
export default StructuredNode;
