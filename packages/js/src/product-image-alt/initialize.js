import domReady from "@wordpress/dom-ready";
import { createRoot } from "@wordpress/element";
import { App } from "./components/app";

/**
 * Mounts the App into a container element.
 *
 * @param {HTMLElement} container  The element to mount into.
 * @param {string}      className  Extra class names for the notice.
 *
 * @returns {void}
 */
const mountNotice = ( container, className ) => {
	createRoot( container ).render(
		<App className={ className } />
	);
};

domReady( () => {
	const productImageContainer = document.getElementById( "yoast-product-image-alt-notice" );
	if ( productImageContainer ) {
		mountNotice( productImageContainer, "yst-mx-3 yst-mb-3" );
	}

	const galleryMetaBoxInside = document.querySelector( "#woocommerce-product-images .inside" );
	if ( galleryMetaBoxInside ) {
		const galleryContainer = document.createElement( "div" );
		galleryContainer.id = "yoast-product-gallery-alt-notice";
		galleryMetaBoxInside.appendChild( galleryContainer );
		mountNotice( galleryContainer, "yst-mx-3 yst-mb-3 yst--mt-3" );
	}
} );
