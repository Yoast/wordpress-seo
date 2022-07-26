import domReady from "@wordpress/dom-ready";
import { render } from "@wordpress/element";
import { dispatch, select } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { Root } from "@yoast/ui-library";
import { Formik } from "formik";
import { forEach, get, isObject, isArray } from "lodash";
import { HashRouter } from "react-router-dom";
import { StyleSheetManager } from "styled-components";
import App from "./app";
import { validationSchema } from "./helpers/validation";
import registerStore, { STORE_NAME } from "./store";

/**
 * Retrieves the initial settings.
 * @returns {Object} The settings.
 */
const getInitialValues = () => get( window, "wpseoScriptData.settings", {} );

/**
 * Handles the form submit.
 * @param {Object} values The values.
 * @returns {Promise<boolean>} Promise of save result.
 */
const handleSubmit = async( values ) => {
	const { endpoint, nonce } = get( window, "wpseoScriptData", {} );
	const { addNotification } = dispatch( STORE_NAME );

	const formData = new FormData();

	formData.set( "option_page", "wpseo_settings" );
	formData.set( "_wp_http_referer", "admin.php?page=wpseo_settings_saved" );
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
		await fetch( endpoint, {
			method: "POST",
			body: new URLSearchParams( formData ),
		} );

		addNotification( {
			variant: "success",
			title: __( "Great! Your settings were saved successfully.", "wordpress-seo" ),
		} );

		return true;
	} catch ( error ) {
		addNotification( {
			variant: "error",
			title: __( "Oops! Something went wrong while saving.", "wordpress-seo" ),
		} );

		console.error( error.message );
		return false;
	}
};

domReady( () => {
	const root = document.getElementById( "yoast-seo-settings" );
	if ( ! root ) {
		return;
	}

	registerStore();

	const isRtl = select( STORE_NAME ).selectPreference( "isRtl", false );

	// Prevent Styled Components' styles by adding the stylesheet to a div that is not on the page.
	const styleDummy = document.createElement( "div" );

	render(
		<Root context={ { isRtl } }>
			<StyleSheetManager target={ styleDummy }>
				<HashRouter>
					<Formik
						initialValues={ getInitialValues() }
						// ValidationSchema={ validationSchema }
						onSubmit={ handleSubmit }
					>
						<App />
					</Formik>
				</HashRouter>
			</StyleSheetManager>
		</Root>,
		root
	);
} );
