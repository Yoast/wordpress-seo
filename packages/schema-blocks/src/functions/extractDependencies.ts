import Schema from "../instructions/schema/Schema";
import InnerBlocks from "../instructions/schema/InnerBlocks";
import SchemaDefinition from "../core/schema/SchemaDefinition";
import { BlockPresence } from "../core/validation";
import { InnerBlocksHTML } from "../instructions/schema/InnerBlocksHTML";
import SchemaInstruction from "../core/schema/SchemaInstruction";
import logger from "./logger";

/**
 * A dependency.
 */
interface Dependency {
	requiredFor: string[];
	recommendedFor: string[];
}

/**
 * Dependency map.
 */
export class DependencyMap {
	public map: Record<string, Dependency>

	/**
	 * Creates a new dependency map.
	 */
	constructor() {
		this.map = {};
	}

	/**
	 * Initialize an item in the dependency map.
	 *
	 * @param dependency The dependency.
	 * @private
	 */
	private initializeItem( dependency: string ) {
		this.map[ dependency ] = {
			requiredFor: [],
			recommendedFor: [],
		};
	}

	/**
	 * Add a dependency.
	 *
	 * E.g. `name` is `presence` (required/recommended) for `definitionName`.
	 *
	 * @param dependency The name of the dependency.
	 * @param presence Whether the dependency is required/recommended or optional.
	 * @param dependent The name of the dependent.
	 */
	public add( dependency: string, presence: BlockPresence, dependent: string ) {
		if ( ! this.map[ dependency ] ) {
			this.initializeItem( dependency );
		}

		switch ( presence ) {
			case BlockPresence.Required: {
				this.map[ dependency ].requiredFor.push( dependent );
				break;
			}
			case BlockPresence.Recommended: {
				this.map[ dependency ].recommendedFor.push( dependent );
				break;
			}
		}
	}
}

/**
 * Get the name of the Schema definition, e.g. 'yoast/job-posting'.
 *
 * @param definition The Schema definition.
 *
 * @returns The definition name.
 */
function getDefinitionName( definition: SchemaDefinition ) {
	const instructions = Object.values( definition.instructions );
	const schemaInstruction = instructions.find( instruction => instruction instanceof Schema );
	return schemaInstruction.options.name;
}

/**
 * Get all inner blocks Schema instructions.
 *
 * @param instructions The Schema instructions.
 *
 * @returns The inner blocks instructions.
 */
function getInnerBlocksInstructions( instructions: SchemaInstruction[] ): InnerBlocks[] {
	return instructions.filter( instruction => instruction instanceof InnerBlocks );
}

/**
 * Get all inner blocks HTML Schema instructions.
 *
 * @param instructions The Schema instructions.
 *
 * @returns The inner blocks HTML instructions.
 */
function getInnerBlocksHTMLInstructions( instructions: SchemaInstruction[] ): InnerBlocksHTML[] {
	return instructions.filter( instruction => instruction instanceof InnerBlocksHTML );
}

/**
 * Adds the dependencies to the dependency map.
 *
 * @param dependents The dependents.
 * @param presence The presence.
 * @param dependency The dependency.
 * @param dependencyMap The dependency map.
 */
function addDependencies( dependents: string[], presence: BlockPresence, dependency: string, dependencyMap: DependencyMap ) {
	dependents.forEach( name => {
		logger.debug( `${ name } is ${ presence } for ${ dependency }` );
		dependencyMap.add( name, presence, dependency );
	} );
}

/**
 * Extract the interdependencies between the given Schema Definition and other Schema Definitions.
 *
 * E.g. Which Schema Definition is required or recommended for which other Schema Definition?
 *
 * @param definition The Schema Definition
 * @param dependencyMap The current dependency map
 */
export default function extractDependencies( definition: SchemaDefinition, dependencyMap: DependencyMap ) {
	const instructions = Object.values( definition.instructions );
	const definitionName = getDefinitionName( definition );

	const innerBlocksInstructions = getInnerBlocksInstructions( instructions );

	innerBlocksInstructions.forEach( instruction => {
		const { allowedBlocks, presence } = instruction.options;

		if ( presence ) {
			addDependencies( allowedBlocks, presence, definitionName, dependencyMap );
		}
	} );

	const innerBlocksHTMLInstructions = getInnerBlocksHTMLInstructions( instructions );

	innerBlocksHTMLInstructions.forEach( instruction => {
		const { blocks, presence } = instruction.options;
		const allowedBlocks = Object.keys( blocks );

		if ( presence ) {
			addDependencies( allowedBlocks, presence, definitionName, dependencyMap );
		}
	} );
}
