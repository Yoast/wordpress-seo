import { SchemaValue, SchemaDefinitionConfiguration } from "./SchemaDefinition";
import Instruction, { InstructionOptions } from "../Instruction";
import { BlockInstance } from "@wordpress/blocks";

export type SchemaInstructionClass = { new( id: number, options: InstructionOptions ): SchemaInstruction };

/**
 * SchemaInstruction class.
 */
export default abstract class SchemaInstruction extends Instruction {
	/* eslint-disable @typescript-eslint/no-unused-vars */
	/**
	 * Renders schema.
	 *
	 * @param block The block.
	 *
	 * @returns The schema.
	 */
	render( block: BlockInstance ): SchemaValue {
		return null;
	}
	/* eslint-enable @typescript-eslint/no-unused-vars */

	/**
	 * Returns the schema definition configuration.
	 *
	 * @returns The configuration.
	 */
	configuration(): Partial<SchemaDefinitionConfiguration> {
		return {};
	}
}
