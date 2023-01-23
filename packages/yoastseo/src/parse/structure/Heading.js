import Node from "./Node";

/**
 * A heading in the tree.
 */
class Heading extends Node {
	/**
	 * Creates a new heading.
	 *
	 * @param {1|2|3|4|5|6} level The heading level (e.g. `1` for `h1` up to `6` for `h6`).
	 * @param {Object} attributes This heading's attributes.
	 * @param {(Node|Text)[]} childNodes This heading's child nodes.
	 */
	constructor( level, attributes = {}, childNodes = [] ) {
		super( `h${level}`, attributes, childNodes );
		/**
		 * This heading's level (e.g. `1` for `h1`, `2` for `h2` etc.).
		 *
		 * @type {1|2|3|4|5|6}
		 */
		this.level = level;
	}
}

export default Heading;
