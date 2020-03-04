import SchemaLeaf from "../../core/schema/SchemaLeaf";
import { SchemaValue } from "../../core/schema/SchemaDefinition";
import SchemaInstruction from "../../core/schema/SchemaInstruction";
import { BlockInstance } from "@wordpress/blocks";

/**
 * SchemaInstructionLeaf class
 */
export default class SchemaInstructionLeaf extends SchemaLeaf {
	public instruction: SchemaInstruction;

	/**
     * Constructs a schema instruction leaf.
     *
     * @param instruction The instruction.
     */
	public constructor( instruction: SchemaInstruction ) {
		super();
		this.instruction = instruction;
	}

	/**
	 * Renders a schema leaf.
	 *
	 * @param block The block.
	 *
	 * @returns The rendered schema.
	 */
	render( block: BlockInstance ): SchemaValue {
		return this.instruction.render( block );
	}
}
