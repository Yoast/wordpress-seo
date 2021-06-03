import { SchemaDefinition } from "../../core/schema";
import { BlockPresence } from "../../core/validation";

/**
 * Finds all blocks in a Schema Root that match the requested BlockPresence.
 *
 * @param root The Root to investigate.
 * @param presence The required presence.
 *
 * @returns an array of block names that have the requested BlockPresence in the schema root.
 */
export function getBlocksForPresence( root: SchemaDefinition, presence: BlockPresence ) : string[] {
	const instructions = Object.values( root.instructions );
	return instructions.filter( x => x.configuration().presence === presence ).map( x=> x.configuration().name );
}
