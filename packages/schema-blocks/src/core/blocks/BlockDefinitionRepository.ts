import BlockDefinition from "./BlockDefinition";

// Internal store of all known BlockDefinitions.
const registeredBlockDefinitions: Record<string, BlockDefinition> = {};

/**
 * Finds a registered BlockDefinition.
 *
 * @param name The Block to search for.
 * @returns {BlockDefinition} The found block.
 */
export function getBlockDefinition( name: string ): BlockDefinition {
	return registeredBlockDefinitions[ name ];
}

/**
 * Registers a BlockDefinition.
 *
 * @param name       The name of the Definition to register.
 * @param definition The Definition to register.
 */
export function registerBlockDefinition( name: string, definition: BlockDefinition ) {
	registeredBlockDefinitions[ name ] = definition;
}
