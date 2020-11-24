import SchemaInstruction from "../../core/schema/SchemaInstruction";
import { BlockInstance } from "@wordpress/blocks";
import { getBlockSchemaId } from "../../functions/gutenberg/block";

/**
 * BlockID instruction
 */
class BlockID extends SchemaInstruction {
	/**
	 * Renders schema.
	 *
	 * @param block The block.
	 *
	 * @returns The schema.
	 */
	render( block: BlockInstance ): string {
		return getBlockSchemaId( block );
	}
}

SchemaInstruction.register( "block-id", BlockID );
