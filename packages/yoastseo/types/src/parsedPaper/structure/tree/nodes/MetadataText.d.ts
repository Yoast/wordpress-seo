export default MetadataText;
/**
 * Represents a text within the metadata tree branch.
 *
 * @extends module:parsedPaper/structure.LeafNode
 *
 * @memberOf module:parsedPaper/structure
 */
declare class MetadataText {
    /**
     * Creates a new MetadataText node.
     *
     * @param {string} type The type of this node.
     * @param {string} text The text of this node.
     *
     * @constructor
     */
    constructor(type?: string, text?: string);
    text: string;
}
