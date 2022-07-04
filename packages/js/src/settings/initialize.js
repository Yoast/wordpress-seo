/* eslint-disable require-jsdoc */
import domReady from "@wordpress/dom-ready";
import { render } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Badge, Button, Root, Title } from "@yoast/ui-library";
import { Field, Form, Formik } from "formik";
import { forEach, get, map, keys } from "lodash";
import FormikToggleField from "./components/formik-toggle-field";

const getInitialValues = () => get( window, "wpseoScriptData.options", {} );

const handleSubmit = async ( values ) => {
	const nonces = get( window, "wpseoScriptData.nonces", {} );
	const endpoint = "http://basic.wordpress.test/wp-admin/options.php";

	const createRequestBody = groupName => {
		const formData = new FormData();

		formData.set( "option_page", `yoast_${ groupName }_options` );
		formData.set( "action", "update" );
		formData.set( "_wpnonce", nonces[ groupName ] );

		forEach( values[ groupName ], ( value, name ) => formData.set( `${ groupName }[${ name }]`, value ) );

		// The endpoint expects content type `application/x-www-form-urlencoded`. URLSearchParams does this for us.
		return new URLSearchParams( formData );
	};

	const createRequest = groupName => {
		console.log(groupName);
		return fetch( endpoint, {
			method: "POST",
			body: createRequestBody( groupName ),
		} );
	};

	try {
		await Promise.all( map( keys( nonces ), createRequest ) );
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
						<Field
							as={ FormikToggleField }
							type="checkbox"
							name="wpseo.keyword_analysis_active"
							label={ __( "SEO analysis", "wordpress-seo" ) }
							className="yst-mb-8"
						>
							{ __( "The SEO analysis offers suggestions to improve the SEO of your text.", "wordpress-seo" ) }
						</Field>
						<Button type="submit" isLoading={ isSubmitting } disabled={ isSubmitting }>
							{ __( "Save changes", "wordpress-seo" ) }
						</Button>
					</Form>
				) }
			</Formik>
		</Root>,
		root,
	);
} );
