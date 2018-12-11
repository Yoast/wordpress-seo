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
	 * @param {number}        startIndex  The index of the beginning of the structured node.
	 * @param {number}        endIndex    The index of the end of the structured node.
	 * @param {string}        tag         The tag used in the node.
	 * @param {Node[]}        children    The sub-elements of the structured node.
	 *
	 * @returns {void}
	 */
	constructor( startIndex, endIndex, tag, children = [] ) {
		super( "structuredNode", startIndex, endIndex );
		this.children = children;
		this.tag = tag;
	}
}
export default StructuredNode;
