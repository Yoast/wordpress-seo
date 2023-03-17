/**
 * Represents a location of a node in the HTML tree.
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
class SourceCodeLocation {
	/**
	 * Creates a new SourceCodeLocation.
	 *
	 * @param {Object} sourceCodeLocationInfo This node's location in the source code, from parse5.
	 */
	constructor( sourceCodeLocationInfo ) {
		if ( sourceCodeLocationInfo.startTag ) {
			this.startTag = {
				startOffset: sourceCodeLocationInfo.startTag.startOffset,
				endOffset: sourceCodeLocationInfo.startTag.endOffset,
			};
		}
		if ( sourceCodeLocationInfo.endTag ) {
			this.endTag = {
				startOffset: sourceCodeLocationInfo.endTag.startOffset,
				endOffset: sourceCodeLocationInfo.endTag.endOffset,
			};
		}

		this.startOffset = sourceCodeLocationInfo.startOffset;
		this.endOffset = sourceCodeLocationInfo.endOffset;
	}
}

export default SourceCodeLocation;
