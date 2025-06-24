import { __ } from "@wordpress/i18n";
import { STORE_NAME } from "../constants";
import { dispatch } from "@wordpress/data";

/**
 * Handles the form submit.
 * @param {Object} values The values.
 * @param {function} resetForm Resets the form.
 * @returns {Promise<boolean>} Promise of save result.
 */
export const handleCreateSubmit = async( values, { resetForm, setStatus } ) => {
	const { addNotification, addRedirectAsync } = dispatch( STORE_NAME );
	try {
		await addRedirectAsync( values );
		addNotification( {
			variant: "success",
			title: __( "Successfully added!", "wordpress-seo" ),
		} );

		// Make sure the dirty state is reset after successfully saving.
		resetForm();
		return true;
	} catch ( error ) {
		const errMessage = error.message?.message || error.message || __( "Something went wrong", "wordpress-seo" );

		setStatus( errMessage );
		console.error( "Error while saving:", error.message );
		return false;
	}
};

/**
 * Handles the form submit.
 * @param {Object} values The values.
 * @param {function} resetForm Resets the form.
 * @returns {Promise<boolean>} Promise of save result.
 */
export const handleEditSubmit = async( values, { resetForm } ) => {
	const { addNotification, editRedirectAsync } = dispatch( STORE_NAME );
	try {
		await editRedirectAsync( values );
		addNotification( {
			variant: "success",
			title: __( "Changes save successfully!", "wordpress-seo" ),
		} );

		// Make sure the dirty state is reset after successfully saving.
		resetForm();
		return true;
	} catch ( error ) {
		const errMessage = error.message.message || error.message;
		addNotification( {
			id: "submit-error",
			variant: "error",
			title: `${ __( "Redirect not updated", "wordpress-seo" ) }: ${ errMessage }`,
		} );

		console.error( "Error while saving:", errMessage );
		return false;
	}
};

/**
 * Handles the form submit.
 * @param {Object} values The values.
 * @param {function} resetForm Resets the form.
 * @returns {Promise<boolean>} Promise of save result.
 */
export const handleSettingsUpdateSubmit = async( values, { resetForm } ) => {
	const { addNotification, editRedirectsSettingsAsync } = dispatch( STORE_NAME );

	try {
		await editRedirectsSettingsAsync( values );
		addNotification( {
			variant: "success",
			title: __( "Great! Your settings were saved succesfully!", "wordpress-seo" ),
		} );

		// Make sure the dirty state is reset after successfully saving.
		resetForm();
		return true;
	} catch ( error ) {
		const errMessage = error.message.message || error.message;
		addNotification( {
			id: "submit-error",
			variant: "error",
			title: `${ __( "Redirects settings not updated", "wordpress-seo" ) }: ${ errMessage }`,
		} );

		console.error( "Error while saving:", errMessage );
		return false;
	}
};

