/**
 * Abstract class representing a node in the structured tree.
 * @abstract
 */
class Node {
	/**
	 * Makes a new Node.
	 *
	 * @param {string} type		The type of Node (should be unique for each child class of Node).
	 *
	 * @abstract
	 */
	constructor( type ) {
		this.type = type;
		this.startIndex = 0;
		this.endIndex = 0;
	}

	/**
	 * Maps the given function to each Node in this tree.
	 *
	 * @param {mapFunction} mapFunction 	The function that should be mapped to each Node in the tree.
	 *
	 * @returns {Node} A new tree, after the given function has been mapped on each Node.
	 */
	map( mapFunction ) {
		// Map function over contents of this node.
		const node = mapFunction( this );
		if ( node.children && node.children.length > 0 ) {
			// Map function over node's children (if it has any).
			node.children = node.children.map( child => child.map( mapFunction ) );
		}
		return node;
	}

	/**
	 * Callback function for the Node's map-function.
	 *
	 * @callback mapFunction
	 *
	 * @param {Node} currentValue 	The current Node being processed.
	 *
	 * @returns {Node} The current Node after being processed by this function.
	 *
	 * @private
	 */

	/**
	 * Filters all the elements out of the tree for which the given predicate function returns `false`
	 * and returns them as an array of Nodes.
	 *
	 * @param {filterCallback} callback 	The predicate to check each Node against.
	 *
	 * @returns {Node[]} An array of all the Nodes in the tree for which the given predicate function returns `true`.
	 */
	filter( callback ) { // eslint-disable-line no-unused-vars
		console.warn( "Developer warning: " +
			"Filter is an abstract method that should be implemented by a child class." );
	}

	/**
	 * Callback function for the Node's filter-function.
	 *
	 * @callback filterCallback
	 *
	 * @param {Node} currentValue 	The current Node being processed.
	 *
	 * @returns {boolean} If the current Node should be contained in the array after filtering.
	 *
	 * @private
	 */
}

export default Node;
