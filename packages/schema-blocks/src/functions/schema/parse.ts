import { mapValues } from "lodash";

import SchemaDefinition, { SchemaValue } from "../../core/schema/SchemaDefinition";
import SchemaLeaf from "../../core/schema/SchemaLeaf";
import SchemaObjectLeaf from "../../leaves/schema/SchemaObjectLeaf";
import SchemaArrayLeaf from "../../leaves/schema/SchemaArrayLeaf";
import SchemaInstructionLeaf from "../../leaves/schema/SchemaInstructionLeaf";
import SchemaConstantLeaf from "../../leaves/schema/SchemaConstantLeaf";
import SchemaInterpolatedLeaf from "../../leaves/schema/SchemaInterpolatedLeaf";

/**
 * Parses a JSON value.
 *
 * @param value The value being parsed.
 * @param definition The definition being parsed.
 *
 * @returns The parsed leaf.
 */
function parseValue( value: SchemaValue, definition: SchemaDefinition ): SchemaLeaf {
	if ( Array.isArray( value ) ) {
		const parsedArray = value.map( arrayValue => parseValue( arrayValue, definition ) );
		return new SchemaArrayLeaf( parsedArray );
	}

	if ( typeof value === "object" ) {
		const parsedObject = mapValues( value, objectValue => parseValue( objectValue, definition ) );
		return new SchemaObjectLeaf( parsedObject );
	}

	if ( typeof value === "number" ) {
		const string = value.toString();
		if ( string.startsWith( definition.separator ) && string.endsWith( definition.separator ) ) {
			const instructionId = string.slice( definition.separator.length, -definition.separator.length );
			return new SchemaInstructionLeaf( definition.instructions[ instructionId ] );
		}
		return new SchemaConstantLeaf( value );
	}

	if ( typeof value === "string" ) {
		if ( value.indexOf( definition.separator ) === -1 ) {
			return new SchemaConstantLeaf( value );
		}

		const parts = value.split( definition.separator );
		const parsedParts = parts
			.map( ( partValue, i ) => ( i % 2 ) ?  definition.instructions[ partValue ] : partValue )
			.filter( partValue => partValue !== "" );

		return new SchemaInterpolatedLeaf( parsedParts );
	}

	return new SchemaConstantLeaf( value );
}

/**
 * Parses a schema definition.
 *
 * @param definition The schema definition being parsed.
 *
 * @returns The parsed schema definition.
 */
export default function parse( definition: SchemaDefinition ): SchemaDefinition {
	const value = JSON.parse( definition.template );
	definition.tree = parseValue( value, definition );

	return definition;
}
