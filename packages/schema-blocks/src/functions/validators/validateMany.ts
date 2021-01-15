import { BlockValidation, BlockValidationResult } from "../../core/validation";

/**
 * Analyzes many validations to draw a single conclusion.
 *
 * @param validation The BlockValidationResult whose issues should determine the outcome.
 * @param results    The name of the attribute to check.
 *
 * @returns {BlockValidationResult} The result of the validation.
 */
function validateMany( validation: BlockValidationResult ): BlockValidationResult {
	validation.result = validation.issues.some( issue =>
		issue.result !== BlockValidation.Unknown &&
        issue.result !== BlockValidation.Valid )
		? BlockValidation.Invalid
		: BlockValidation.Valid;
	return validation;
}

export default validateMany;
