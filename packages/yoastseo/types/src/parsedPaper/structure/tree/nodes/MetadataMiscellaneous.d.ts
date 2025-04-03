export default MetadataMiscellaneous;
/**
 * Represents miscellaneous metadata within the metadata tree branch.
 *
 * @extends module:parsedPaper/structure.LeafNode
 *
 * @memberOf module:parsedPaper/structure
 */
declare class MetadataMiscellaneous {
    /**
     * Creates a new MetadataMiscellaneous node.
     *
     * @param {string} type The type of this node.
     * @param {*} [data=null] The data.
     *
     * @constructor
     */
    constructor(type?: string, data?: any);
    _data: any;
    /**
     * Sets the data.
     *
     * @param {*} data The data to keep.
     *
     * @returns {void}
     */
    set data(data: any);
    /**
     * Retrieves the data.
     *
     * @returns {*} The data.
     */
    get data(): any;
}
