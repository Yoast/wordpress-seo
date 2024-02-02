import SourceCodeLocation from "./SourceCodeLocation";
/**
 * A text.
 */
class Text {
	/**
	 * Creates a new Text object, that consist of some text and a source code range.
	 *
	 * @param {object} textNode The current #text node in the parse5 tree.
	 */
	constructor( textNode ) {
		this.name = "#text";
		/**
		 * This text's content.
		 *
		 * @type {string}
		 */
		this.value = textNode.value;

		this.sourceCodeRange = new SourceCodeLocation( {
			startOffset: textNode.sourceCodeLocation.startOffset,
			endOffset: textNode.sourceCodeLocation.endOffset,
		} );
	}
}

export default Text;
