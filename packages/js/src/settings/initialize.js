/* eslint-disable require-jsdoc */
import domReady from "@wordpress/dom-ready";
import { render } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { forEach, isObject, get } from "lodash";
import { Formik, Form, Field } from "formik";
import { Badge, Root, Title, Button } from "@yoast/ui-library";
import FormikToggleField from "./components/formik-toggle-field";

const initialValues = {
	wpseo: {
		keyword_analysis_active: true,
	},
};

const handleSubmit = async( values ) => {
	try {
		const { nonce } = get( window, "wpseoScriptData", {} );
		const endpoint = "http://basic.wordpress.test/wp-admin/options.php";
		const formData = new FormData();

		formData.set( "option_page", "yoast_wpseo_options" );
		formData.set( "action", "update" );
		formData.set( "_wpnonce", nonce );

		formData.set( "wpseo[keyword_analysis_active]", "off" );
		formData.set( "wpseo[content_analysis_active]", "on" );

		forEach( values, ( value, name ) => {
			if ( isObject( value ) ) {
				return forEach( value, ( v, n ) => formData.set( `${name}[${n}]`, v ) );
			}
			FormData.set( name, value );
		} );

		fetch( endpoint, {
			method: "POST",
			body: new URLSearchParams( formData ),
		} );
	} catch ( error ) {
		console.error( error.message );
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
			<Title className="yst-mb-8">
				{ __( "Settings", "wordpress-seo" ) }
				<Badge>{ __( "Beta", "wordpress-seo" ) }</Badge>
			</Title>
			<Formik
				initialValues={ initialValues }
				onSubmit={ handleSubmit }
			>
				{ ( { isSubmitting } ) => (
					<Form>
						<Field
							as={ FormikToggleField }
							type="checkbox"
							name="wpseo.keyword_analysis_active"
							label={ __( "SEO analysis", "wordpress-seo" ) }
							className="yst-mb-8"
						>
							{ __( "The SEO analysis offers suggestions to improve the SEO of your text.", "wordpress-seo" ) }
						</Field>
						<Button type="submit" isLoading={ isSubmitting }>
							{ __( "Save changes", "wordpress-seo" ) }
						</Button>
					</Form>
				) }
			</Formik>
		</Root>,
		root
	);
} );
