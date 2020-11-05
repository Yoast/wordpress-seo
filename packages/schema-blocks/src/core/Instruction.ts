import Attribute from "../instructions/schema/Attribute";

export type InstructionOptions =
	Record<string, string | boolean | number | Array<string | boolean | number> | Record<string, string | boolean | number>>;
export type InstructionClass<T extends Instruction> = {
	new( id: number, options: InstructionOptions ): T;
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
	 * Checks if the instruction block is valid.
	 *
	 * @param attributes: The attributes from RenderSaveProps or RenderEditProps.
	 * @returns {boolean} True if the instruction block is valid, False if the block contains errors.
	 */
	valid( attributes: object ): boolean {
		return true;
	}

	/**
	 * Register a new instruction.
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
	 * Creates an instruction instance.
	 *
	 * @param this    This.
	 * @param name    The name of the instruction.
	 * @param id      The id of the instance.
	 * @param options The options of the instance.
	 *
	 * @returns The instruction instance.
	 */
	static create<I extends typeof Instruction>( this: I, name: string, id: number, options: InstructionOptions = {} ): I["prototype"] {
		if ( typeof this.registeredInstructions === "undefined" ) {
			this.registeredInstructions = {};
		}

		const klass = this.registeredInstructions[ name ];

		if ( ! klass ) {
			console.error( "Invalid instruction: ", name );
		}

		return new klass( id, options );
	}
}
