import { BlockValidation } from "../../core/validation";

/**
 * Determines if a specific validation result is essentially invalid or not.
 *
 * @param result The source value.
 *
 * @returns {boolean} Whether the result is Valid or Invalid.
*/
export default function isValidResult( result: BlockValidation ): boolean {
	console.log( "isValid: ", result === BlockValidation.Valid || result === BlockValidation.Unknown );
	return result === BlockValidation.Valid || result === BlockValidation.Unknown;
}
