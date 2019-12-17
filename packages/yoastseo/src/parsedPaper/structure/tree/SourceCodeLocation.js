

class SourceCodeLocation {

	constructor( { startTag, endTag, startOffset, endOffset } ) {
		this.startTag = { startOffset: startTag.startOffset, endOffset: startTag.endOffset };
		this.endTag = { startOffset: endTag.startOffset, endOffset: endTag.endOffset };
		this.startOffset = startOffset;
		this.endOffset = endOffset;
	}
}

export default SourceCodeLocation;
