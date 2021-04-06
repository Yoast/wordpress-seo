import { BlockValidation, BlockValidationResult } from "../../core/validation";
import { isResultValidForSchema } from "./validateResults";

/**
 * Analyzes many validations to draw a single conclusion.
 *
 * @param validation The BlockValidationResult whose issues should determine the outcome.
 *
 * @returns {BlockValidationResult} The result of the validation.
 */
function validateMany( validation: BlockValidationResult ): BlockValidationResult {
	validation.result = validation.issues.some( issue =>
		! isResultValidForSchema( issue.result ) )
		? BlockValidation.Invalid
		: BlockValidation.Valid;
	return validation;
}

export default validateMany;
