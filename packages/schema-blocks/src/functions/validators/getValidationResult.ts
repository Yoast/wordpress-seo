import { BlockValidationResult } from "../../core/validation";
import { select } from "@wordpress/data";
import { YOAST_SCHEMA_BLOCKS_STORE_NAME } from "../redux";

type clientIdValidation = Record<string, BlockValidationResult>;

/**
 * Gets the validation results from the store for a block instance with the given clientId.
 *
 * @param clientId The clientId to request validation results for.
 *
 * @returns {BlockValidationResult} The validation results, or null if none were found.
 */
export default function getValidationResult( clientId: string ): BlockValidationResult | null {
	const validationResults: clientIdValidation = select( YOAST_SCHEMA_BLOCKS_STORE_NAME ).getSchemaBlocksValidationResults();
	if ( ! validationResults ) {
		return null;
	}

	return validationResults[ clientId ];
}
