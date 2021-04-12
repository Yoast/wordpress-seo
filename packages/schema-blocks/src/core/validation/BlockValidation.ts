export enum BlockValidation {
	/** VALID RESULTS (100+): Schema can be output. */

	/** This block (AND all of its innerblocks) are fine. */
	Valid = 100,
	/** This block doesn't have any code that validates it, so we simply don't know if it's valid or not.  */
	Unknown = 101,
	/** This block was skipped during validation, on purpose. If you ever see this value, that's a bug.  */
	Skipped = 102,

	/** OK RESULTS (200+): Will give an orange bullet, but will not prevent Schema output.

	/** This block is not completely valid, but should not prevent the Schema to be output either. */
	OK = 200,
	/** This block has recommended attributes, but these attributes are missing or empty. */
	MissingRecommendedAttribute = 201,
	/** This block is defined to recommend a particular inner block, but that block doesn't exist. */
	MissingRecommendedBlock = 202,

	/** INVALID RESULTS (300+): Will prevent Schema output.

	/** This block (OR some of its innerblocks) have a problem. The particular problem must be specified in BlockValidationResult.issues */
	Invalid = 300,
	/** This block has required attributes, but these attributes are missing or empty. */
	MissingRequiredAttribute = 301,
	/** This block is defined to require a particular inner block, but that block doesn't exist. */
	MissingRequiredBlock = 302,
	/** There may be only one of this type of block, but we found more than one. */
	TooMany = 303,
}
