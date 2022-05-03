import SchemaLeaf from "../../core/schema/SchemaLeaf";
import { SchemaArray } from "../../core/schema/SchemaDefinition";
import { BlockInstance } from "@wordpress/blocks";

/**
 * SchemaArrayLeaf class
 */
export default class SchemaArrayLeaf extends SchemaLeaf {
	public array: SchemaLeaf[];

	/**
     * Constructs a schema array leaf.
     *
     * @param array The array.
     */
	public constructor( array: SchemaLeaf[] ) {
		super();
		this.array = array;
	}

	/**
	 * Renders a schema leaf.
	 *
	 * @param block The block.
	 *
	 * @returns The rendered schema.
	 */
	render( block: BlockInstance ): SchemaArray {
		return this.array.map( leaf => leaf.render( block ) );
	}
}
