/**
 * A parsed version of the paper, containing a tree representation of the text,
 * and parsed metadata pertaining to the tree's context.
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
		this._metadata = {};
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
	 * Sets a key-value pair on the metadata object.
	 *
	 * @param {string} key   The key for the metadata key-value pair.
	 * @param {*}      value The value for the metadata key-value pair.
	 *
	 * @returns {void}
	 */
	setMetaValue( key, value ) {
		this._metadata[ key ] = value;
	}

	/**
	 * Returns the value for a specific key from the metadata.
	 *
	 * @param   {string} key The key to return the value for.
	 * @returns {*}          The value belonging to this key.
	 */
	getMetaValue( key ) {
		return this._metadata[ key ];
	}

	/**
	 * Sets the metadata.
	 *
	 * @param {Object} metadata The metadata pertaining to tree.
	 *
	 * returns {void}
	 */
	setMetadata( metadata ) {
		this._metadata = metadata;
	}

	/**
	 * Returns the current metadata.
	 *
	 * @returns {Object} The metadata.
	 */
	getMetadata() {
		return this._metadata;
	}
}
