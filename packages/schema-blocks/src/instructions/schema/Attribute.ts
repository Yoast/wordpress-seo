import { SchemaValue } from "../../core/schema/SchemaDefinition";
import SchemaInstruction, { SchemaInstructionOptions } from "../../core/schema/SchemaInstruction";
import { BlockInstance } from "@wordpress/blocks";

/**
 * Attribute instruction.
 */
export default class Attribute extends SchemaInstruction {
	public options: SchemaInstructionOptions & {
		default?: string;
	}

	/**
	 * Renders schema.
	 *
	 * @param block The block.
	 *
	 * @returns The schema.
	 */
	render( block: BlockInstance ): SchemaValue {
		return block.attributes[ this.options.name ] as string || this.options.default;
	}
}

SchemaInstruction.register( "attribute", Attribute );
