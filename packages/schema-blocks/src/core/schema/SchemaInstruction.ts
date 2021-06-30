import { SchemaDefinitionConfiguration, SchemaValue } from "./SchemaDefinition";
import Instruction, { InstructionOptions } from "../Instruction";
import { BlockInstance } from "@wordpress/blocks";
import { BlockValidation, BlockValidationResult } from "../validation";
import { BlockPresence } from "../validation/BlockValidationResult";

export type SchemaInstructionOptions = InstructionOptions & SchemaDefinitionConfiguration & {
	presence?: BlockPresence;
}

// eslint-disable-next-line no-use-before-define
export type SchemaInstructionClass = { new( id: number, options: SchemaInstructionOptions ): SchemaInstruction };

/**
 * SchemaInstruction class.
 */
export default abstract class SchemaInstruction extends Instruction {
	public options: SchemaInstructionOptions;

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
	configuration(): Partial<SchemaInstructionOptions> {
		return {};
	}

	/**
	 * Validates a block against a schema definition.
	 *
	 * @param blockInstance The block to validate.
	 * @returns {BlockValidationResult} The validation results.
	 */
	validate( blockInstance: BlockInstance ): BlockValidationResult {
		return new BlockValidationResult( blockInstance.clientId, blockInstance.name, BlockValidation.Valid, this.options.presence );
	}
}
