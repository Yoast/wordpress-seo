import Node from "./Node";
/**
 * A header in a document.
 */
class Heading extends Node {
	/**
	 * Makes a new header object.
	 *
	 * @param {number} startIndex			The index in the original text-string where this Node begins.
	 * @param {number} endIndex			The index in the original text-string where this Node ends.
	 * @param {number} level				The header level (e.g. 1 for main heading, 2 for subheading lvl 2, etc.)
	 * @param {TextContainer} textContainer	The text contained within this heading.
	 */
	constructor( startIndex, endIndex, level, textContainer ) {
		super( "heading", startIndex, endIndex );
		this.level = level;
		this.textContainer = textContainer;
	}

	/**
	 * Makes a clone of this Node.
	 *
	 * @returns {Node} The clone of this Node.
	 */
	clone() {
		return new Heading(
			this.startIndex,
			this.endIndex,
			this.level,
			this.textContainer,
		);
	}

	/**
	 * Maps the given function to this Heading.
	 *
	 * @param {mapCallback} mappingFunction	The function that should be mapped to this Heading.
	 * @returns {Node} A clone of this Heading after the given function has been applied to it.
	 */
	map( mappingFunction ) {
		return mappingFunction( this.clone() );
	}

	/**
	 * Filters all the elements out of the tree for which the given predicate function returns `false`
	 * and returns them as an array of Nodes.
	 *
	 * @param {filterCallback} filterFunction		The predicate to check each Node against.
	 * @returns {Node[]} An array with this Paragraph, if the predicate returns true for this Paragraph, an empty array if not.
	 */
	filter( filterFunction ) {
		return filterFunction( this ) ? [ this.clone() ] : [];
	}
}
export default Heading;
