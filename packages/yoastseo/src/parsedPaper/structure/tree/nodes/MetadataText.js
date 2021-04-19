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
	 * @param {string} type The type of this node.
	 * @param {string} text The text of this node.
	 *
	 * @constructor
	 */
	constructor( type = "MetadataText", text = "" ) {
		super( type, null );

		this.text = text;
	}
}

export default MetadataText;
