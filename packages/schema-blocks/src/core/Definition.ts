import { BlockValidation, BlockValidationResult } from "./validation";
import { BlockInstance } from "@wordpress/blocks";
import { isArray, maxBy, mergeWith } from "lodash";
import Instruction from "./Instruction";
import Leaf from "./Leaf";
import logger from "../functions/logger";

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
	customizer( existingConfig: string[], newConfig: string[] ): string[] {
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

	/**
	 * Checks if the Definition block is valid.
	 *
	 * @param blockInstance The block to be validated.
	 *
	 * @returns The validation result for the given block.
	 */
	validate( blockInstance: BlockInstance ): BlockValidationResult {
		if ( ! blockInstance ) {
			return null;
		}

		logger.startGroup( `Validation results: ${ blockInstance.name }` );

		const issues = Object.values( this.instructions ).map( instruction => {
			const issue = instruction.validate( blockInstance );
			logger.debug( `${ instruction.constructor.name } Instruction => ${ BlockValidation[ issue.result ] }` );
			return issue;
		} ).filter( issue => issue.result !== BlockValidation.Skipped );

		logger.endGroup();

		if ( issues.length < 1 ) {
			return BlockValidationResult.Valid( blockInstance, blockInstance.name );
		}

		const worstCase: BlockValidationResult = maxBy( issues, issue => issue.result );
		const validation = new BlockValidationResult( blockInstance.clientId, blockInstance.name, worstCase.result, worstCase.blockPresence );
		validation.issues = issues;

		return validation;
	}

	/**
	 * Registers a definition.
	 */
	abstract register(): void;
}

export type DefinitionClass<T extends Definition> = {
	new( separator: string, template?: string, instructions?: Record<string, Instruction>, tree?: Leaf ): T;
	separatorCharacters: string[];
	parser: ( definition: T ) => T;
};
