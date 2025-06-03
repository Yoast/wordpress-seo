import { __ } from "@wordpress/i18n";
import { STORE_NAME } from "../constants";
import { dispatch } from "@wordpress/data";
/**
 * Handles the form submit.
 * @param {Object} values The values.
 * @param {function} resetForm Resets the form.
 * @returns {Promise<boolean>} Promise of save result.
 */
export const handleSubmit = async( values, { resetForm } ) => {
	const { addNotification, addRedirect } = dispatch( STORE_NAME );
	try {
		addRedirect( values );

		addNotification( {
			variant: "success",
			title: __( "Great! Your redirect has been successfully created.", "wordpress-seo" ),
		} );

		// Make sure the dirty state is reset after successfully saving.
		resetForm();
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
