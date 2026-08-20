import domReady from "@wordpress/dom-ready";
import { createRoot } from "@wordpress/element";
import { Root } from "@yoast/ui-library";
import { get } from "lodash";
import { ImageAltNotice } from "./components/image-alt-notice";

/**
 * Mounts an ImageAltNotice into a container element.
 *
 * @param {HTMLElement} container              The element to mount into.
 * @param {number}      numberOfImagesMissingAlt The count of images without alt text.
 * @param {Function}    onClick                Called when the notice's action button is clicked.
 *
 * @returns {void}
 */
const mountNotice = ( container, numberOfImagesMissingAlt, onClick, className ) => {
	const isRtl = get( window, "wpseoProductImageAlt.isRtl", false );

	createRoot( container ).render(
		<Root context={ { isRtl } }>
			<ImageAltNotice
				numberOfImagesMissingAlt={ numberOfImagesMissingAlt }
				className={ className }
				onClick={ onClick }
			/>
		</Root>
	);
};

domReady( () => {
	const numberOfImagesMissingAlt = get( window, "wpseoProductImageAlt.numberOfImagesMissingAlt", 0 );

	if ( numberOfImagesMissingAlt === 0 ) {
		return;
	}

	const onClick = () => {};

	const productImageContainer = document.getElementById( "yoast-product-image-alt-notice" );
	if ( productImageContainer ) {
		mountNotice( productImageContainer, numberOfImagesMissingAlt, onClick, "yst-mx-3 yst-mb-3" );
	}

	const galleryMetaBoxInside = document.querySelector( "#woocommerce-product-images .inside" );
	if ( galleryMetaBoxInside ) {
		const galleryContainer = document.createElement( "div" );
		galleryContainer.id = "yoast-product-gallery-alt-notice";
		galleryMetaBoxInside.appendChild( galleryContainer );
		mountNotice( galleryContainer, numberOfImagesMissingAlt, onClick, "yst-mx-3 yst-mb-3 yst--mt-3 " );
	}
} );
