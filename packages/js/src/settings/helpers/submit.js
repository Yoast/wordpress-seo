import { dispatch, select } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { forEach, get, isArray, isObject } from "lodash";
import { STORE_NAME } from "../constants";
import { submitUserSocialProfiles } from "./user-social-profiles";

/**
 * @param {Object} values The values.
 * @returns {Promise<void>} Promise of save result. Errors when failing.
 */
const submitSettings = async( values ) => {
	const { endpoint, nonce } = get( window, "wpseoScriptData", {} );
	const formData = new FormData();

	formData.set( "option_page", "wpseo_settings" );
	formData.set( "_wp_http_referer", "admin.php?page=wpseo_settings_saved" );
	formData.set( "action", "update" );
	formData.set( "_wpnonce", nonce );

	forEach( values, ( value, name ) => {
		if ( isObject( value ) ) {
			if ( name === "person_social_profiles" ) {
				// Ignore `person_social_profiles`, they need a different route.
				return;
			}
			forEach( value, ( nestedValue, nestedName ) => {
				if ( isArray( nestedValue ) ) {
					forEach( nestedValue, ( item, index ) => formData.set( `${ name }[${ nestedName }][${ index }]`, item ) );
					return;
				}
				formData.set( `${ name }[${ nestedName }]`, nestedValue );
			} );
			return;
		}
		formData.set( name, value );
	} );

	try {
		await fetch( endpoint, {
			method: "POST",
			body: new URLSearchParams( formData ),
		} );
	} catch ( error ) {
		throw new Error( error.message );
	}
};

/**
 * Handles the form submit.
 * @param {Object} values The values.
 * @param {function} resetForm Resets the form.
 * @returns {Promise<boolean>} Promise of save result.
 */
export const handleSubmit = async( values, { resetForm } ) => {
	const { addNotification } = dispatch( STORE_NAME );
	const { selectCanEditUser, selectPreference } = select( STORE_NAME );
	const { person_social_profiles: personSocialProfiles } = values;
	const { company_or_person_user_id: userId } = values.wpseo_titles;

	try {
		await Promise.all( [
			submitSettings( values ),
			selectCanEditUser( userId ) && submitUserSocialProfiles( userId, personSocialProfiles ),
		] );

		addNotification( {
			variant: "success",
			title: __( "Great! Your settings were saved successfully.", "wordpress-seo" ),
		} );

		// Make sure the dirty state is reset after successfully saving.
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
