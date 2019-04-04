/**
 * A parsed version of the paper, containing a tree representation of the text,
 * and parsed metaData pertaining to the tree's context.
 *
 * @class ParsedPaper
 *
 * @memberOf module:parsedPaper
 * */
export default class ParsedPaper {
	/**
	 *
	 */
	constructor() {
		this._metaData = {};
		this._tree = {};

		this.setTree.bind( this );
	}

	/**
	 * Sets a tree structure on ParsedPaper's _tree
	 *
	 * @param {module:parsedPaper/structure.Node} tree A tree representation of the paper's text.
	 *
	 * @returns {void}
	 */
	setTree( tree ) {
		this._tree = tree;
	}

	/**
	 * Returns the tree.
	 *
	 * @returns {module:parsedPaper/structure.Node|Object} The tree.
	 */
	getTree() {
		return this._tree;
	}

	/**
	 * Sets a key-value pair on the metaData object.
	 *
	 * @param {string} key   The key for the metaData key-value pair.
	 * @param {*}      value The value for the metaData key-value pair.
	 *
	 * @returns {void}
	 */
	setMetaValue( key, value ) {
		this._metaData[ key ] = value;
	}

	/**
	 * Returns the value for a specific key from the metaData.
	 *
	 * @param   {string} key The key to return the value for.
	 * @returns {*}          The value belonging to this key.
	 */
	getMetaValue( key ) {
		return this._metaData[ key ];
	}

	/**
	 * Sets the metaData.
	 *
	 * @param {Object} metaData The metaData pertaining to tree.
	 *
	 * @returns {void}
	 */
	setMetaData( metaData ) {
		this._metaData = metaData;
	}

	/**
	 * Returns the current metaData.
	 *
	 * @returns {Object} The metaData.
	 */
	getMetaData() {
		return this._metaData;
	}
}
