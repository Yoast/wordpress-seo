import { BlockValidation } from "../../core/validation";

/**
 * Determines if a specific validation result is essentially invalid or not.
 * 'Valid' means that Schema can be output, 'invalid' means that it should not be output.
 *
 * @param result The source value.
 *
 * @returns Whether the result is Valid or Invalid.
*/
export default function isValidResult( result: BlockValidation ): boolean {
	return result < 300;
}
