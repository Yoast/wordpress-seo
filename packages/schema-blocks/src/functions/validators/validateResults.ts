import { BlockValidation } from "../../core/validation";

/**
 * Determines if a specific validation source is valid.
 *
 * @param source The source value.
 *
 * @returns Whether the source is valid.
*/
export function isValidResult( source: BlockValidation ): boolean {
	return source < 200;
}

/**
 * Determines if a specific validation indicates if something is missing.
 *
 * @param source The validation to check.
 *
 * @returns Wether the source indicates something is missing.
 */
export function isMissingResult( source: BlockValidation ): boolean {
	return [
		BlockValidation.MissingRecommendedAttribute,
		BlockValidation.MissingRecommendedBlock,
		BlockValidation.MissingRecommendedVariation,

		BlockValidation.MissingRequiredAttribute,
		BlockValidation.MissingRequiredBlock,
		BlockValidation.MissingRequiredVariation,
	].includes( source );
}

/**
 * Determines if the source should lead to Schema output.
 *
 * @param source The source value.
 *
 * @returns Whether the source should lead to Schema output.
 */
export function isResultValidForSchema( source: BlockValidation ): boolean {
	return source < 300;
}

/**
 * Determines if the source is OK (in other words, would lead to an orange bullet).
 *
 * @param source The source value.
 *
 * @returns Whether the source is OK.
 */
export function isOkResult( source: BlockValidation ): boolean {
	return source >= 200 && source < 300;
}

/**
 * Determines if the source is invalid.
 *
 * @param source The source value.
 *
 * @returns Whether the source is invalid.
 */
export function isInvalidResult( source: BlockValidation ): boolean {
	return source >= 300;
}
