import domReady from "@wordpress/dom-ready";
import { createRoot } from "@wordpress/element";
import { App } from "./components/app";

/**
 * Mounts the App into a container element.
 *
 * @param {HTMLElement} container  The element to mount into.
 * @param {string}      location   Extra location classes for the notice.
 * @param {string}      className  Extra class names for the notice.
 *
 * @returns {void}
 */
const mountNotice = ( container, location, className ) => {
	createRoot( container ).render(
		<App className={ className } location={ location } />
	);
};

domReady( () => {
	const productImageContainer = document.getElementById( "yoast-product-image-alt-notice" );
	if ( productImageContainer ) {
		mountNotice( productImageContainer, "product-image", "yst-mx-3 yst-mb-3" );
	}

	const galleryMetaBoxInside = document.querySelector( "#woocommerce-product-images .inside" );
	if ( galleryMetaBoxInside ) {
		const galleryContainer = document.createElement( "div" );
		galleryContainer.id = "yoast-product-gallery-alt-notice";
		galleryMetaBoxInside.appendChild( galleryContainer );
		mountNotice( galleryContainer, "product-gallery", "yst-mx-3 yst-mb-3 yst--mt-3" );
	}

	const variationsInner = document.getElementById( "variable_product_options_inner" );
	if ( variationsInner ) {
		const variationsNotice = document.createElement( "div" );
		variationsNotice.id = "yoast-product-variations-alt-notice";
		// Insert before .woocommerce_variations so the notice sits above the variation rows.
		const variationsList = variationsInner.querySelector( ".woocommerce_variations" );
		if ( variationsList ) {
			variationsInner.insertBefore( variationsNotice, variationsList );
		} else {
			variationsInner.appendChild( variationsNotice );
		}
		mountNotice( variationsNotice, "product-variations", "yst-m-3 yst-w-max" );
	}
} );
