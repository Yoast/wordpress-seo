import { SlotFillProvider } from "@wordpress/components";
import { select } from "@wordpress/data";
import domReady from "@wordpress/dom-ready";
import { render } from "@wordpress/element";
import { Root } from "@yoast/ui-library";
import App from "./app";
import { STORE_NAME } from "./constants";
import registerStore from "./store";

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
	const root = document.getElementById( "yoast-seo-academy" );
	if ( ! root ) {
		return;
	}
	registerStore();
	matchWpMenuHeight();

	const isRtl = select( STORE_NAME ).selectPreference( "isRtl", false );

	render(
		<Root context={ { isRtl } }>
			<SlotFillProvider>
				<App />
			</SlotFillProvider>
		</Root>,
		root
	);
} );
