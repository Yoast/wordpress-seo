import { useState, useEffect, useCallback } from "@wordpress/element";
import { fetchAttachmentAlts } from "../helpers";

/**
 * Reads the featured (product) image from the classic editor DOM.
 * Alt text is only reliable for server-rendered images; newly set images
 * may have an empty alt until the REST API fetch completes.
 *
 * @returns {import("./use-product-images").ProductImage|null}
 */
function getFeaturedImageFromDOM() {
	const rawId = Number( document.getElementById( "_thumbnail_id" )?.value );
	const id = rawId > 0 ? rawId : null;
	if ( ! id ) {
		return null;
	}
	const img = document.querySelector( "#set-post-thumbnail img" );
	return { id, src: img?.src ?? "", alt: img?.alt ?? "" };
}

/**
 * Returns the featured (product) image from the classic editor DOM, kept in
 * sync with set / remove and alt text changes.
 *
 * @returns {{ featuredImage: import("./use-product-images").ProductImage|null, isLoadingAlts: boolean }}
 */
export const useProductImage = () => {
	const [ featuredImage, setFeaturedImage ] = useState( () => getFeaturedImageFromDOM() );
	const [ isLoadingAlts, setIsLoadingAlts ] = useState( false );

	const refresh = useCallback( async() => {
		const image = getFeaturedImageFromDOM();
		setFeaturedImage( image );
		setIsLoadingAlts( true );

		const alts = await fetchAttachmentAlts( image?.id > 0 ? [ image.id ] : [] );

		setFeaturedImage( image ? { ...image, alt: alts.get( image.id ) ?? image.alt } : null );
		setIsLoadingAlts( false );
	}, [] );

	useEffect( () => {
		refresh();

		const cleanups = [];

		// Re-run when the featured image is set, removed, or its alt text is edited.
		const thumbnailEl = document.getElementById( "set-post-thumbnail" );
		if ( thumbnailEl ) {
			thumbnailEl.addEventListener( "click", refresh );
			const thumbnailObserver = new MutationObserver( () => refresh() );
			thumbnailObserver.observe( thumbnailEl, { childList: true, subtree: true } );
			cleanups.push( () => {
				thumbnailEl.removeEventListener( "click", refresh );
				thumbnailObserver.disconnect();
			} );
		}

		// Re-run when attachment metadata (alt text) is saved via WordPress AJAX.
		const onAjaxSuccess = ( _e, _xhr, settings ) => {
			if ( /action=(save-attachment|set-post-thumbnail)/.test( settings.data ) ) {
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

	return { featuredImage, isLoadingAlts };
};
