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
	 * The validation result;
	 */
	public result: BlockValidation;

	/**
	 *
	 * @param name   The name of the validated block.
	 * @param result The validation result.
	 */
	constructor( name: string, result: BlockValidation ) {
		this.name = name;
		this.result = result;
	}
}
