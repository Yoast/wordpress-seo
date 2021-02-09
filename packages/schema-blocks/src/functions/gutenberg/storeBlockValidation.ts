import { dispatch } from "@wordpress/data";
import { BlockValidationResult } from "../../core/validation";
import logger from "../logger";

/**
 * Updates the store with information about whether a block is valid or why it isn't.
 * @param validations The blocks' validation results.
 */
export default function storeBlockValidation( validations: BlockValidationResult[] ) {
	if ( validations.length < 1 ) {
		return;
	}

	logger.debug( "Updating the store with the validation results." );

	const store = dispatch( "yoast-seo/editor" );
	store.resetBlockValidation();
	validations.forEach( blockValidation => {
		logger.debug( "storing validation: ", blockValidation );
		store.addBlockValidation( blockValidation );
	} );
}
