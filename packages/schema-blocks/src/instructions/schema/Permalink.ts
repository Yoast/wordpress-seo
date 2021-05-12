import { select } from "@wordpress/data";

import SchemaInstruction from "../../core/schema/SchemaInstruction";

/**
 * Permalink instruction.
 */
class Permalink extends SchemaInstruction {
	/**
	 * Renders schema.
	 *
	 * @returns The schema.
	 */
	render(): string {
		return select( "core/editor" ).getPermalink();
	}
}

SchemaInstruction.register( "permalink", Permalink );
