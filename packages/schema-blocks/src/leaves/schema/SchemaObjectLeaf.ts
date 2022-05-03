import { mapValues } from "lodash";
import { BlockInstance } from "@wordpress/blocks";

import SchemaLeaf from "../../core/schema/SchemaLeaf";
import { SchemaObject } from "../../core/schema/SchemaDefinition";

/**
 * SchemaObjectLeaf class
 */
export default class SchemaObjectLeaf extends SchemaLeaf {
	public object: Record<string, SchemaLeaf>;

	/**
     * Constructs a schema object leaf.
     *
     * @param object The object.
     */
	public constructor( object: Record<string, SchemaLeaf> ) {
		super();
		this.object = object;
	}

	/**
	 * Renders a schema leaf.
	 *
	 * @param block The block.
	 *
	 * @returns The rendered schema.
	 */
	render( block: BlockInstance ): SchemaObject {
		const object = mapValues( this.object, leaf => leaf.render( block ) );

		for ( const [ key, value ] of Object.entries( object ) ) {
			if ( value === null || typeof value === "undefined" ) {
				delete object[ key ];
			}
		}

		return object;
	}
}
