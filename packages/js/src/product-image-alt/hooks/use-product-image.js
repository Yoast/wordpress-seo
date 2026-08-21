/* eslint-disable complexity */
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
	// The <img> inside #set-post-thumbnail is the definitive signal that a
	// product image is set. WooCommerce (thickbox flow) adds the img first and
	// updates _thumbnail_id slightly after, so we must not gate on the ID.
	const img = document.querySelector( "#set-post-thumbnail img" );
	if ( ! img ) {
		return null;
	}

	// Read _thumbnail_id as best-effort: may still be -1 on the first
	// MutationObserver tick if _thumbnail_id hasn't been updated yet.
	// A null id means we skip the REST fetch but the notice still shows
	// correctly because img.alt is already readable from the DOM.
	const rawId = Number( document.getElementById( "_thumbnail_id" )?.value );
	const id = rawId > 0 ? rawId : null;

	return { id, src: img.src, alt: img.alt };
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

		// WooCommerce uses the old thickbox to let the user pick the product image.
		// WordPress updates #set-post-thumbnail (and _thumbnail_id) before removing
		// the thickbox overlay, so detecting #TB_overlay removal is the most
		// reliable signal that the image has been set or changed.
		const tbObserver = new MutationObserver( ( mutations ) => {
			for ( const mutation of mutations ) {
				for ( const node of mutation.removedNodes ) {
					if ( node.id === "TB_overlay" || node.id === "TB_window" ) {
						// Let any remaining synchronous DOM writes settle first.
						setTimeout( refresh, 0 );
						return;
					}
				}
			}
		} );
		tbObserver.observe( document.body, { childList: true } );
		cleanups.push( () => tbObserver.disconnect() );

		// Also watch .inside for the image-removal case (clicking "Remove product
		// image" does not go through the thickbox).
		const insideEl = document.getElementById( "set-post-thumbnail" )?.closest( ".inside" ) ??
			document.querySelector( "#postimagediv .inside" );
		if ( insideEl ) {
			const removalObserver = new MutationObserver( () => refresh() );
			removalObserver.observe( insideEl, { childList: true, subtree: true } );
			cleanups.push( () => removalObserver.disconnect() );
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

	return { featuredImage, isLoadingFeaturedImageAlt: isLoadingAlts };
};
