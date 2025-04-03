export default Heading;
/**
 * A header in a document.
 *
 * @extends module:parsedPaper/structure.LeafNode
 *
 * @memberOf module:parsedPaper/structure
 */
declare class Heading {
    /**
     * Makes a new header object.
     *
     * @param {number} level              The header level (e.g. 1 for main heading, 2 for subheading lvl 2, etc.)
     * @param {Object} sourceCodeLocation The parse5 formatted location of the element inside of the source code.
     */
    constructor(level: number, sourceCodeLocation: Object);
    /**
     * Heading's level (e.g. 1 for "h1", 2 for "h2", ... ).
     * @type {number}
     */
    level: number;
}
