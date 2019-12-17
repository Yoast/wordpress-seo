import SourceCodeLocation from "../SourceCodeLocation";
import TextContainer from "../TextContainer";
import Node from "./Node";
/**
 * A node at the end of the tree that may only contain formatting elements,
 * these include headings and paragraphs.
 *
 * @extends module:parsedPaper/structure.Node
 *
 * @memberOf module:parsedPaper/structure
 *
 * @abstract
 */
class LeafNode extends Node {
	/**
	 * Creates a new leaf node.
	 *
	 * @param {string}             type               The type of Node (should be unique for each child class of Node).
	 * @param {SourceCodeLocation} sourceCodeLocation The location of the element inside of the source code.
	 *
	 * @returns {void}
	 */
	constructor( type, sourceCodeLocation ) {
		super( type );
		/**
		 * Location inside of the source code.
		 * @type {SourceCodeLocation}
		 */
		this.sourceCodeLocation = new SourceCodeLocation( sourceCodeLocation );
		/**
		 * A container for keeping this leaf node's text.
		 * @type {module:parsedPaper/structure.TextContainer}
		 */
		this.textContainer = new TextContainer();
	}

	/**
	 * Retrieves the heading text (from the TextContainer).
	 *
	 * @returns {string} The text of the heading.
	 */
	get text() {
		return this.textContainer.text;
	}

	/**
	 * Sets the heading text (via the TextContainer).
	 *
	 * @param {string} text The text to assign as the heading text.
	 *
	 * @returns {void}
	 */
	set text( text ) {
		this.textContainer.text = text;
	}
}

export default LeafNode;
