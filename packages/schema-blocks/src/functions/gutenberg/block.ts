import { select } from "@wordpress/data";
import { BlockInstance } from "@wordpress/blocks";

/**
 * Returns a normalized block ID.
 *
 * @param block The block.
 *
 * @returns A normalized block ID.
 */
export function getBlockId( block: BlockInstance ): string {
	const parts = [ block.name.replace( /\//g, "-" ) ];
	let clientId = block.clientId;
	let parentClientId: string;

	do {
		parentClientId = select( "core/block-editor" ).getBlockRootClientId( clientId );
		const number   = select( "core/block-editor" ).getBlockIndex( clientId, parentClientId );
		parts.push( number.toString() );
		clientId = parentClientId;
	} while ( parentClientId !== "" );

	return parts.join( "-" );
}

/**
 * Returns a fully qualified schema ID for a block.
 *
 * @param block The block.
 *
 * @returns A fully qualified schema ID.
 */
export function getBlockSchemaId( block: BlockInstance ): string {
	return select( "core/editor" ).getPermalink() + "#/schema/" +  getBlockId( block );
}
