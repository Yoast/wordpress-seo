import { has, get } from "lodash";
import SourceCodeLocation from "../SourceCodeLocation";

/**
 * Abstract class representing a node in the structured tree.
 * @abstract
 *
 * @memberOf module:parsedPaper/structure
 */
class Node {
	/**
	 * Makes a new Node.
	 *
	 * @param {string} type               The type of Node (should be unique for each child class of Node).
	 * @param {?Object} sourceCodeLocation The parse5 formatted location of the element inside of the source code.
	 *
	 * @abstract
	 */
	constructor( type, sourceCodeLocation ) {
		/**
		 * Type of node (unique for each child class of Node).
		 * @type {string}
		 */
		this.type = type;

		if ( sourceCodeLocation ) {
			/**
			 * Location inside of the source code.
			 * @type {SourceCodeLocation}
			 */
			this.sourceCodeLocation = new SourceCodeLocation( sourceCodeLocation );
		}

		/**
		 * The parent node of this node.
		 * @type {module:parsedPaper/structure.Node|null}
		 */
		this.parent = null;

		/**
		 * Cache for the research results.
		 * @type {Object}
		 * @private
		 */
		this._researchResult = {};
	}

	/**
	 * Stores the research result on this node.
	 *
	 * @param {string} researchName   The name of the research of which to store the results.
	 * @param {Object} researchResult The results to store.
	 *
	 * @returns {void}
	 */
	setResearchResult( researchName, researchResult ) {
		this._researchResult[ researchName ] = researchResult;
	}

	/**
	 * Returns the research result for the research with the given name.
	 *
	 * @param {string} researchName The name of the research of which to return the stored results.
	 *
	 * @returns {Object|null} The stored results, or null if not found.
	 */
	getResearchResult( researchName ) {
		return get( this._researchResult, researchName, null );
	}

	/**
	 * Checks whether results exist for the research with the given name.
	 *
	 * @param {string} researchName The name of the research to check.
	 *
	 * @returns {boolean} Whether results exists for the research with the given name.
	 */
	hasResearchResult( researchName ) {
		return has( this._researchResult, researchName );
	}

	/**
	 * Maps the given function to each Node in this tree.
	 *
	 * @param {module:parsedPaper/structure.Node.mapFunction} mapFunction The function that should be mapped to each Node in the tree.
	 *
	 * @returns {module:parsedPaper/structure.Node} A new tree, after the given function has been mapped on each Node.
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
	 * @callback module:parsedPaper/structure.Node.mapFunction
	 *
	 * @param {module:parsedPaper/structure.Node} currentValue The current Node being processed.
	 *
	 * @returns {module:parsedPaper/structure.Node} The current Node after being processed by this function.
	 */

	/**
	 * Executes the given function on each node in this tree.
	 *
	 * @param{function} fun The function to apply to each node in the tree.
	 *
	 * @returns {void}
	 */
	forEach( fun ) {
		fun( this );
		if ( this.children && this.children.length > 0 ) {
			this.children.forEach( fun );
		}
	}

	/**
	 * Custom replacer function for replacing 'parent' with nothing.
	 * This is done to remove cycles from the tree.
	 *
	 * @param {string} key   The key.
	 * @param {Object} value The value.
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
