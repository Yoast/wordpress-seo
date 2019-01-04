/**
 * Abstract class representing a node in the structured tree.
 * @abstract
 *
 * @memberOf module:tree/structure
 */
class Node {
	/**
	 * Makes a new Node.
	 *
	 * @param {string} type The type of Node (should be unique for each child class of Node).
	 *
	 * @abstract
	 */
	constructor( type ) {
		/**
		 * Type of node (unique for each child class of Node).
		 * @type {string}
		 */
		this.type = type;
		/**
		 * Start of this element (including tags) within the source text.
		 * @type {?number}
		 */
		this.startIndex = 0;
		/**
		 * End of this element (including tags) within the source text.
		 * @type {?number}
		 */
		this.endIndex = 0;
	}

	/**
	 * Maps the given function to each Node in this tree.
	 *
	 * @param {mapFunction} mapFunction The function that should be mapped to each Node in the tree.
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
	 * @param {Node} currentValue The current Node being processed.
	 *
	 * @returns {Node} The current Node after being processed by this function.
	 *
	 * @private
	 */

	/**
	 * Filters all the elements out of the tree for which the given predicate function returns `false`
	 * and returns them as an array of Nodes.
	 *
	 * @param {predicate} predicate The predicate to check each Node against.
	 *
	 * @returns {Node[]} An array of all the Nodes in the tree for which the given predicate function returns `true`.
	 */
	filter( predicate ) { // eslint-disable-line no-unused-vars
		console.warn( "Developer warning: " +
			"Filter is an abstract method that should be implemented by a child class." );
	}

	/**
	 * Predicate function.
	 *
	 * @callback predicate
	 *
	 * @param {Node} currentValue The current Node being processed.
	 *
	 * @returns {boolean} If the predicate returns true or false.
	 *
	 * @private
	 */

	/**
	 * Custom replacer function for replacing 'parent' with nothing.
	 * This is done to remove cycles from the tree.
	 *
	 * @param {string} key		The key.
	 * @param {Object} value	The value.
	 *
	 * @returns {Object} The (optionally replaced) value.
	 *
	 * @private
	 */
	static _removeParent( key, value ) {
		if ( key === "parent" ) {
			return;
		}
		return value;
	}

	/**
	 * Transforms this tree to a string representation.
	 * For use in e.g. logging to the console or to a text file.
	 *
	 * @param {number|string} [indentation = 2] The space with which to indent each successive level in the JSON tree.
	 *
	 * @returns {string} This tree, transformed to a string.
	 */
	toString( indentation = 2 ) {
		return JSON.stringify( this, Node._removeParent, indentation );
	}
}

export default Node;
