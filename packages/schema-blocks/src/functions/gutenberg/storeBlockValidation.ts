import { dispatch } from "@wordpress/data";
import { BlockValidationResult } from "../../core/validation";

/**
 * Updates the store with information about whether a block is valid or why it isn't.
 * @param validations The blocks' validation results.
 */
export default function storeBlockValidation( validations: BlockValidationResult[] ) {
	console.log( "Updating the store with the block's validation result." );

	validations.forEach( blockValidation => {
		console.log( blockValidation );

		dispatch( "yoast-seo/editor" ).setBlockValidation( blockValidation.clientId, blockValidation.result );
	} );
}
