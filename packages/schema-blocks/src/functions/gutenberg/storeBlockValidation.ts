import { dispatch } from "@wordpress/data";
import { BlockValidationResult } from "../../core/validation";

/**
 * Updates the store with information about whether a block is valid or why it isn't.
 * @param validations The blocks' validation results.
 */
export default function storeBlockValidation( validations: BlockValidationResult[] ) {
	console.log( "Updating the store with the block's valid status." );

	validations.forEach( blockValidation => {
		console.log( blockValidation.clientId );

		dispatch( "yoast-seo/editor" ).setBlockIsValid( blockValidation.clientId, blockValidation.result );
	} );
}
