import SchemaInstruction from "../core/schema/SchemaInstruction";
import Schema from "../instructions/schema/Schema";
import InnerBlocks from "../instructions/schema/InnerBlocks";
import SchemaDefinition from "../core/schema/SchemaDefinition";
import logger from "./logger";

/**
 * Get the name of the Schema definition, e.g. 'yoast/job-posting'.
 *
 * @param instructions The Schema instructions of the definition.
 *
 * @returns The definition name.
 */
function getDefinitionName( instructions: SchemaInstruction[] ) {
	const schemaInstruction = instructions.find( instruction => instruction instanceof Schema );
	return schemaInstruction.options.name;
}

/**
 * Extract the interdependencies between the given Schema Definition and other Schema Definitions.
 *
 * E.g. Which Schema Definition is required or recommended for which other Schema Definition?
 *
 * @param definition The Schema Definition
 */
export default function extractDependencies( definition: SchemaDefinition ) {
	const instructions = Object.values( definition.instructions );
	const definitionName = getDefinitionName( instructions );
	const innerBlocksInstructions: InnerBlocks[] = instructions.filter( instruction => instruction instanceof InnerBlocks );

	innerBlocksInstructions.forEach( instruction => {
		const { allowedBlocks, presence } = instruction.options;

		if ( presence ) {
			allowedBlocks.forEach( name => logger.debug( `${ name } is ${ presence } for ${ definitionName }` ) );
		}
	} );
}
