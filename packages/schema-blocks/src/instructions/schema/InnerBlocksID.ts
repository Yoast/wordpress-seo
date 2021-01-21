import SchemaInstruction from "../../core/schema/SchemaInstruction";
import { SchemaValue } from "../../core/schema/SchemaDefinition";
import { BlockInstance } from "@wordpress/blocks";
import { select } from "@wordpress/data";
import { getBlockSchemaId } from "../../functions/gutenberg/block";

/**
 * InnerBlocksID instruction.
 */
class InnerBlocksID extends SchemaInstruction {
	public options: {
		allowedBlocks?: string[];
		allowedTags?: string[];
		onlyFirst?: boolean;
		skipFirst?: boolean;
		split?: string;
		nullWhenEmpty?: boolean;
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
		} else if ( this.options.skipFirst === true ) {
			innerBlocks = innerBlocks.slice( 1 );
		}

		if ( innerBlocks.length === 0 && this.options.nullWhenEmpty ) {
			return null;
		}

		const ids = innerBlocks.map( innerBlock => ( { "@id": getBlockSchemaId( innerBlock ) } ) );

		if ( ids.length === 1 ) {
			return ids[ 0 ];
		}

		return ids;
	}
}

SchemaInstruction.register( "inner-blocks-id", InnerBlocksID );
