import { camelCase } from "lodash";
import { Token } from "tokenizr";
import BlockDefinition from "../core/blocks/BlockDefinition";
import BlockInstruction from "../core/blocks/BlockInstruction";
import Definition, { DefinitionClass } from "../core/Definition";
import Instruction, {
	InstructionArray,
	InstructionValue,
	InstructionPrimitive,
	InstructionObject,
} from "../core/Instruction";
import SchemaDefinition from "../core/schema/SchemaDefinition";
import SchemaInstruction from "../core/schema/SchemaInstruction";
import logger from "./logger";
import { generateUniqueSeparator } from "./separator";
import tokenize from "./tokenize";

let nextId = 0;

/**
 * Generate the next instruction ID.
 * Skips any IDs that are in the separator.
 *
 * @param separator The separator string.
 *
 * @returns The generated ID.
 */
function generateNextId( separator: string ): number {
	do {
		nextId++;
	}
	while ( separator.includes( nextId.toString() ) );

	return nextId;
}

/**
 * Processes an array.
 *
 * @param tokens The tokens.
 *
 * @returns The array.
 */
function processArray( tokens: Token[] ): InstructionArray {
	const value: Array<InstructionValue> = [];

	// Consume the array-open token.
	tokens.shift();
	while ( ! tokens[ 0 ].isA( "array-close" ) ) {
		value.push( processToken( tokens[ 0 ], tokens ) );
	}
	// Consume the array-close token.
	tokens.shift();

	return value;
}

/**
 * Processes an object.
 *
 * @param tokens The tokens.
 *
 * @returns The object.
 */
function processObject( tokens: Token[] ): InstructionObject {
	const value: InstructionObject = {};

	// Consume the object-open token.
	tokens.shift();
	while ( ! tokens[ 0 ].isA( "object-close" ) ) {
		if ( ! tokens[ 0 ].isA( "key" ) ) {
			throw "Template parse error: Object must contain key-value pairs";
		}
		const objectKey = tokens.shift().value as string;

		value[ objectKey ] = processToken( tokens[ 0 ], tokens );
	}
	// Consume the object-close token.
	tokens.shift();

	return value;
}

/**
 * Processes a token from a list of tokens.
 *
 * @param {Token}   currentToken The current token.
 * @param {Token[]} tokens       The remaining tokens.
 *
 * @returns The value of the first token.
 */
function processToken( currentToken: Token, tokens: Token[] ): InstructionValue {
	if ( currentToken.isA( "array-open" ) ) {
		return processArray( tokens );
	}
	if ( currentToken.isA( "object-open" ) ) {
		return processObject( tokens );
	}
	if ( currentToken.isA( "empty-object" ) ) {
		tokens.shift();
		return {};
	}
	if ( currentToken.isA( "value" ) ) {
		return tokens.shift().value as InstructionPrimitive;
	}
	throw "Invalid token found.";
}

/**
 * Processes an instruction.
 *
 * @param token            The current token.
 * @param tokens           The remaining tokens.
 * @param instructionClass The instruction class.
 * @param separator        The generated separator.
 *
 * @returns The instruction.
 */
function processBlockInstruction( token: Token, tokens: Token[], instructionClass: typeof Instruction, separator: string ) {
	const defaultOptions = { name: token.value };
	const instruction = instructionClass.create( token.value, generateNextId( separator ), defaultOptions );

	if ( ! instruction ) {
		logger.error( "Could not instantiate instuctionClass " + instructionClass.name );
		return;
	}

	while ( tokens[ 0 ] && tokens[ 0 ].isA( "key" ) ) {
		const key = camelCase( ( tokens.shift() as Token ).value );
		instruction.options[ key ] = processToken( tokens[ 0 ], tokens );
	}

	return instruction;
}

/**
 * Transforms an array of tokens into a template SchemaDefinition.
 *
 * @param template The template to process.
 *
 * @return {SchemaDefinition} The template SchemaDefinition.
 */
function processSchema( template: string ): SchemaDefinition {
	return process( template, SchemaDefinition, SchemaInstruction );
}

/**
 * Transforms an array of tokens into a template BlockDefinition.
 *
 * @param template The template to process.
 *
 * @return {BlockDefinition} The template BlockDefinition.
 */
function processBlock( template: string ): BlockDefinition {
	return process( template, BlockDefinition, BlockInstruction );
}

/**
 * Transforms an array of tokens into a template BlockDefinition.
 *
 * @param template         The template to process.
 * @param definitionClass  The definition class.
 * @param instructionClass The instruction class.
 *
 * @return The template BlockDefinition.
 */
function process<T extends Definition>(
	template: string,
	definitionClass: DefinitionClass<T>,
	instructionClass: typeof Instruction,
): T {
	const tokens     = tokenize( template );
	const separator  = generateUniqueSeparator( template, definitionClass.separatorCharacters );
	const definition = new definitionClass( separator );

	while ( true ) {
		const token = tokens.shift();

		if ( ! token ) {
			break;
		}

		if ( token.isA( "constant" ) ) {
			definition.template += token.value;
			continue;
		}

		if ( token.isA( "definition" ) ) {
			const instruction = processBlockInstruction( token as Token, tokens, instructionClass, separator );
			definition.instructions[ instruction.id ] = instruction;
			if ( instruction.renderable() ) {
				definition.template += separator + instruction.id + separator;
			}
		}
	}

	return definitionClass.parser( definition );
}

export default process;
export { processSchema, processBlock };
