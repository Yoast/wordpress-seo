import { dispatch } from "@wordpress/data";
import { BlockValidationResult } from "../../core/validation";
import logger from "../logger";
import { YOAST_SCHEMA_BLOCKS_STORE_NAME } from "../redux";

/**
 * Updates the store with information about whether a block is valid or why it isn't.
 * @param validations The blocks' validation results.
 */
export default function storeBlockValidation( validations: BlockValidationResult[] ) {
	if ( validations.length < 1 ) {
		return;
	}

	logger.debug( "Updating the store with the validation results." );

	const store = dispatch( YOAST_SCHEMA_BLOCKS_STORE_NAME );
	if ( store ) {
		store.resetBlockValidation();
		validations.forEach( blockValidation => {
			logger.debug( "storing validation: ", blockValidation );
			store.addBlockValidation( blockValidation );
		} );
	} else {
		logger.debug( "No Store!" );
	}
}
