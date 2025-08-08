import { dispatch, select } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { forEach, get, includes, isArray, isObject, omit } from "lodash";
import { STORE_NAME } from "../constants";

/**
 * @param {string} responseText The responseText.
 * @returns {void}
 */
const handleLlmstxtFailure = ( responseText ) => {
	const { setGenerationFailure } = dispatch( STORE_NAME );

	if ( includes( responseText, "{{ yoast-llms-txt-generation-failure: " ) ) {
		// We do a nested if here for performance reasons, so that we add a single `includes` operation and not more, in most cases.
		if ( includes( responseText, "{{ yoast-llms-txt-generation-failure: filesystem_permissions }}" ) ) {
			setGenerationFailure( {
				generationFailure: true,
				generationFailureReason: "filesystem_permissions",
			} );
			return;
		}

		if ( includes( responseText, "{{ yoast-llms-txt-generation-failure: not_managed_by_yoast_seo }}" ) ) {
			setGenerationFailure( {
				generationFailure: true,
				generationFailureReason: "not_managed_by_yoast_seo",
			} );
			return;
		}

		setGenerationFailure( {
			generationFailure: true,
			generationFailureReason: "unknown",
		} );

		return;
	}

	setGenerationFailure( {
		generationFailure: false,
		generationFailureReason: "",
	} );
};

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

		handleLlmstxtFailure( responseText );

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
	const { selectPreference } = select( STORE_NAME );
	const canManageOptions = selectPreference( "canManageOptions", false );

	try {
		await Promise.all( [
			// Ensure we do not save WP options when the user is not allowed to.
			submitSettings( canManageOptions ? values : omit( values, [ "blogdescription" ] ) ),
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
