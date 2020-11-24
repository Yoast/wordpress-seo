/**
 * Checks if an attribute exists.
 *
 * @param attributes The attributes on which to check if a specific attribute exists.
 * @param name The name of the attribute to check.
 *
 * @returns If an attribute with the given name exists.
 */
function attributeExists( attributes: Readonly<Record<string, unknown>>, name: string ): boolean {
	return Object.prototype.hasOwnProperty.call( attributes, name );
}

export default attributeExists;
