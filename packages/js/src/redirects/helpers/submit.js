import { dispatch } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { STORE_NAME } from "../constants";

/**
 * Handles the form submit.
 * @param {Object} values The values.
 * @param {function} resetForm Resets the form.
 * @returns {Promise<boolean>} Promise of save result.
 */
export const handleSubmit = async( values, { resetForm } ) => {
	const { addNotification } = dispatch( STORE_NAME );

	try {
		resetForm( { values } );
		return true;
	} catch ( error ) {
		addNotification( {
			id: "submit-error",
			variant: "error",
			title: __( "Oops! Something went wrong while saving.", "wordpress-seo" ),
		} );

		console.error( "Error while saving:", error.message );
		return false;
	}
};
