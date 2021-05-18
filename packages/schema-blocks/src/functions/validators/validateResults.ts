import { BlockValidation } from "../../core/validation";

/**
 * Determines if a specific validation result is valid.
 *
 * @param result The source value.
 *
 * @returns Whether the result is valid.
*/
function isValidResult( result: BlockValidation ): boolean {
	return result < 200;
}

/**
 * Determines if the result should lead to Schema output.
 *
 * @param result The source value.
 *
 * @returns Whether the result should lead to Schema output.
 */
function isResultValidForSchema( result: BlockValidation ): boolean {
	return result < 300;
}

/**
 * Determines if the result is OK (in other words, would lead to an orange bullet).
 *
 * @param result The source value.
 *
 * @returns Whether the result is OK.
 */
function isOkResult( result: BlockValidation ): boolean {
	return result >= 200 && result < 300;
}

/**
 * Determines if the result is invalid.
 *
 * @param result The source value.
 *
 * @returns Whether the result is invalid.
 */
function isInvalidResult( result: BlockValidation ): boolean {
	return result >= 300;
}

export { isValidResult, isResultValidForSchema, isOkResult, isInvalidResult };
