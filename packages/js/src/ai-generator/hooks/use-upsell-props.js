import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { STORE_NAME_EDITOR } from "../constants";

/**
 * The upsell props.
 * @typedef {Object} UpsellProps
 * @property {string} upsellLink The URL for the upsell.
 * @property {string} [upsellLabel] The label for the upsell.
 * @property {string} [newToText] The "new to" text for the upsell.
 * @property {string} [ctbId] The CTB ID for the upsell.
 */

/**
 * Retrieves the upsell props based on the active licenses.
 * @param {Object} upsellLinks An object containing the upsell links and their associated data.
 * @param {string} upsellLinks.premium The Yoast SEO Premium upsell link .
 * @param {string} upsellLinks.woo The Yoast WooCommerce SEO upsell link.
 * @returns {UpsellProps} The upsell props.
 */
export const useUpsellProps = ( upsellLinks ) => {
	const { isWooCommerceActive, isProductEntity, isProductPost } = useSelect( select => {
		const editorSelect = select( STORE_NAME_EDITOR );
		return {
			isWooCommerceActive: editorSelect.getIsWooCommerceActive(),
			isProductEntity: editorSelect.getIsProductEntity(),
			isProductPost: editorSelect.getIsProduct(),
		};
	}, [] );

	return useMemo( () => {
		const upsellProps = {
			upsellLink: upsellLinks.premium,
			upsellLabel: sprintf(
				/* translators: %1$s expands to Yoast SEO Premium. */
				__( "Unlock with %1$s", "wordpress-seo" ),
				"Yoast SEO Premium"
			),
			newToText: "Yoast SEO Premium",
			ctbId: "f6a84663-465f-4cb5-8ba5-f7a6d72224b2",
			title: __( "Use AI to generate your titles & descriptions!", "wordpress-seo" ),
		};

		// Use specific copy for product posts and terms, otherwise revert to the defaults.
		if ( isWooCommerceActive && isProductEntity ) {
			if ( isProductPost ) {
				upsellProps.title = __( "Generate product titles & descriptions with AI!", "wordpress-seo" );
			}
			upsellProps.newToText = "Yoast WooCommerce SEO";

			upsellProps.upsellLabel = sprintf(
				/* translators: %1$s expands to Yoast WooCommerce SEO. */
				__( "Unlock with %1$s", "wordpress-seo" ),
				"Yoast WooCommerce SEO"
			);
			upsellProps.upsellLink = upsellLinks.woo;
			upsellProps.ctbId = "5b32250e-e6f0-44ae-ad74-3cefc8e427f9";
		}

		return upsellProps;
	}, [
		isWooCommerceActive,
		isProductEntity,
		isProductPost,
		upsellLinks.premium,
		upsellLinks.woo,
	] );
};
