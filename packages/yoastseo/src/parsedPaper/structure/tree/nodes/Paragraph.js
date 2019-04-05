import LeafNode from "./LeafNode";

/**
 * Represents a paragraph with text within a document.
 *
 * @extends module:parsedPaper/structure.LeafNode
 *
 * @memberOf module:parsedPaper/structure
 */
class Paragraph extends LeafNode {
	/**
	 * A paragraph within a document.
	 *
	 * @param {string} [tag=""] Optional tag to use for opening / closing this paragraph.
	 */
	constructor( tag = "" ) {
		super( "Paragraph" );
		/**
		 * Tag used to open or close this paragraph.
		 * @type {string}
		 */
		this.tag = tag;
	}

	/**
	 * If this paragraph is an explicit paragraph (with an explicit tag).
	 *
	 * @returns {boolean} If this paragraph is explicit.
	 */
	isExplicit() {
		return this.tag && this.tag.length > 0;
	}
}

export default Paragraph;
