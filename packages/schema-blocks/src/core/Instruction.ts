import { BlockInstance } from "@wordpress/blocks";
import logger from "../functions/logger";
import { BlockValidationResult, BlockValidation } from "./validation";
export type InstructionPrimitive = string | number | boolean;
export type InstructionValue = InstructionPrimitive | InstructionObject | InstructionArray;
export type InstructionArray = readonly InstructionValue[];
export interface InstructionObject { [member: string]: InstructionValue }
export interface InstructionClass<T extends Instruction> {
	new( id: number, options: InstructionOptions ): T;
}
export type InstructionOptions = InstructionObject & {
	name: string;
};

/**
 * Abstract instruction class.
 */
export default abstract class Instruction {
	static registeredInstructions: Record<string, InstructionClass<Instruction>>;

	public id: number;
	public options: InstructionOptions;

	/**
	 * Creates a render instruction.
	 *
	 * @param id      The id.
	 * @param options The options.
	 */
	constructor(
		id: number,
		options: InstructionOptions,
	) {
		this.id = id;
		this.options = options;
	}

	/**
	 * Returns the configuration of this instruction.
	 *
	 * @returns The configuration.
	 */
	configuration(): Partial<Record<string, unknown>> {
		return {};
	}

	/**
	 * Returns whether or not this instruction should be included in the tree.
	 *
	 * @returns Whether or not to render this instruction.
	 */
	renderable(): boolean {
		return true;
	}

	/**
	 * Validates the block instance against its definition.
	 *
	 * @param blockInstance The block to check.
	 * @returns {BlockValidationResult} The validation result.
	 */
	validate( blockInstance: BlockInstance ): BlockValidationResult {
		return new BlockValidationResult( blockInstance.clientId, blockInstance.name, BlockValidation.Unknown );
	}

	/**
	 * Registers a new instruction.
	 *
	 * @param this        This.
	 * @param name        The name of the instruction.
	 * @param instruction The instruction class.
	 *
	 * @returns {void}
	 */
	static register<I extends typeof Instruction>( this: I, name: string, instruction: InstructionClass<I["prototype"]> ): void {
		if ( typeof this.registeredInstructions === "undefined" ) {
			this.registeredInstructions = {};
		}

		this.registeredInstructions[ name ] = instruction;
	}

	/**
	 * Retrieves a registered blockinstruction.
	 * @param this This.
	 * @param name The block to retrieve.
	 * @returns {InstructionClass} The registered BlockInstruction.
	 */
	static getBlock<I extends typeof Instruction>( this: I, name: string ): InstructionClass<I["prototype"]> {
		return this.registeredInstructions[ name ];
	}

	/**
	 * Creates an instruction instance.
	 *
	 * @param this    This.
	 * @param name    The name of the instruction.
	 * @param id      The id of the instance.
	 * @param options The options of the instance.
	 *
	 * @returns The instruction instance.
	 */
	static create<I extends typeof Instruction>( this: I, name: string, id: number, options: InstructionOptions ): I["prototype"] {
		if ( typeof this.registeredInstructions === "undefined" ) {
			this.registeredInstructions = {};
		}

		const klass = this.registeredInstructions[ name ];

		if ( ! klass ) {
			logger.error( "Invalid instruction: ", name );
			logger.debug( "if you just added a new instruction class, did you export that class?" );
		}

		return new klass( id, options );
	}
}
