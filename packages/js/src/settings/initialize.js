import domReady from "@wordpress/dom-ready";
import { render } from "@wordpress/element";
import { dispatch, select } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { Root } from "@yoast/ui-library";
import { Formik } from "formik";
import { forEach, get, isObject, isArray, chunk, includes, reduce, filter } from "lodash";
import { HashRouter } from "react-router-dom";
import { StyleSheetManager } from "styled-components";
import App from "./app";
import { createValidationSchema } from "./helpers";
import registerStore from "./store";
import { STORE_NAME } from "./constants";

/**
 * @param {Object} settings The settings.
 * @returns {void}
 */
const preloadMedia = async( settings ) => {
	const titleSettings = get( settings, "wpseo_titles", {} );
	const mediaIds = filter( [
		get( settings, "wpseo_social.og_default_image_id", 0 ),
		get( settings, "wpseo_titles.open_graph_frontpage_image_id", 0 ),
		...reduce( titleSettings, ( acc, value, key ) => includes( key, "social-image-id" ) ? [ ...acc, value ] : acc, [] ),
	], Boolean );
	const mediaIdsChunks = chunk( mediaIds, 100 );
	const { fetchMedia } = dispatch( STORE_NAME );
	forEach( mediaIdsChunks, fetchMedia );
};

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
			id: "submit-success",
			variant: "success",
			title: __( "Great! Your settings were saved successfully.", "wordpress-seo" ),
		} );

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

domReady( () => {
	const root = document.getElementById( "yoast-seo-settings" );
	if ( ! root ) {
		return;
	}

	// Prevent Styled Components' styles by adding the stylesheet to a div that is in the shadow DOM.
	const shadowHost = document.createElement( "div" );
	const shadowRoot = shadowHost.attachShadow( { mode: "open" } );
	document.body.appendChild( shadowHost );

	const settings = get( window, "wpseoScriptData.settings", {} );
	const postTypes = get( window, "wpseoScriptData.postTypes", {} );
	const taxonomies = get( window, "wpseoScriptData.taxonomies", {} );

	registerStore();
	preloadMedia( settings );

	const isRtl = select( STORE_NAME ).selectPreference( "isRtl", false );

	render(
		<Root context={ { isRtl } }>
			<StyleSheetManager target={ shadowRoot }>
				<HashRouter>
					<Formik
						initialValues={ settings }
						validationSchema={ createValidationSchema( postTypes, taxonomies ) }
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
