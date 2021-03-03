import { BlockValidation } from ".";

/**
 * Contains the result of a block validation.
 */
export class BlockValidationResult {
	/**
	 * The name of the validated block.
	 */
	public name: string;

	/**
	 * The clientId of the validated block.
	 */
	public clientId: string;

	/**
	 * The validation result;
	 */
	public result: BlockValidation;

	/**
	 * The validation issues for this block's innerblocks or attributes, if any.
	 */
	public issues: BlockValidationResult[]

	/**
	 * @param clientId The clientId of the validated block.
	 * @param name     The name of the validated block.
	 * @param result   The validation result.
	 */
	constructor( clientId: string, name: string, result: BlockValidation ) {
		this.name = name;
		this.clientId = clientId;
		this.result = result;
		this.issues = [];
	}
}
