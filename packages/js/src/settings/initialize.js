/* eslint-disable require-jsdoc */
import domReady from "@wordpress/dom-ready";
import { render } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Badge, Button, Root, Title, ToggleField } from "@yoast/ui-library";
import { Form, Formik } from "formik";
import { forEach, get, isObject } from "lodash";
import FormikValueChangeField from "./components/formik-value-change-field";

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
			<Title className="yst-mb-8">
				{ __( "Settings", "wordpress-seo" ) }
				<Badge>{ __( "Beta", "wordpress-seo" ) }</Badge>
			</Title>
			<Formik
				initialValues={ getInitialValues() }
				onSubmit={ handleSubmit }
			>
				{ ( { isSubmitting } ) => (
					<Form>
						<FormikValueChangeField
							as={ ToggleField }
							type="checkbox"
							name="wpseo.keyword_analysis_active"
							label={ __( "SEO analysis", "wordpress-seo" ) }
							className="yst-mb-8"
						>
							{ __( "The SEO analysis offers suggestions to improve the SEO of your text.", "wordpress-seo" ) }
						</FormikValueChangeField>
						<Button type="submit" isLoading={ isSubmitting } disabled={ isSubmitting }>
							{ __( "Save changes", "wordpress-seo" ) }
						</Button>
					</Form>
				) }
			</Formik>
		</Root>,
		root
	);
} );
