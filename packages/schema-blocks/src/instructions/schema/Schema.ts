import { SchemaDefinitionConfiguration } from "../../core/schema/SchemaDefinition";
import SchemaInstruction from "../../core/schema/SchemaInstruction";

/**
 * SchemaInstruction class.
 */
export default class Schema extends SchemaInstruction {
	public options: {
		name: string;
		onlyNested?: boolean;
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
