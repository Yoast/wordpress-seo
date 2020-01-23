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
	 * @param {Object}  sourceCodeLocation The parse5 formatted location of the element inside of the source code.
	 * @param {boolean} [isImplicit=false] If this paragraph is implicit.
	 */
	constructor( sourceCodeLocation, isImplicit = false ) {
		super( "Paragraph", sourceCodeLocation );

		this.isImplicit = isImplicit;
	}
}

export default Paragraph;
