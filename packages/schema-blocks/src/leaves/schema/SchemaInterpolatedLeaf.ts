import { BlockInstance } from "@wordpress/blocks";

import SchemaLeaf from "../../core/schema/SchemaLeaf";
import SchemaInstruction from "../../core/schema/SchemaInstruction";

/**
 * SchemaInterpolatedLeaf class
 */
export default class SchemaInterpolatedLeaf extends SchemaLeaf {
	public values: Array<string | SchemaInstruction>;

	/**
     * Constructs a schema interpolated leaf.
     *
     * @param values The values.
     */
	public constructor( values: Array<string | SchemaInstruction> ) {
		super();
		this.values = values;
	}

	/**
	 * Renders a schema leaf.
	 *
	 * @param block The block.
	 *
	 * @returns The rendered schema.
	 */
	render( block: BlockInstance ): string {
		return this.values.map( value => {
			if ( typeof value === "string" ) {
				return value;
			}

			if ( ! value ) {
				// eslint-disable-next-line no-console
				console.log( "cannot render value ", value );
			}

			return value.render( block ) as string;
		} ).join( "" );
	}
}
