/**
 * Abstract class representing a node in the structured tree.
 * @abstract
 */
class Node { // eslint-disable-line no-unused-vars
	/**
	 * Makes a new Node.
	 *
	 * @param {number} startIndex	The index in the original text-string where this Node begins.
	 * @param {number} endIndex	The index in the original text-string where this Node ends.
	 * @param {string} type		The type of Node (should be unique for each child class of Node).
	 */
	constructor( startIndex, endIndex, type ) {
		this.type = type;
		this.startIndex = startIndex;
		this.endIndex = endIndex;
	}

	/**
	 * Maps the given function to each Node in this tree.
	 *
	 * @param {Node~mapCallback} callback 	The function that should be mapped to each Node in the tree.
	 *
	 * @returns {Node} A new tree, after the given function has been mapped on each Node.
	 *
	 * @abstract
	 */
	static map( callback ) { // eslint-disable-line no-unused-vars
		console.warn( "Developer warning: " +
			"Map is an abstract method that should be implemented by a child class." );
	}

	/**
	 * Callback function for the Node's map-function.
	 *
	 * @callback Node~mapCallback
	 *
	 * @param {Node} currentValue 	The current Node being processed.
	 * @param {Node} tree			The tree `map` was called upon.
	 *
	 * @returns {Node} The current Node after being processed by this function.
	 */

	/**
	 * Maps the given function to each Node in this tree.
	 *
	 * @param {Node~filterCallback} callback 	The predicate to check each Node against.
	 *
	 * @returns {Node[]} An array of all the Nodes in the tree for which the given predicate function returns true.
	 *
	 * @abstract
	 */
	static filter( callback ) { // eslint-disable-line no-unused-vars
		console.warn( "Developer warning: " +
			"Filter is an abstract method that should be implemented by a child class." );
	}

	/**
	 * Callback function for the Node's filter-function.
	 *
	 * @callback Node~filterCallback
	 *
	 * @param {Node} currentValue 	The current Node being processed.
	 * @param {Node} tree			The tree `map` was called upon.
	 *
	 * @returns {boolean} If the current Node should be contained in the array after filtering.
	 */
}
