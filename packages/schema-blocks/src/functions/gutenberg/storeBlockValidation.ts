import { dispatch } from "@wordpress/data";
import { BlockValidationResult } from "../../core/validation";

/**
 * Updates the store with information about whether a block is valid or why it isn't.
 * @param validations The blocks' validation results.
 */
export default function storeBlockValidation( validations: BlockValidationResult[] ) {
	// eslint-disable-next-line no-console
	console.log( "Updating the store with the validation results." );

	validations.forEach( blockValidation => {
		// eslint-disable-next-line no-console
		console.log( blockValidation );

		dispatch( "yoast-seo/editor" ).setBlockValidation( blockValidation.clientId, blockValidation.result );
	} );
}
