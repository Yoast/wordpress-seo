import { BlockInstance } from "@wordpress/blocks";
import { isArray, mergeWith } from "lodash";
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
	 * Customizes the way in which a merge is performed.
	 * Concatenates arrays rather than having the first array be overwritten by a second.
	 *
	 * @see https://lodash.com/docs/4.17.15#mergeWith
	 *
	 * @param existingConfig The configuration that should be appended to.
	 * @param newConfig      The configuration to append to the existing configuration.
	 *
	 * @returns array The appended configurations.
	 */
	customizer( existingConfig: string[], newConfig: string[] ) {
		if ( isArray( existingConfig ) ) {
			return existingConfig.concat( newConfig );
		}
	}

	/**
	 * Returns the configuration of this BlockDefinition.
	 * Applying the customizer makes sure that the configurations of multiple instructions are concatenated rather than overwritten.
	 *
	 * @returns The configuration.
	 */
	configuration(): Record<string, unknown> {
		return Object.values( this.instructions ).reduce( ( config, instruction ) =>
			mergeWith( config, instruction.configuration(), this.customizer ), {} );
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
		return Object.values( this.instructions ).every( instruction => instruction.valid( blockInstance ) );
	}
	/* eslint-enable @typescript-eslint/no-unused-vars */

	/**
	 * Registers a definition.
	 */
	abstract register(): void;
}
