import { SlotFillProvider } from "@wordpress/components";
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
 * @param {Object} fallbacks The fallbacks.
 * @returns {void}
 */
const preloadMedia = async( { settings, fallbacks } ) => {
	const titleSettings = get( settings, "wpseo_titles", {} );
	const mediaIds = filter( [
		get( settings, "wpseo_social.og_default_image_id", "0" ),
		get( settings, "wpseo_titles.open_graph_frontpage_image_id", "0" ),
		get( settings, "wpseo_titles.company_logo_id", "0" ),
		get( settings, "wpseo_titles.person_logo_id", "0" ),
		get( fallbacks, "siteLogoId", "0" ),
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
const preloadUsers = async( { settings } ) => {
	const userId = get( settings, "wpseo_titles.company_or_person_user_id" );
	const { fetchUsers } = dispatch( STORE_NAME );

	if ( userId ) {
		fetchUsers( { include: [ userId ] } );
	}
};

/**
 * Fixes the WordPress skip links.
 *
 * By disabling the default behavior of the links and focusing the elements.
 *
 * @returns {void}
 */
const fixFocusLinkCompatibility = () => {
	const wpContentBody = document.querySelector( "[href=\"#wpbody-content\"]" );
	wpContentBody.addEventListener( "click", e => {
		e.preventDefault();
		let searchButton = document.getElementById( "yst-search-button-mobile" );
		if ( ! searchButton ) {
			searchButton = document.getElementById( "yst-search-button" )?.focus();
		}
		searchButton?.focus();
	} );
	const wpToolbar = document.querySelector( "[href=\"#wp-toolbar\"]" );
	wpToolbar.addEventListener( "click", e => {
		e.preventDefault();
		document.querySelector( "#wp-admin-bar-wp-logo a" )?.focus();
	} );
};

/**
 * Enforce a minimum height on the WP content that is the height of the WP menu.
 *
 * This prevents it from going into the fixed mode.
 *
 * @returns {void}
 */
const matchWpMenuHeight = () => {
	const wpcontent = document.getElementById( "wpcontent" );
	const menu = document.getElementById( "adminmenuwrap" );
	wpcontent.style.minHeight = `${ menu.offsetHeight }px`;
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
	const fallbacks = get( window, "wpseoScriptData.fallbacks", {} );
	const postTypes = get( window, "wpseoScriptData.postTypes", {} );
	const taxonomies = get( window, "wpseoScriptData.taxonomies", {} );

	registerStore();
	preloadMedia( { settings, fallbacks } );
	preloadUsers( { settings } );
	fixFocusLinkCompatibility();
	matchWpMenuHeight();

	const isRtl = select( STORE_NAME ).selectPreference( "isRtl", false );

	render(
		<Root context={ { isRtl } }>
			<StyleSheetManager target={ shadowRoot }>
				<SlotFillProvider>
					<HashRouter>
						<Formik
							initialValues={ settings }
							validationSchema={ createValidationSchema( postTypes, taxonomies ) }
							onSubmit={ handleSubmit }
						>
							<App />
						</Formik>
					</HashRouter>
				</SlotFillProvider>
			</StyleSheetManager>
		</Root>,
		root
	);
} );
