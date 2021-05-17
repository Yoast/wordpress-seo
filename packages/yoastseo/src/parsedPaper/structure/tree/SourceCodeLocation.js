/**
 * A location of an element in the source code.
 */
class SourceCodeLocation {
	/**
	 * A location of an element in the source code.
	 *
	 * @param {Object?} startTag The location of the start tag of the element, if it has one.
	 * @param {number} startTag.startOffset The start position of the start tag.
	 * @param {number} startTag.endOffset The end position of the start tag.
	 *
	 * @param {Object?} endTag The location of the end tag of the element, if it has one.
	 * @param {number} endTag.startOffset The start position of the end tag.
	 * @param {number} endTag.endOffset The end position of the end tag.
	 *
	 * @param {Object} startOffset The start position of the element.
	 * @param {Object} endOffset The end position of the element.
	 */
	constructor( { startTag, endTag, startOffset, endOffset } ) {
		if ( startTag ) {
			this.startTag = { startOffset: startTag.startOffset, endOffset: startTag.endOffset };
		}
		if ( endTag ) {
			this.endTag = { startOffset: endTag.startOffset, endOffset: endTag.endOffset };
		}
		this.startOffset = startOffset;
		this.endOffset = endOffset;
	}
}

export default SourceCodeLocation;
