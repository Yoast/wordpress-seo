import { merge } from "lodash";
import { BlockInstance } from "@wordpress/blocks";
import { BlockValidation, BlockValidationResult } from "./validation";
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
	 * @returns {BlockValidationResult | null} The result of validation the given block.
	 */
	validate( blockInstance: BlockInstance ): BlockValidationResult {
		if ( ! blockInstance ) {
			return null;
		}

		const validation = new BlockValidationResult( blockInstance.clientId, blockInstance.name, BlockValidation.Unknown );

		validation.issues = Object.values( this.instructions ).map( instruction => {
			const issue = instruction.validate( blockInstance );
			// eslint-disable-next-line no-console
			console.log( "validating " + instruction.options.name + " against " + blockInstance.name + " => " + BlockValidation[ issue.result ] );
			return issue;
		} ).filter( issue => issue.result !== BlockValidation.Skipped );

		// In case of a block with just one innerblock, this prevents a duplicate, identical wrapper.
		if ( validation.issues.length === 1 ) {
			return validation.issues[ 0 ];
		}

		return validation;
	}

	/**
	 * Registers a definition.
	 */
	abstract register(): void;
}
