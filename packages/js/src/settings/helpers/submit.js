import apiFetch from "@wordpress/api-fetch";
import { dispatch } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { forEach, get, isArray, isObject } from "lodash";
import { PERSON_SOCIAL_PROFILES_ROUTE, STORE_NAME } from "../constants";

/**
 * @param {Object} values The values.
 * @returns {Promise<void>} Promise of save result. Errors when failing.
 */
const submitPersonSocialProfiles = async( values ) => {
	const { person_social_profiles: personSocialProfiles } = values;
	const { company_or_person: companyOrPerson, company_or_person_user_id: personId } = values.wpseo_titles;

	if ( companyOrPerson !== "person" || personId < 1 ) {
		// A person is not represented.
		return;
	}

	try {
		const { json: { success } } = await apiFetch( {
			path: PERSON_SOCIAL_PROFILES_ROUTE,
			method: "POST",
			data: {
				...personSocialProfiles,
				// eslint-disable-next-line camelcase
				user_id: personId,
			},
		} );

		if ( ! success ) {
			throw new Error();
		}
	} catch ( error ) {
		throw new Error( "Something went wrong saving the person' social profiles." );
	}
};

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
		throw new Error( "Something went wrong saving the settings." );
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

	try {
		await Promise.all( [
			submitSettings( values ),
			submitPersonSocialProfiles( values ),
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

		console.error( error.message );
		return false;
	}
};
