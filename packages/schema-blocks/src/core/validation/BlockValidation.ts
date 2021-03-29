export enum BlockValidation {
	/** This block was skipped during validation, on purpose. If you ever see this value, that's a bug.  */
	Skipped = -2,
	/** This block doesn't have any code that validates it, so we simply don't know if it's valid or not.  */
	Unknown = -1,
	/** This block (AND all of its innerblocks) are fine. */
	Valid = 0,
	/** This block (OR some of its innerblocks) have a problem. The particular problem must be specified in BlockValidationResult.issues */
	Invalid = 1,
	/** This block has required attributes, but these attributes are missing or empty. */
	MissingAttribute = 2,
	/** This schema block is defined to require a particular inner block, but that block doesn't exist. */
	MissingBlock = 3,
	/** There may be only one of this type of block, but we found more than one. */
	TooMany = 4,
}
