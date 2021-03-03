import { select } from "@wordpress/data";

import SchemaInstruction from "../../core/schema/SchemaInstruction";
import { schemaDefinitions, SchemaValue } from "../../core/schema/SchemaDefinition";
import { BlockInstance } from "@wordpress/blocks";

/**
 * InnerBlocks instruction.
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
		// Get all the inner blocks.
		let innerBlocks = select( "core/block-editor" ).getBlocksByClientId( block.clientId )[ 0 ].innerBlocks;

		// Empty array to which we will push all the inner blocks that have a Schema definition.
		const innerBlocksWithDefinitions: BlockInstance[] = [];

		/**
		 * Checks if an inner block has a Schema definition.
		 * If so, it is added to the innerBlocksWithDefinitions array.
		 * If not, its inner blocks are searched for a Schema definition (and consequently added to the array).
		 *
		 * @param innerBlock The inner block that is searched for a schema definition.
		 */
		const getInnerBlocksWithSchemaDefinition = ( innerBlock: BlockInstance ) => {
			if ( schemaDefinitions[ innerBlock.name ] ) {
				innerBlocksWithDefinitions.push( innerBlock );
			} else {
				innerBlock.innerBlocks.forEach( ( nestedInnerBlock ) => {
					getInnerBlocksWithSchemaDefinition( nestedInnerBlock );
				} );
			}
		};

		// Loop through the inner blocks to check if they have a Schema definition.
		innerBlocks.forEach( ( innerBlock ) => {
			getInnerBlocksWithSchemaDefinition( innerBlock );
		} );

		// All the inner blocks now have a definition.
		innerBlocks = innerBlocksWithDefinitions;

		// Only keep the inner blocks that have been specified in the template.
		if ( this.options.allowedBlocks ) {
			innerBlocks = innerBlocks.filter( innerBlock => this.options.allowedBlocks.includes( innerBlock.name ) );
		}

		// If this was specified in the template, only keep the first of the allowed inner blocks.
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
