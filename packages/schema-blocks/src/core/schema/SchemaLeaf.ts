import { SchemaValue } from "./SchemaDefinition";
import Leaf from "../Leaf";
import { BlockInstance } from "@wordpress/blocks";

/**
 * Leaf class
 */
export default abstract class SchemaLeaf extends Leaf {
	parent: SchemaLeaf;

	/**
	 * Renders a schema leaf.
	 *
	 * @param block The block.
	 *
	 * @returns The rendered schema.
	 */
	abstract render( block: BlockInstance ): SchemaValue
}
