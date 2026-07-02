import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { AI_UPSELL, AI_UPSELL_DESCRIPTION, LEARN_MORE_LINK, PRODUCT_CONTENT_TYPE, STORE_NAME } from "../constants";

/**
 * The bulk AI upsell props for the active content type: WooCommerce SEO on products, Yoast SEO Premium otherwise.
 *
 * @param {string} contentType The active content type.
 *
 * @returns {{upsellLabel: string, upsellLink: string, ctbId: string, learnMoreLink: string, description: string}} The upsell props for the modal.
 */
export const useAiUpsell = ( contentType ) => {
	const isProduct = contentType === PRODUCT_CONTENT_TYPE;
	const target = isProduct ? AI_UPSELL.woo : AI_UPSELL.premium;
	const upsellLink = useSelect( ( select ) => select( STORE_NAME ).selectLink( target.link ), [ target.link ] );
	const learnMoreLink = useSelect( ( select ) => select( STORE_NAME ).selectLink( LEARN_MORE_LINK ), [] );

	return useMemo( () => ( {
		upsellLink,
		ctbId: target.ctbId,
		upsellLabel: sprintf(
			/* translators: %1$s expands to "Yoast SEO Premium" or "Yoast WooCommerce SEO". */
			__( "Unlock with %1$s", "wordpress-seo" ),
			isProduct ? "Yoast WooCommerce SEO" : "Yoast SEO Premium"
		),
		learnMoreLink,
		description: isProduct
			? __( "Instantly create SEO titles, meta descriptions, and social metadata for all your products, posts, pages and more. Upgrade to unlock bulk AI generation and streamline your workflow.", "wordpress-seo" )
			: AI_UPSELL_DESCRIPTION,
	} ), [ upsellLink, target.ctbId, isProduct, learnMoreLink ] );
};
