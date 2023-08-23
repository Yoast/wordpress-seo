import SourceCodeLocation from "./SourceCodeLocation";
/**
 * A text.
 */
class Text {
	/**
	 * Creates a new text.
	 *
	 * @param {string} tree The tree that potentially contains text.
	 */
	constructor( tree ) {
		this.name = "#text";
		/**
		 * This text's content.
		 *
		 * @type {string}
		 */
		this.value = tree.value;

		const { startOffset, endOffset } = tree.sourceCodeLocation;

		this.sourceCodeLocation = new SourceCodeLocation( {
			startOffset: startOffset,
			endOffset: endOffset,
		} );
	}
}

export default Text;
