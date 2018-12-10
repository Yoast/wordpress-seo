import Node from "./Node";
/**
 * Represents a paragraph with text within a document.
 */
class Paragraph extends Node {
	/**
	 * A paragraph within a document.
	 *
	 * @param {TextContainer} textContainer That includes the text without any formatting and phrasing elements if any.
	 * @param {number} startIndex 			Start position of this paragraph in the raw text-string.
	 * @param {number} endIndex			End position of this paragraph in the raw text-string.
	 * @param {string} [tag=""]			Optional tag to use for opening / closing this paragraph.
	 */
	constructor( textContainer, startIndex, endIndex, tag = "" ) {
		super( "paragraph", startIndex, endIndex );
		// The text with markup inside the paragraph.
		this.textContainer = textContainer;
		this.tag = tag;
	}

	/**
	 * Makes a clone of this Node.
	 *
	 * @returns {Node} The clone of this Node.
	 */
	clone() {
		return new Paragraph(
			this.textContainer,
			this.startIndex,
			this.endIndex,
			this.tag
		);
	}

	/**
	 * Maps the given function to this Paragraph.
	 *
	 * @param {mapCallback} mappingFunction	The function that should be mapped to this Paragraph.
	 * @returns {Node} A clone of this Paragraph after the given function has been applied to it.
	 */
	map( mappingFunction ) {
		const clone = this.clone();
		return mappingFunction( clone );
	}

	/**
	 * Filters all the elements out of the tree for which the given predicate function returns `false`
	 * and returns them as an array of Nodes.
	 *
	 * @param {filterCallback} filterFunction		The predicate to check each Node against.
	 * @returns {Node[]} An array with this Paragraph, if the predicate returns true for this Paragraph, an empty array if not.
	 */
	filter( filterFunction ) {
		const clone = this.clone();
		return filterFunction( clone ) ? [ clone ] : [];
	}
}

export default Paragraph;
