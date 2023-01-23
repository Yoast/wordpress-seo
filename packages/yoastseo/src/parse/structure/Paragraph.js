import Node from "./Node";

/**
 * A paragraph in the tree.
 *
 * @see https://html.spec.whatwg.org/dev/dom.html#paragraphs
 */
class Paragraph extends Node {
	/**
	 * Creates a new paragraph.
	 *
	 * @param {Object} attributes The paragraph's attributes.
	 * @param {(Node|Text)[]} childNodes This paragraph's child nodes.
	 * @param {boolean} isImplicit Whether this paragraph is an implicit paragraph, or an explicit paragraph.
	 */
	constructor( attributes = {}, childNodes = [], isImplicit = false ) {
		super( "p", attributes, childNodes );
		/**
		 * Whether this paragraph is explicit (defined by an explicit `<p>` tag within the markup),
		 * or implicit (defined by a run of phrasing content).
		 *
		 * @see https://html.spec.whatwg.org/dev/dom.html#paragraphs
		 *
		 * @type {boolean}
		 */
		this.isImplicit = isImplicit;
	}
}

export default Paragraph;
