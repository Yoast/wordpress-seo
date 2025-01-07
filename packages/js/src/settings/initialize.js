import { SlotFillProvider } from "@wordpress/components";
import { dispatch, select } from "@wordpress/data";
import domReady from "@wordpress/dom-ready";
import { render } from "@wordpress/element";
import { Root } from "@yoast/ui-library";
import { Formik } from "formik";
import { chunk, filter, forEach, get, includes, reduce } from "lodash";
import { HashRouter } from "react-router-dom";
import { StyleSheetManager } from "styled-components";
import { fixWordPressMenuScrolling } from "../shared-admin/helpers";
import { LINK_PARAMS_NAME } from "../shared-admin/store";
import App from "./app";
import { STORE_NAME } from "./constants";
import { createValidationSchema, handleSubmit } from "./helpers";
import registerStore from "./store";
import { __ } from "@wordpress/i18n";

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
		// Try to focus the Yoast logo if in "mobile" view.
		if ( window.outerWidth > 782 ) {
			document.getElementById( "link-yoast-logo" )?.focus();
			return;
		}
		// Try to focus the open sidebar navigation button.
		document.getElementById( "button-open-settings-navigation-mobile" )?.focus();
	} );
	const wpToolbar = document.querySelector( "[href=\"#wp-toolbar\"]" );
	wpToolbar.addEventListener( "click", e => {
		e.preventDefault();
		document.querySelector( "#wp-admin-bar-wp-logo a" )?.focus();
	} );
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

	const showNewContentTypeNotification = get( window, "wpseoScriptData.showNewContentTypeNotification", false );
	const notifications = ( showNewContentTypeNotification )
		? { [ "new-content-type" ]: {
			id: "new-content-type",
			variant: "info",
			size: "large",
			title: __( "New type of content added to your site!", "wordpress-seo" ),
			description: __( "Please see the “New” badges and review the Search appearance settings.", "wordpress-seo" ),
		} } : {};


	registerStore( {
		initialState: {
			notifications,
			[ LINK_PARAMS_NAME ]: get( window, "wpseoScriptData.linkParams", {} ),
			currentPromotions: { promotions: get( window, "wpseoScriptData.currentPromotions", [] ) },
		},
	} );

	preloadMedia( { settings, fallbacks } );
	preloadUsers( { settings } );
	fixFocusLinkCompatibility();
	fixWordPressMenuScrolling();

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
