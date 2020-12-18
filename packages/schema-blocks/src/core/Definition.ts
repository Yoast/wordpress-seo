import { merge, flatMap } from "lodash";
import { BlockInstance } from "@wordpress/blocks";
import { BlockValidationResult } from "./validation";
import Instruction from "./Instruction";
import Leaf from "./Leaf";

export type DefinitionClass<T extends Definition> = {
	new( separator: string, template?: string, instructions?: Record<string, Instruction>, tree?: Leaf ): T;
	separatorCharacters: string[];
	parser: ( definition: T ) => T;
};

/**
 * Definition class.
 */
export default abstract class Definition {
	public separator: string;
	public template: string;
	public instructions: Record<string, Instruction>;
	public tree: Leaf;

	/**
	 * Creates a block BlockDefinition.
	 *
	 * @param separator    The separator used.
	 * @param template     The template.
	 * @param instructions The parsed instructions.
	 * @param tree         The parsed leaves.
	 */
	constructor(
		separator: string,
		template = "",
		instructions: Record<string, Instruction> = {},
		tree: Leaf = null,
	) {
		this.separator = separator;
		this.template = template;
		this.instructions = instructions;
		this.tree = tree;
	}

	/**
	 * Returns the configuration of this BlockDefinition.
	 *
	 * @returns The configuration.
	 */
	configuration(): Record<string, unknown> {
		return Object.values( this.instructions ).reduce( ( config, instruction ) => merge( config, instruction.configuration() ), {} );
	}

	/**
	 * Checks if the Definition block is valid.
	 *
	 * @param blockInstance The block to be validated.
	 *
	 * @returns {boolean} True if all instructions in the block are valid, false if any of the block instructions contains errors.
	 */
	validate( blockInstance: BlockInstance ): BlockValidationResult[] {
		// Could contain duplicates.
		return flatMap( Object.values( this.instructions ), instruction => instruction.validate( blockInstance ) );
	}

	/**
	 * Registers a definition.
	 */
	abstract register(): void;
}
