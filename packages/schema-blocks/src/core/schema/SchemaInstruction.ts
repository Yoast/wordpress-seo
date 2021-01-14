import { SchemaValue, SchemaDefinitionConfiguration } from "./SchemaDefinition";
import Instruction, { InstructionOptions } from "../Instruction";
import { BlockInstance } from "@wordpress/blocks";
import { BlockValidation, BlockValidationResult } from "../validation";

export type SchemaInstructionClass = { new( id: number, options: InstructionOptions ): SchemaInstruction };

/**
 * SchemaInstruction class.
 */
export default abstract class SchemaInstruction extends Instruction {
	/* eslint-disable @typescript-eslint/no-unused-vars */
	/**
	 * Renders schema.
	 *
	 * @param blockInstance The block.
	 *
	 * @returns The schema.
	 */
	render( blockInstance: BlockInstance ): SchemaValue {
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


	/**
	 * Validates a block against a schema definition.
	 *
	 * @param blockInstance The block to validate.
	 * @returns {BlockValidationResult} The validation results.
	 */
	validate( blockInstance: BlockInstance ): BlockValidationResult[] {
		return [ new BlockValidationResult( blockInstance.clientId, blockInstance.name, BlockValidation.Valid ) ];
	}
}
