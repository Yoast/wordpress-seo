import SchemaInstruction from "../../core/schema/SchemaInstruction";
import { SchemaValue } from "../../core/schema/SchemaDefinition";
import { stripTags } from "../../functions/html";
import { getInnerBlocksAttributes } from "../../functions/blocks";
import { BlockInstance } from "@wordpress/blocks";

/**
 * InnerBlocksHTML instruction.
 */
class InnerBlocksHTML extends SchemaInstruction {
	public options: {
		blocks?: Record<string, string>;
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
		let values = getInnerBlocksAttributes( block.clientId, this.options.blocks );

		if ( this.options.onlyFirst === true ) {
			values = values.slice( 0, 1 );
		} else if ( this.options.skipFirst === true ) {
			values = values.slice( 1 );
		}

		if ( values.length === 0 && this.options.nullWhenEmpty ) {
			return null;
		}

		const html = values.map( ( { value } ) => value ).join( this.options.split || " " );

		return stripTags( html, this.options.allowedTags );
	}
}

SchemaInstruction.register( "inner-blocks-html", InnerBlocksHTML );
