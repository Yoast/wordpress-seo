import { dispatch, select } from "@wordpress/data";
import domReady from "@wordpress/dom-ready";
import { render } from "@wordpress/element";
import { Root } from "@yoast/ui-library";
import { Formik } from "formik";
import { chunk, filter, forEach, get, includes, reduce } from "lodash";
import { HashRouter } from "react-router-dom";
import { StyleSheetManager } from "styled-components";
import App from "./app";
import { STORE_NAME } from "./constants";
import { createValidationSchema, handleSubmit } from "./helpers";
import registerStore from "./store";

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
 * @param {Object} settings The settings.
 * @returns {void}
 */
const preloadUsers = async( settings ) => {
	const userId = get( settings, "wpseo_titles.company_or_person_user_id", [] );
	const { fetchUsers } = dispatch( STORE_NAME );

	if ( userId ) {
		fetchUsers( { include: [ userId ] } );
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
	preloadUsers();

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
