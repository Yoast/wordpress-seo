import { SchemaDefinitionConfiguration } from "../../core/schema/SchemaDefinition";
import SchemaInstruction from "../../core/schema/SchemaInstruction";

/**
 * Schema instruction.
 */
export default class Schema extends SchemaInstruction {
	public options: {
		name: string;
		onlyNested?: boolean;
		requiredFor?: string[];
		recommendedFor?: string[];
		optionalFor?: string[];
	}

	/**
	 * Returns the schema definition configuration.
	 *
	 * @returns The configuration.
	 */
	configuration(): Partial<SchemaDefinitionConfiguration> {
		return this.options;
	}

	/**
	 * Returns whether or not this instruction should be included in the tree.
	 *
	 * @returns Whether or not to render this instruction.
	 */
	renderable(): boolean {
		return false;
	}
}

SchemaInstruction.register( "schema", Schema );
