import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { AI_UPSELL, PRODUCT_CONTENT_TYPE, STORE_NAME } from "../constants";

/**
 * The bulk AI upsell props for the active content type: WooCommerce SEO on products, Yoast SEO Premium otherwise.
 *
 * @param {string} contentType The active content type.
 *
 * @returns {{upsellLabel: string, upsellLink: string, ctbId: string}} The upsell props for the modal CTA.
 */
export const useAiUpsell = ( contentType ) => {
	const isProduct = contentType === PRODUCT_CONTENT_TYPE;
	const target = isProduct ? AI_UPSELL.woo : AI_UPSELL.premium;
	const upsellLink = useSelect( ( select ) => select( STORE_NAME ).selectLink( target.link ), [ target.link ] );

	return useMemo( () => ( {
		upsellLink,
		ctbId: target.ctbId,
		upsellLabel: sprintf(
			/* translators: %1$s expands to "Yoast SEO Premium" or "Yoast WooCommerce SEO". */
			__( "Unlock with %1$s", "wordpress-seo" ),
			isProduct ? "Yoast WooCommerce SEO" : "Yoast SEO Premium"
		),
	} ), [ upsellLink, target.ctbId, isProduct ] );
};
