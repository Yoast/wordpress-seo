import { BlockInstance } from "@wordpress/blocks";

/**
 * Checks if an attribute exists.
 *
 * @param blockInstance The blockInstance to check for a specific attribute.
 * @param name          The name of the attribute to check.
 *
 * @returns If an attribute with the given name exists.
 */
function attributeExists( blockInstance: BlockInstance, name: string ): boolean {
	return Object.prototype.hasOwnProperty.call( blockInstance.attributes, name );
}

export default attributeExists;
