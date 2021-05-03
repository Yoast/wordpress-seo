import { BlockInstance } from "@wordpress/blocks";
import { isEmpty } from "lodash";
import { stripAllTags } from "../html";

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
		 * Strip all HTML tags from the string, so a value containing only empty
		 * or replaced elements is considered empty.
		 */
		value = stripAllTags( value );
		/*
		 * Google trims the whitespace from any strings
		 * (source: Google's Rich Results test tool).
		 *
		 * Without trimming it here as well, values only containing whitespace
		 * would be incorrectly considered as valid.
		 */
		value = ( value as string ).trim();
	}
	return ! isEmpty( value );
}

export default attributeNotEmpty;
