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
	 * Maps the given function to this Paragraph.
	 *
	 * @param {mapCallback} callback	The function that should be mapped to this Paragraph.
	 * @returns {Node} A clone of this Paragraph after the given function has been applied to it.
	 */
	map( callback ) {
		const clone = new Paragraph(
			this.textContainer,
			this.startIndex,
			this.endIndex,
			this.tag
		);
		return callback( clone );
	}

	/**
	 * Filters all the elements out of the tree for which the given predicate function returns `false`
	 * and returns them as an array of Nodes.
	 *
	 * @param {filterCallback} predicate		The predicate to check each Node against.
	 * @returns {Node[]} An array with this Paragraph, if the predicate returns true for this Paragraph, an empty array if not.
	 */
	filter( predicate ) {
		if ( predicate( this ) ) {
			return [ this ];
		}
		return [ ];
	}
}

export default Paragraph;
