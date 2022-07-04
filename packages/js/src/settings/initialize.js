/* eslint-disable require-jsdoc */
import domReady from "@wordpress/dom-ready";
import { render } from "@wordpress/element";
import { Root } from "@yoast/ui-library";
import { Formik } from "formik";
import { HashRouter } from "react-router-dom";
import { forEach, get, isObject } from "lodash";
import { SitePreferences } from "./routes";

const getInitialValues = () => get( window, "wpseoScriptData.settings", {} );

const handleSubmit = async( values ) => {
	const { endpoint, nonce } = get( window, "wpseoScriptData", {} );
	const formData = new FormData();

	formData.set( "option_page", "wpseo_settings" );
	formData.set( "action", "update" );
	formData.set( "_wpnonce", nonce );

	forEach( values, ( value, name ) => {
		if ( isObject( value ) ) {
			forEach( value, ( nestedValue, nestedName ) => formData.set( `${ name }[${ nestedName }]`, nestedValue ) );
			return;
		}
		formData.set( name, value );
	} );

	try {
		await fetch( endpoint, {
			method: "POST",
			body: new URLSearchParams( formData ),
		} );

		return true;
	} catch ( error ) {
		console.error( error.message );
		return false;
	}
};

domReady( () => {
	const root = document.getElementById( "yoast-seo-settings" );
	if ( ! root ) {
		return;
	}

	// Redux -> global UI state & script data & actions
	// Formik -> form state

	render(
		<Root>
			<HashRouter />
			<Formik
				initialValues={ getInitialValues() }
				onSubmit={ handleSubmit }
			>
				<SitePreferences />
			</Formik>
		</Root>,
		root
	);
} );
