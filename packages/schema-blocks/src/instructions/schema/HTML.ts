import { SchemaValue } from "../../core/schema/SchemaDefinition";
import SchemaInstruction from "../../core/schema/SchemaInstruction";
import { stripTags } from "../../functions/html";
import { BlockInstance } from "@wordpress/blocks";

/**
 * HTML instruction.
 */
export default class HTML extends SchemaInstruction {
	public options: {
		name: string;
		default?: string;
		allowedTags?: string[];
	}

	/**
	 * Renders schema.
	 *
	 * @param block The block.
	 *
	 * @returns The schema.
	 */
	render( block: BlockInstance ): SchemaValue {
		const html = block.attributes[ this.options.name ] as string || this.options.default;

		if ( typeof html === "undefined" ) {
			return null;
		}

		return stripTags( html, this.options.allowedTags );
	}
}

SchemaInstruction.register( "html", HTML );
