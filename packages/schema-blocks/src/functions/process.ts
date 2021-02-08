import { camelCase } from "lodash";
import { IToken } from "tokenizr";
import BlockDefinition from "../core/blocks/BlockDefinition";
import BlockInstruction from "../core/blocks/BlockInstruction";
import Definition, { DefinitionClass } from "../core/Definition";
import Instruction, { InstructionArray, InstructionValue, InstructionPrimitive, InstructionObject } from "../core/Instruction";
import SchemaDefinition from "../core/schema/SchemaDefinition";
import SchemaInstruction from "../core/schema/SchemaInstruction";
import { generateUniqueSeparator } from "./separator";
import tokenize from "./tokenize";

let nextId = 0;

/**
 * Processes an array.
 *
 * @param tokens The tokens.
 *
 * @returns The array.
 */
function processArray( tokens: IToken[] ): InstructionArray {
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
function processObject( tokens: IToken[] ): InstructionObject {
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
 * @param {IToken}   currentToken The current token.
 * @param {IToken[]} tokens       The remaining tokens.
 *
 * @returns The value of the first token.
 */
function processToken( currentToken: IToken, tokens: IToken[] ): InstructionValue {
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
 *
 * @returns The instruction.
 */
function processBlockInstruction( token: IToken<string>, tokens: IToken[], instructionClass: typeof Instruction ) {
	const defaultOptions = { name: token.value };
	const instruction = instructionClass.create( token.value, nextId++, defaultOptions );

	while ( tokens[ 0 ] && tokens[ 0 ].isA( "key" ) ) {
		const key = camelCase( ( tokens.shift() as IToken<string> ).value );
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
			const instruction = processBlockInstruction( token as IToken<string>, tokens, instructionClass );
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
