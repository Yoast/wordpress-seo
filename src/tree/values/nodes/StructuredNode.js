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
	 * @param {Node[]}        children    The sub-elements of the structured node.
	 * @param {string}        tag         The tag used in the node.
	 *
	 * @returns {void}
	 */
	constructor( startIndex, endIndex, children, tag  ) {
		super( "structuredNode", startIndex, endIndex );
		this.children = children;
		this.tag = tag;
	}

	/**
	 * Clones this StructuredNode.
	 *
	 * @returns {Node} The cloned Node.
	 */
	clone() {
		return new StructuredNode(
			this.startIndex,
			this.endIndex,
			this.children,
			this.tag
		);
	}

	/**
	 * Maps the given function to each Node in this tree.
	 *
	 * @param {mapCallback} mappingFunction 	The function that should be mapped to each Node in the tree.
	 *
	 * @returns {Node} A new tree, after the given function has been mapped on each Node.
	 *
	 * @abstract
	 */
	map( mappingFunction ) {
		// Clone this node to avoid changing the original.
		let clone = this.clone();

		// Apply mapping function to clone.
		clone = mappingFunction( clone );
		// Apply mapping function to each child.
		if ( clone.children && clone.children.length > 0 ) {
			clone.children = clone.children.map(
				node => node.map( mappingFunction )
			);
		}

		return clone;
	}

	/**
	 * Filters all the elements out of the tree for which the given predicate function returns `false`
	 * and returns them as an array of Nodes.
	 *
	 * @param {filterCallback} filterFunction 	The predicate to check each Node against.
	 *
	 * @returns {Node[]} An array of all the Nodes in the tree for which the given predicate function returns `true`.
	 *
	 * @abstract
	 */
	filter( filterFunction ) {
		// Clone this Node.
		const clone = this.clone();

		// Apply filter function to this Node.
		const filtered = filterFunction( clone ) ? [ clone ] : [];
		// Apply filter function to each child and concatenate the results.
		if ( clone.children && clone.children.length > 0 ) {
			return this.children.reduce( ( filterArray, child ) => {
				return filterArray.concat( child.filter( filterFunction ) );
			}, filtered );
		}
		return filtered;
	}
}
export default StructuredNode;
