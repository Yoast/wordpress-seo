/* eslint-disable complexity */
import { useDispatch, useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { AiGenerateTitlesAndDescriptionsUpsell } from "../../shared-admin/components";
import { __, sprintf } from "@wordpress/i18n";

const STORE = "yoast-seo/editor";

/**
 * @returns {JSX.Element} The element.
 */
export const ModalContent = () => {
	const learnMoreLink = useSelect( select => select( STORE ).selectLink( "https://yoa.st/ai-generator-learn-more" ), [] );
	const upsellLinkPremium = useSelect( select => select( STORE ).selectLink( "https://yoa.st/ai-generator-upsell" ), [] );
	const upsellLinkWooPremiumBundle = useSelect( select => select( STORE ).selectLink( "https://yoa.st/ai-generator-upsell-woo-seo-premium-bundle" ), [] );
	const upsellLinkWoo = useSelect( select => select( STORE ).selectLink( "https://yoa.st/ai-generator-upsell-woo-seo" ), [] );

	const isPremiumActive = useSelect( select => select( STORE ).getIsPremium(), [] );
	const isWooSeoActive = useSelect( select => select( STORE ).getIsWooSeoActive(), [] );
	const isWooCommerceActive = useSelect( select => select( STORE ).getIsWooCommerceActive(), [] );

	const isProductPost = useSelect( select => select( STORE ).getIsProduct(), [] );
	const isProductTerm = useSelect( select => select( STORE ).getIsProductTerm(), [] );

	const upsellProps = {
		upsellLink: upsellLinkPremium,
	};

	// Use specific copy for product posts.
	if ( isWooCommerceActive && isProductPost ) {
		upsellProps.title = __( "Generate product titles & descriptions with AI!", "wordpress-seo" );
		upsellProps.isProductCopy = true;
	}

	// Use specific copy for product posts and terms, otherwise revert to the defaults.
	if ( isWooCommerceActive && ( isProductPost || isProductTerm ) ) {
		const upsellPremiumWooLabel = sprintf(
			/* translators: %1$s expands to Yoast SEO Premium, %2$s expands to Yoast WooCommerce SEO. */
			__( "%1$s + %2$s", "wordpress-seo" ),
			"Yoast SEO Premium",
			"Yoast WooCommerce SEO"
		);
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
			upsellProps.upsellLink = upsellLinkWoo;
		} else if ( ! isWooSeoActive ) {
			upsellProps.upsellLabel = `${sprintf(
				/* translators: %1$s expands to Woo Premium bundle. */
				__( "Unlock with the %1$s", "wordpress-seo" ),
				"Woo Premium bundle"
			)}*`;
			upsellProps.bundleNote = <div className="yst-text-xs yst-text-slate-500 yst-mt-2">
				{ `*${upsellPremiumWooLabel}` }
			</div>;
			upsellProps.upsellLink = upsellLinkWooPremiumBundle;
		}
	}

	const imageLink = useSelect( select => select( STORE ).selectImageLink( "ai-generator-preview.png" ), [] );
	const thumbnail = useMemo( () => ( {
		src: imageLink,
		width: "432",
		height: "244",
	} ), [ imageLink ] );

	const value = useSelect( select => select( STORE ).selectWistiaEmbedPermissionValue(), [] );
	const status = useSelect( select => select( STORE ).selectWistiaEmbedPermissionStatus(), [] );
	const { setWistiaEmbedPermission: set } = useDispatch( STORE );
	const wistiaEmbedPermission = useMemo( () => ( { value, status, set } ), [ value, status, set ] );

	return (
		<AiGenerateTitlesAndDescriptionsUpsell
			learnMoreLink={ learnMoreLink }
			thumbnail={ thumbnail }
			wistiaEmbedPermission={ wistiaEmbedPermission }
			{ ...upsellProps }
		/>
	);
};
