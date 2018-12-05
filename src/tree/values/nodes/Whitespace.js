/**
 * Represents a piece of whitespace that cannot be represented by any other structured element.
 */
class Whitespace {
	/**
	 * Represents a piece of whitespace that cannot be represented by any other structured element.
	 *
	 * @param {string} content The type of the whitespace (e.g., any combination of tabs, spaces, line-feeds).
	 *
	 * @returns {void}
	 */
	constructor( content ) {
		this.content = content;
	}
}

export default Whitespace;
