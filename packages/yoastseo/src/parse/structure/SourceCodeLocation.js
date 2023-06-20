/**
 * Represents a range in the source code.
 *
 * @typedef {Object} SourceCodeRange
 * @property {number} startOffset The start position of the range.
 * @property {number} endOffset The end position of the range.
 */

/**
 * Represents a location of a node in the HTML tree.
 *
 * @extends SourceCodeRange
 * @property {SourceCodeRange?} startTag The location of the start tag of the element, if it has one.
 * @property {SourceCodeRange?} endTag The location of the end tag of the element, if it has one.
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
