import { SchemaArray } from "../../core/schema/SchemaDefinition";
import SchemaInstruction from "../../core/schema/SchemaInstruction";
import { stripTags, splitOnTag } from "../../functions/html";
import { BlockInstance } from "@wordpress/blocks";

/**
 * SchemaInstruction class.
 */
export default class List extends SchemaInstruction {
	public options: {
		name: string;
		tag: string;
		allowedTags?: string[];
	}

	/**
	 * Renders schema.
	 *
	 * @param block The block.
	 *
	 * @returns The schema.
	 */
	render( block: BlockInstance ): SchemaArray {
		const html = block.attributes[ this.options.name ];
		if ( typeof html !== "string" ) {
			return [];
		}

		const values = splitOnTag( html, this.options.tag );
		return values.map( value => stripTags( value, this.options.allowedTags ) );
	}
}

SchemaInstruction.register( "list", List );
