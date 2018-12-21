/**
 * Custom replacer function for replacing 'parent' with nothing.
 * This is done to remove cycles from the tree.
 *
 * @param {string} key		The key.
 * @param {Object} value	The value.
 *
 * @returns {Object} The (optionally replaced) value.
 */
const removeParent = function( key, value ) {
	if ( key === "parent" ) {
		return;
	}
	return value;
};

/**
 * Transforms the given tree to a stringified JSON representation.
 *
 * @param {Node} tree	                      The tree to stringify.
 * @param {number|string} [indentation = 2] The space with which to indent each successive level in the JSON tree.
 * @returns {string} The stringified representation.
 */
export default function( tree, indentation = 2 ) {
	return JSON.stringify( tree, removeParent, indentation );
}
