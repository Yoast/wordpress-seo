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
	}

	/**
	 * Maps the given function to each Node in this tree.
	 *
	 * @param {mapCallback} callback 	The function that should be mapped to each Node in the tree.
	 *
	 * @returns {Node} A new tree, after the given function has been mapped on each Node.
	 *
	 * @abstract
	 */
	map( callback ) { // eslint-disable-line no-unused-vars
		console.warn( "Developer warning: " +
			"Map is an abstract method that should be implemented by a child class." );
	}

	/**
	 * Callback function for the Node's map-function.
	 *
	 * @callback mapCallback
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
	 *
	 * @abstract
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
