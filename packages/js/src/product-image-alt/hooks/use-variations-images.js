/* eslint-disable complexity */
import { useState, useEffect, useCallback } from "@wordpress/element";
import { fetchAttachmentAlts } from "../helpers";

/**
 *
 * @returns {object} The variation image.
 */
function getVariationImagesFromDOM() {
	const rows = document.querySelectorAll(
		"#variable_product_options .woocommerce_variations .woocommerce_variation"
	);

	return Array.from( rows ).map( ( row ) => {
		// Variation ID lives in input.variable_post_id
		const variationId =
            Number( row.querySelector( "input.variable_post_id" )?.value ) || null;

		// Image ID lives in input.upload_image_id inside .upload_image
		const imageIdInput = row.querySelector( ".upload_image .upload_image_id" );
		const imageId = Number( imageIdInput?.value ) || null;

		// Image src lives on the <img> inside .upload_image_button
		const img = row.querySelector( ".upload_image .upload_image_button img" );

		return {
			variationId,
			image: imageId
				? {
					id: imageId,
					src: img?.src ?? "",
					alt: img?.alt ?? "",
				}
				: null,
		};
	} );
}

/**
 * Returns the current variation images from the legacy product editor DOM,
 * kept in sync with image add/remove and alt text changes.
 *
 * @returns {{ variationImages: Array, isLoadingAlts: boolean }}
 */
export const useVariationImages = ( initialState ) => {
	// Seed state from PHP-provided data so the notice renders immediately on page
	// load, before WooCommerce appends variation rows to the DOM via AJAX.
	const [ variationImages, setVariationImages ] = useState(
		() => initialState ?? []
	);
	const [ isLoadingAlts, setIsLoadingAlts ] = useState( false );

	const refresh = useCallback( async() => {
		const domImages = getVariationImagesFromDOM();

		// If WooCommerce hasn't loaded variation rows into the DOM yet, keep the
		// PHP-initialized state rather than overwriting it with an empty array.
		if ( domImages.length === 0 ) {
			return;
		}

		// Immediately show DOM state so UI isn't stale while fetching.
		setVariationImages( domImages );

		const ids = domImages
			.map( ( v ) => v.image?.id )
			.filter( Boolean );

		if ( ! ids.length ) {
			return;
		}

		setIsLoadingAlts( true );
		const alts = await fetchAttachmentAlts( ids );

		setVariationImages(
			domImages.map( ( v ) => ( {
				...v,
				image: v.image
					? { ...v.image, alt: alts.get( v.image.id ) ?? v.image.alt }
					: null,
			} ) )
		);
		setIsLoadingAlts( false );
	}, [] );

	useEffect( () => {
		refresh();

		const cleanups = [];

		// Watch for variation rows being appended to .woocommerce_variations.
		// WooCommerce appends .woocommerce_variation rows there via AJAX.
		const variationsContainer = document.querySelector(
			"#variable_product_options .woocommerce_variations"
		);
		if ( variationsContainer ) {
			const rowObserver = new MutationObserver( () => refresh() );
			rowObserver.observe( variationsContainer, { childList: true } );
			cleanups.push( () => rowObserver.disconnect() );
		}

		// Also refresh on the woocommerce_load_variations AJAX success.
		// WooCommerce fires this automatically on page load for variable products,
		// so the rows may be inserted after the observer is set up.
		const onAjaxSuccess = ( _e, _xhr, settings ) => {
			if ( /action=woocommerce_load_variations/.test( settings.data ) ) {
				refresh();
			}
		};
		window.jQuery?.( document ).on( "ajaxSuccess", onAjaxSuccess );
		cleanups.push( () => window.jQuery?.( document ).off( "ajaxSuccess", onAjaxSuccess ) );

		// Watch for image changes: WooCommerce triggers 'change' on
		// input.upload_image_id when an image is set or removed.
		const $container = window.jQuery?.( "#variable_product_options" );
		$container?.on( "change", "input.upload_image_id", () => refresh() );
		cleanups.push( () => $container?.off( "change", "input.upload_image_id" ) );

		// Re-fetch alts when alt text is saved in the media modal.
		const onAttachmentSave = () => refresh();
		window.wp?.media?.on?.( "attachment:save", onAttachmentSave );
		cleanups.push( () => window.wp?.media?.off?.( "attachment:save", onAttachmentSave ) );

		return () => cleanups.forEach( ( fn ) => fn() );
	}, [ refresh ] );

	return { variationImages, isLoadingVariationImagesAlts: isLoadingAlts };
};
