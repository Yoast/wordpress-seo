import { SlotFillProvider } from "@wordpress/components";
import { dispatch, select } from "@wordpress/data";
import domReady from "@wordpress/dom-ready";
import { render } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Root } from "@yoast/ui-library";
import { HashRouter } from "react-router-dom";
import { StyleSheetManager } from "styled-components";
import App from "./app";
import { STORE_NAME } from "./constants";
import { createRegistry, ensureElement, registerGlobalApis } from "./helpers";
import { registerStore } from "./store";

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

/**
 * Enforce a minimum height on the WP content that is the height of the WP menu.
 *
 * This prevents it from going into the fixed mode.
 *
 * @returns {void}
 */
const matchWpMenuHeight = () => {
	const content = document.getElementById( "wpcontent" );
	const menu = document.getElementById( "adminmenuwrap" );
	content.style.minHeight = `${ menu.offsetHeight }px`;
};

domReady( () => {
	// Prevent Styled Components' styles by adding the stylesheet to a div that is in the shadow DOM.
	const shadowHost = document.createElement( "div" );
	const shadowRoot = shadowHost.attachShadow( { mode: "open" } );
	document.body.appendChild( shadowHost );

	fixFocusLinkCompatibility();
	matchWpMenuHeight();

	registerStore();
	dispatch( STORE_NAME ).addRoutes( [
		{ id: "insights", priority: 0, path: "/insights", text: __( "Insights", "wordpress-seo" ) },
		{ id: "workouts", priority: 2, path: "/workouts", text: __( "Workouts", "wordpress-seo" ) },
		{ id: "features", priority: 4, path: "/features", text: __( "Features", "wordpress-seo" ) },
		{ id: "tools", priority: 8, path: "/tools", text: __( "Tools", "wordpress-seo" ) },
		{ id: "support", priority: 10, path: "/support", text: __( "Support", "wordpress-seo" ) },
	] );

	const routeRegistry = createRegistry();
	/**
	 * Registers a route.
	 * @param {{id: string, priority: Number, path: string, text: string}} route The route.
	 * @param {JSX.Element} element The route content.
	 * @returns {function} The unregister method.
	 */
	const registerRoute = ( route, element ) => {
		const unregister = routeRegistry.register( route.id, element );
		dispatch( STORE_NAME ).addRoute( route );

		return () => {
			dispatch( STORE_NAME ).removeRoute( route.id );
			unregister();
		};
	};

	registerGlobalApis( "YoastSEO", { admin: { registerRoute } } );

	const isRtl = select( STORE_NAME ).selectFromShared( "isRtl", false );

	render(
		(
			<Root context={ { isRtl } }>
				<StyleSheetManager target={ shadowRoot }>
					<SlotFillProvider>
						<HashRouter>
							<App routeCollection={ routeRegistry.collection } />
						</HashRouter>
					</SlotFillProvider>
				</StyleSheetManager>
			</Root>
		),
		ensureElement( "yoast-seo-admin" )
	);
} );
