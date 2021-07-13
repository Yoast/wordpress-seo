import { SchemaArray } from "../../core/schema/SchemaDefinition";
import SchemaInstruction from "../../core/schema/SchemaInstruction";
import { BlockInstance } from "@wordpress/blocks";
import List from "./List";

/**
 * Recipe instructions.
 */
export default class RecipeInstructions extends List {
	/**
	 * Renders schema.
	 *
	 * @param block The block.
	 *
	 * @returns The schema.
	 */
	render( block: BlockInstance ): SchemaArray {
		const values = super.render( block );
		return values.map( instruction => {
			return {
				"@type": "HowToStep",
				text: instruction,
			};
		} );
	}
}

SchemaInstruction.register( "recipe-instructions", RecipeInstructions );
