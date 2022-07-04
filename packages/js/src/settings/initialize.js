/* eslint-disable require-jsdoc */
import domReady from "@wordpress/dom-ready";
import { render } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Root, Title } from "@yoast/ui-library";
import { Formik } from "formik";
import { HashRouter, Routes, Route, Link } from "react-router-dom";
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

	render(
		<Root>
			<HashRouter>
				<Formik
					initialValues={ getInitialValues() }
					onSubmit={ handleSubmit }
				>
					<div className="yst-flex md:yst-space-x-4">
						<aside className="yst-hidden md:yst-block yst-flex-shrink-0 yst-w-56 lg:yst-w-64">
							<nav>
								<Link to="site-preferences">
									{ __( "Site preferences", "wordpress-seo" ) }
								</Link>
								<br />
								<Link to="other">
									{ __( "Other", "wordpress-seo" ) }
								</Link>
							</nav>
						</aside>
						<main>
							<Routes>
								<Route path="site-preferences" element={ <SitePreferences /> } />
								<Route path="other" element={ <Title>Other</Title> }>
									Another page
								</Route>
								<Route path="/" element={ <SitePreferences /> } />
							</Routes>
						</main>
					</div>
				</Formik>
			</HashRouter>
		</Root>,
		root
	);
} );
