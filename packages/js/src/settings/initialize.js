import { dispatch } from "@wordpress/data";
import domReady from "@wordpress/dom-ready";
import { __ } from "@wordpress/i18n";
import { Formik } from "formik";
import { chunk, filter, forEach, get, includes, map, reduce, toInteger } from "lodash";
import App from "./app";
import { STORE_NAME } from "./constants";
import { createValidationSchema, handleSubmit } from "./helpers";
import registerStore from "./store";

/**
 * @param {Object} settings The settings.
 * @param {Object} fallbacks The fallbacks.
 * @returns {void}
 */
const preloadMedia = async( { settings, fallbacks } ) => {
	const titleSettings = get( settings, "wpseo_titles", {} );
	const mediaIds = filter( map( [
		get( settings, "wpseo_social.og_default_image_id", "0" ),
		get( settings, "wpseo_titles.open_graph_frontpage_image_id", "0" ),
		get( settings, "wpseo_titles.company_logo_id", "0" ),
		get( settings, "wpseo_titles.person_logo_id", "0" ),
		get( fallbacks, "siteLogoId", "0" ),
		...reduce( titleSettings, ( acc, value, key ) => includes( key, "social-image-id" ) ? [ ...acc, value ] : acc, [] ),
	], toInteger ), Boolean );
	const mediaIdsChunks = chunk( mediaIds, 100 );
	const { fetchMedia } = dispatch( STORE_NAME );
	forEach( mediaIdsChunks, fetchMedia );
};

/**
 * @param {Object} settings The settings.
 * @returns {void}
 */
const preloadUsers = async( { settings } ) => {
	const userId = get( settings, "wpseo_titles.company_or_person_user_id" );
	const { fetchUsers } = dispatch( STORE_NAME );

	if ( userId ) {
		fetchUsers( { include: [ userId ] } );
	}
};

domReady( () => {
	const settings = get( window, "wpseoScriptData.settings", {} );
	const fallbacks = get( window, "wpseoScriptData.fallbacks", {} );
	const postTypes = get( window, "wpseoScriptData.postTypes", {} );
	const taxonomies = get( window, "wpseoScriptData.taxonomies", {} );

	registerStore();
	preloadMedia( { settings, fallbacks } );
	preloadUsers( { settings } );

	if ( ! window?.YoastSEO?.admin?.registerRoute ) {
		console.warn( "Can not initialize settings!" );
		return;
	}
	window.unreg = window.YoastSEO.admin.registerRoute(
		{
			id: "settings",
			priority: 6,
			path: "/settings",
			text: __( "Settings", "wordpress-seo" ),
		},
		(
			<Formik
				initialValues={ settings }
				validationSchema={ createValidationSchema( postTypes, taxonomies ) }
				onSubmit={ handleSubmit }
			>
				<App />
			</Formik>
		)
	);
} );
