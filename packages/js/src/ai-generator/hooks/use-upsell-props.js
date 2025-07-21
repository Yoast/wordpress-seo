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
 * @property {React.ReactNode} [bundleNote] A note about the bundle upsell.
 * @property {string} [ctbId] The CTB ID for the upsell.
 */

/**
 * Retrieves the upsell props based on the active licenses.
 * @param {Object} upsellLinks An object containing the upsell links and their associated data.
 * @param {string} upsellLinks.premium The Yoast SEO Premium upsell link .
 * @param {string} upsellLinks.woo The Yoast WooCommerce SEO upsell link.
 * @param {string} upsellLinks.bundle The bundle upsell link.
 * @returns {UpsellProps} The upsell props.
 */
export const useUpsellProps = ( upsellLinks ) => {
	const { isPremiumActive, isWooSeoActive, isWooProductEntity, isProductPost } = useSelect( select => {
		const editorSelect = select( STORE_NAME_EDITOR );
		return {
			isPremiumActive: editorSelect.getIsPremium(),
			isWooSeoActive: editorSelect.getIsWooSeoActive(),
			isWooProductEntity: editorSelect.getisWooProductEntity(),
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
			bundleNote: "",
			ctbId: "f6a84663-465f-4cb5-8ba5-f7a6d72224b2",
			title: __( "Use AI to generate your titles & descriptions!", "wordpress-seo" ),
		};

		// Use specific copy for product posts and terms, otherwise revert to the defaults.
		if ( isWooProductEntity ) {
			const upsellPremiumWooLabel = sprintf(
				/* translators: %1$s expands to Yoast SEO Premium, %2$s expands to Yoast WooCommerce SEO. */
				__( "%1$s + %2$s", "wordpress-seo" ),
				"Yoast SEO Premium",
				"Yoast WooCommerce SEO"
			);
			if ( isProductPost ) {
				upsellProps.title = __( "Generate product titles & descriptions with AI!", "wordpress-seo" );
			}
			upsellProps.newToText = sprintf(
				/* translators: %1$s expands to Yoast SEO Premium and Yoast WooCommerce SEO. */
				__( "New in %1$s", "wordpress-seo" ),
				upsellPremiumWooLabel
			);

			if ( isPremiumActive ) {
				upsellProps.upsellLabel = sprintf(
					/* translators: %1$s expands to Yoast WooCommerce SEO. */
					__( "Unlock with %1$s", "wordpress-seo" ),
					"Yoast WooCommerce SEO"
				);
				upsellProps.upsellLink = upsellLinks.woo;
				upsellProps.ctbId = "5b32250e-e6f0-44ae-ad74-3cefc8e427f9";
			} else if ( ! isWooSeoActive ) {
				upsellProps.upsellLabel = `${ sprintf(
					/* translators: %1$s expands to Woo Premium bundle. */
					__( "Unlock with the %1$s", "wordpress-seo" ),
					"Woo Premium bundle"
				) }*`;
				upsellProps.bundleNote = <div className="yst-text-xs yst-text-slate-500 yst-mt-2">
					{ `*${ upsellPremiumWooLabel }` }
				</div>;
				upsellProps.upsellLink = upsellLinks.bundle;
				upsellProps.ctbId = "c7e7baa1-2020-420c-a427-89701700b607";
			}
		}

		return upsellProps;
	}, [
		isPremiumActive,
		isWooSeoActive,
		isWooProductEntity,
		upsellLinks.premium,
		upsellLinks.woo,
		upsellLinks.bundle,
	] );
};
