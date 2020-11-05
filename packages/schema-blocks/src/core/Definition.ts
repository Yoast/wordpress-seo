import { merge } from "lodash";
import Instruction from "./Instruction";
import Leaf from "./Leaf";

export type DefinitionClass<T extends Definition> = {
	new( separator: string, template?: string, instructions?: Record<string, Instruction>, tree?: Leaf ): T;
	separatorCharacters: string[];
	parser: ( definition: T ) => T;
};

/**
 * Definition clas
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
	 * @param attributes: The attributes object from RenderSaveProps or RenderEditProps
	 * @returns {boolean} True if the instruction block is valid, False if the block contains errors.
	 */
	valid( attributes: object ): boolean {
		return true;
	}

	/**
	 * Registers a definition.
	 */
	abstract register(): void;
}
