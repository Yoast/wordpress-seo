import { BlockInstance } from "@wordpress/blocks";
import { isEmpty } from "lodash";

/**
 * Validates that an attribute is not empty.
 *
 * @param blockInstance The blockInstance to check for a specific attribute.
 * @param name          The name of the attribute to check.
 *
 * @returns If the attribute is considered empty.
 */
function attributeNotEmpty( blockInstance: BlockInstance, name: string ): boolean {
	let value: unknown = blockInstance.attributes[ name ];

	if ( typeof value === "number" ) {
		return true;
	}

	if ( typeof value === "string" ) {
		/*
		 * Google trims the whitespace from any strings
		 * (source: Google's Rich Results test tool).
		 *
		 * Without trimming it here as well,
		 * values only containing whitespace would be incorrectly considered
		 * as valid.
		 */
		value = value.trim();
	}
	return ! isEmpty( value );
}

export default attributeNotEmpty;
