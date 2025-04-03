export default Paragraph;
/**
 * Represents a paragraph with text within a document.
 *
 * @extends module:parsedPaper/structure.LeafNode
 *
 * @memberOf module:parsedPaper/structure
 */
declare class Paragraph {
    /**
     * A paragraph within a document.
     *
     * @param {Object}  sourceCodeLocation The parse5 formatted location of the element inside of the source code.
     * @param {boolean} [isImplicit=false] If this paragraph is implicit.
     */
    constructor(sourceCodeLocation: Object, isImplicit?: boolean | undefined);
    isImplicit: boolean;
}
