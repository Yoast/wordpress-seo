import { dispatch, select } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { forEach, get, includes, isArray, isNumber, isObject, omit } from "lodash";
import { STORE_NAME } from "../constants";
import { submitUserSocialProfiles } from "./user-social-profiles";

/**
 * @param {Object} values The values.
 * @returns {Promise<void>} Promise of save result. Errors when failing.
 */
const submitSettings = async( values ) => {
	const { endpoint, nonce } = get( window, "wpseoScriptData", {} );
	const formData = new FormData();

	formData.set( "option_page", "wpseo_page_settings" );
	formData.set( "_wp_http_referer", "admin.php?page=wpseo_page_settings_saved" );
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
		const response = await fetch( endpoint, {
			method: "POST",
			body: new URLSearchParams( formData ),
		} );
		const responseText = await response.text();

		if ( includes( responseText, "{{ yoast-success: false }}" ) ) {
			throw new Error( "Yoast options invalid." );
		}
		if ( ! response.url.endsWith( "settings-updated=true" ) ) {
			throw new Error( "WordPress options save did not get to the end." );
		}
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
	const canManageOptions = selectPreference( "canManageOptions", false );
	const { person_social_profiles: personSocialProfiles } = values;
	const { company_or_person_user_id: userId } = values.wpseo_titles;
	const canSaveUserProfiles = selectCanEditUser( userId ) && isNumber( userId ) && userId > 0;

	try {
		await Promise.all( [
			// Ensure we do not save WP options when the user is not allowed to.
			submitSettings( canManageOptions ? values : omit( values, [ "blogname", "blogdescription" ] ) ),
			// Only save the user profiles when allowed and when the user ID is a number of 1 or higher.
			canSaveUserProfiles && submitUserSocialProfiles( userId, personSocialProfiles ),
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
