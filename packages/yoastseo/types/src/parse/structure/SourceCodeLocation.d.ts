export default SourceCodeLocation;
/**
 * Represents a range in the source code.
 */
export type SourceCodeRange = {
    /**
     * The start position of the range.
     */
    startOffset: number;
    /**
     * The end position of the range.
     */
    endOffset: number;
};
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
declare class SourceCodeLocation {
    /**
     * Creates a new SourceCodeLocation.
     *
     * @param {Object} sourceCodeLocationInfo This node's location in the source code, from parse5.
     */
    constructor(sourceCodeLocationInfo: Object);
    startTag: {
        startOffset: any;
        endOffset: any;
    } | undefined;
    endTag: {
        startOffset: any;
        endOffset: any;
    } | undefined;
    startOffset: any;
    endOffset: any;
}
