import { BlockInstance } from "@wordpress/blocks";
import { merge } from "lodash";
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

	/* eslint-disable @typescript-eslint/no-unused-vars */
	/**
	 * Checks if the Definition block is valid.
	 *
	 * @param blockInstance The block to be validated.
	 *
	 * @returns {boolean} True if all instructions in the block are valid, false if any of the block instructions contains errors.
	 */
	valid( blockInstance: BlockInstance ): boolean {
		return Object.values( this.instructions ).every( instruction => instruction.valid( blockInstance ) && blockInstance.attributes.req );
	}
	/* eslint-enable @typescript-eslint/no-unused-vars */

	/**
	 * Registers a definition.
	 */
	abstract register(): void;
}
