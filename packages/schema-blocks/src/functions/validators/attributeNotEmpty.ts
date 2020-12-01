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
	return ! isEmpty( blockInstance.attributes[ name ] as object );
}

export default attributeNotEmpty;
