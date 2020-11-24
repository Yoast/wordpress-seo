import { isEmpty } from "lodash";

/**
 * Validates that an attribute is not empty.
 *
 * @param attributes The attributes.
 * @param name The name of the attribute to check.
 *
 * @returns If the attribute is considered empty.
 */
function attributeNotEmpty( attributes: Readonly<Record<string, unknown>>, name: string ): boolean {
	return ! isEmpty( attributes[ name ] as object );
}

export default attributeNotEmpty;
