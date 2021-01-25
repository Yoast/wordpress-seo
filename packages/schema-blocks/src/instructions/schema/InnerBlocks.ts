import { select } from "@wordpress/data";

import SchemaInstruction from "../../core/schema/SchemaInstruction";
import { schemaDefinitions, SchemaValue } from "../../core/schema/SchemaDefinition";
import { BlockInstance } from "@wordpress/blocks";

/**
 * InnerBlocks instruction
 */
class InnerBlocks extends SchemaInstruction {
	public options: {
		name: string;
		allowedBlocks?: string[];
		onlyFirst?: boolean;
	}

	/**
	 * Renders schema.
	 *
	 * @param block The block.
	 *
	 * @returns The schema.
	 */
	render( block: BlockInstance ): SchemaValue {
		let innerBlocks = select( "core/block-editor" ).getBlocksByClientId( block.clientId )[ 0 ].innerBlocks;

		if ( this.options.allowedBlocks ) {
			innerBlocks = innerBlocks.filter( innerBlock => this.options.allowedBlocks.includes( innerBlock.name ) );
		}

		if ( this.options.onlyFirst === true ) {
			innerBlocks = innerBlocks.slice( 0, 1 );
		}

		const rendered = innerBlocks.map( innerBlock => {
			const schemaDefinition = schemaDefinitions[ innerBlock.name ];

			if ( ! schemaDefinition ) {
				return null;
			}
			return schemaDefinition.render( innerBlock );
		} ).filter( schema => schema !== null );

		if ( this.options.onlyFirst === true ) {
			return rendered[ 0 ];
		}
		return rendered;
	}
}

SchemaInstruction.register( "inner-blocks", InnerBlocks );
