import { useState, useEffect, useCallback } from "@wordpress/element";
import { fetchAttachmentAlts } from "../helpers";

/**
 * Reads gallery images from the classic editor DOM.
 * Alt text is only reliable for server-rendered images; newly added images
 * may have an empty alt until the REST API fetch completes.
 *
 * @returns {import("./use-product-images").ProductImage[]}
 */
function getGalleryImagesFromDOM() {
	const items = document.querySelectorAll(
		"#product_images_container ul.product_images li.image"
	);
	return Array.from( items ).map( ( li ) => {
		const img = li.querySelector( "img" );
		return {
			id: Number( li.dataset.attachment_id ) || null,
			src: img?.src ?? "",
			alt: img?.alt ?? "",
		};
	} );
}

/**
 * Returns the product gallery images from the classic editor DOM, kept in
 * sync with add / remove / reorder and alt text changes.
 *
 * @returns {{ galleryImages: import("./use-product-images").ProductImage[], isLoadingAlts: boolean }}
 */
export const useProductGallery = () => {
	const [ galleryImages, setGalleryImages ] = useState( () => getGalleryImagesFromDOM() );
	const [ isLoadingAlts, setIsLoadingAlts ] = useState( false );

	const refresh = useCallback( async() => {
		const images = getGalleryImagesFromDOM();
		setGalleryImages( images );
		setIsLoadingAlts( true );

		const ids = images.map( ( img ) => img.id ).filter( ( id ) => id > 0 );
		const alts = await fetchAttachmentAlts( ids );

		setGalleryImages( images.map( ( img ) => ( { ...img, alt: alts.get( img.id ) ?? img.alt } ) ) );
		setIsLoadingAlts( false );
	}, [] );

	useEffect( () => {
		refresh();

		const cleanups = [];

		// Re-run when images are added or removed from the gallery <ul>.
		const galleryContainer = document.querySelector( ".product_images" );
		if ( galleryContainer ) {
			const galleryObserver = new MutationObserver( () => refresh() );
			galleryObserver.observe( galleryContainer, { childList: true } );
			cleanups.push( () => galleryObserver.disconnect() );
		}

		// Re-run after WooCommerce reorder / add / remove events.
		const $galleryContainer = window.jQuery?.( "#product_images_container" );
		$galleryContainer?.on( "woocommerce_gallery_update", refresh );
		cleanups.push( () => $galleryContainer?.off( "woocommerce_gallery_update", refresh ) );

		// Re-run when attachment metadata (alt text) is saved via WordPress AJAX.
		const onAjaxSuccess = ( _e, _xhr, settings ) => {
			if ( /action=save-attachment/.test( settings.data ) ) {
				refresh();
			}
		};
		window.jQuery?.( document ).on( "ajaxSuccess", onAjaxSuccess );
		cleanups.push( () => window.jQuery?.( document ).off( "ajaxSuccess", onAjaxSuccess ) );

		// Fallback: wp.media Backbone mediator.
		const onAttachmentSave = () => refresh();
		window.wp?.media?.on?.( "attachment:save", onAttachmentSave );
		cleanups.push( () => window.wp?.media?.off?.( "attachment:save", onAttachmentSave ) );

		return () => cleanups.forEach( ( fn ) => fn() );
	}, [ refresh ] );

	return { galleryImages, isLoadingAlts };
};
