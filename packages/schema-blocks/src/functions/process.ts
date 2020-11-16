import { camelCase } from "lodash";
import { IToken } from "tokenizr";

import Definition, { DefinitionClass } from "../core/Definition";
import Instruction, { InstructionArray, InstructionObject, InstructionValue, InstructionPrimitive } from "../core/Instruction";
import { generateUniqueSeparator } from "./separator";
import tokenize from "./tokenize";

let id = 0;

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
		value.push( processToken( tokens ) );
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

		value[ objectKey ] = processToken( tokens );
	}
	// Consume the object-close token.
	tokens.shift();

	return value;
}

/**
 * Processes a token from a list of tokens.
 *
 * @param tokens The remaining tokens.
 *
 * @returns The value of the first token.
 */
function processToken( tokens: IToken[] ): InstructionValue {
	if ( tokens[ 0 ].isA( "array-open" ) ) {
		return processArray( tokens );
	}
	if ( tokens[ 0 ].isA( "object-open" ) ) {
		return processObject( tokens );
	}
	if ( tokens[ 0 ].isA( "empty-object" ) ) {
		tokens.shift();
		return {};
	}
	if ( tokens[ 0 ].isA( "value" ) ) {
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
	const instruction = instructionClass.create( token.value, id++ );

	while ( tokens[ 0 ] && tokens[ 0 ].isA( "key" ) ) {
		const key = camelCase( ( tokens.shift() as IToken<string> ).value );
		instruction.options[ key ] = processToken( tokens );
	}

	return instruction;
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
export default function process<T extends Definition>(
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
