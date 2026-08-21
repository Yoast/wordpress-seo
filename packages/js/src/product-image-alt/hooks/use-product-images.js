/* eslint-disable complexity */
import { useState, useEffect, useCallback } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";

/**
 * @typedef {Object} ProductImage
 * @property {number|null} id  The attachment ID, or null if unknown.
 * @property {string}      src The image URL.
 * @property {string}      alt The alt text.
 */

/**
 * @typedef {Object} VariationImage
 * @property {number|null}       variationId The variation post ID, or null if unknown.
 * @property {ProductImage|null} image       The variation's image, or null if unset.
 */

/**
 * @typedef {Object} ProductImagesState
 * @property {ProductImage|null} featuredImage The product's featured image, or null if unset.
 * @property {ProductImage[]}    galleryImages The product's gallery images (excluding the featured image).
 */

/**
 * @typedef {ProductImagesState & { variationImages: VariationImage[], isLoadingAlts: boolean }} ProductImages
 */

/**
 * Fetches fresh alt text for the given attachment IDs from the WP REST API.
 *
 * @param {number[]} ids
 * @returns {Promise<Map<number, string>>}
 */
async function fetchAttachmentAlts( ids ) {
	if ( ! ids.length ) {
		return new Map();
	}

	const entries = await Promise.all(
		ids.map( ( id ) =>
			apiFetch( { path: `/wp/v2/media/${ id }?_fields=id,alt_text` } )
				.then( ( media ) => [ media.id, media.alt_text ?? "" ] )
				.catch( () => [ id, "" ] )
		)
	);

	return new Map( entries );
}

/**
 * Reads featured image and gallery image IDs, src, and alt from the legacy editor DOM.
 * Alt text here is only reliable for server-rendered images (page load).
 * Newly added images via wp.media have no alt on the <img> tag.
 *
 * @returns {ProductImagesState}
 */
const getImagesFromDOM = () => {
	// --- Featured image ---
	const rawThumbnailId = Number( document.getElementById( "_thumbnail_id" )?.value );
	const thumbnailId = rawThumbnailId > 0 ? rawThumbnailId : null;
	const thumbnailImg = document.querySelector( "#set-post-thumbnail img" );
	const featuredImage = thumbnailId
		? {
			id: thumbnailId,
			src: thumbnailImg?.src ?? "",
			alt: thumbnailImg?.alt ?? "",
		}
		: null;

	// --- Gallery images ---
	const galleryItems = document.querySelectorAll(
		"#product_images_container ul.product_images li.image"
	);
	const galleryImages = Array.from( galleryItems ).map( ( li ) => {
		const img = li.querySelector( "img" );
		return {
			id: Number( li.dataset.attachment_id ) || null,
			src: img?.src ?? "",
			alt: img?.alt ?? "",
		};
	} );

	return { featuredImage, galleryImages };
};

/**
 * Merges fresh alt text from the REST API into the DOM state.
 *
 * @param {ProductImagesState} domState
 * @param {Map<number, string>} alts
 * @returns {ProductImagesState}
 */
function applyAlts( domState, alts ) {
	return {
		featuredImage: domState.featuredImage
			? {
				...domState.featuredImage,
				alt: alts.get( domState.featuredImage.id ) ?? domState.featuredImage.alt,
			}
			: null,
		galleryImages: domState.galleryImages.map( ( img ) => ( {
			...img,
			alt: alts.get( img.id ) ?? img.alt,
		} ) ),
	};
}

/**
 * Reads the current product images from the legacy editor DOM and keeps
 * them in sync with add / remove / reorder and alt text changes.
 * Variation images are delegated to useVariationImages.
 *
 * @returns {ProductImages}
 */
export const useProductImages = () => {
	const [ state, setState ] = useState( () => getImagesFromDOM() );
	const [ isLoadingAlts, setIsLoadingAlts ] = useState( false );

	/**
	 * Re-reads the DOM and fetches fresh alt text for featured and gallery images,
	 * then merges everything into state.
	 */
	const refresh = useCallback( async() => {
		const domState = getImagesFromDOM();

		const allIds = [
			domState.featuredImage?.id,
			...domState.galleryImages.map( ( img ) => img.id ),
		].filter( ( id ) => id > 0 );

		// Immediately update with DOM data so UI isn't stale while fetching.
		setState( domState );
		setIsLoadingAlts( true );

		const alts = await fetchAttachmentAlts( allIds );

		setState( applyAlts( domState, alts ) );
		setIsLoadingAlts( false );
	}, [] );

	useEffect( () => {
		// Initial load.
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

		// Re-run when the featured image is set, removed, or its alt text is edited.
		// The alt text is read from #set-post-thumbnail img after the change.
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

		// Re-run when attachment metadata (e.g. alt text) is saved via WordPress AJAX.
		// Covers: save-attachment-compat (classic editor detail panel), set-post-thumbnail.
		const onAjaxSuccess = ( _e, _xhr, settings ) => {
			if ( /action=(save-attachment|set-post-thumbnail)/.test( settings.data ) ) {
				refresh();
			}
		};
		window.jQuery?.( document ).on( "ajaxSuccess", onAjaxSuccess );
		cleanups.push( () => window.jQuery?.( document ).off( "ajaxSuccess", onAjaxSuccess ) );

		// Fallback: wp.media Backbone mediator (may fire in some WP versions).
		const onAttachmentSave = () => refresh();
		window.wp?.media?.on?.( "attachment:save", onAttachmentSave );
		cleanups.push( () => window.wp?.media?.off?.( "attachment:save", onAttachmentSave ) );

		return () => cleanups.forEach( ( fn ) => fn() );
	}, [ refresh ] );

	return {
		...state,
		isLoadingAlts: isLoadingAlts,
	};
};
