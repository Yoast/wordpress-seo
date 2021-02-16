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
		parentClientId = getParentId( clientId );
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

/**
 * Finds a block's parent Id.
 *
 * @param clientId The clientId whose immediate parent's Id is desired.
 * @returns {string} The parent Id.
 */
export function getParentId( clientId: string ): string {
	return select( "core/block-editor" ).getBlockRootClientId( clientId );
}

/**
 * Determines if the current block is nested inside a job posting.
 *
 * @param clientId The id of the block to find parents for.
 * @param parentNames The parent block names to look for.
 *
 * @returns {string} the clientId of the parent of the requested type, or null if no such parent was found.
 */
export function getParentIdOfType( clientId: string, parentNames: string[] ): string[] | null {
	return ( select( "core/block-editor" ) as unknown as extendedCoreBlockEditorSelector )
		.getBlockParentsByBlockName( clientId, parentNames );
}

/**
 * The method getBlockParentsByBlockName is included since WP5.4 but not available in the current typings for the selector.
 */
type extendedCoreBlockEditorSelector = {
	getBlockParentsByBlockName( clientId: string, parentNames: string[] ): string[];
}
