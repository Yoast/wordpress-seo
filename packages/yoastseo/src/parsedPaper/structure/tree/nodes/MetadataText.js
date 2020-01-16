import LeafNode from "./LeafNode";

/**
 * Represents a text within the metadata tree branch.
 *
 * @extends module:parsedPaper/structure.LeafNode
 *
 * @memberOf module:parsedPaper/structure
 */
class MetadataText extends LeafNode {
	/**
	 * Creates a new MetadataText node.
	 *
	 * @constructor
	 */
	constructor() {
		super( "MetadataText", null );
	}
}

export default MetadataText;
