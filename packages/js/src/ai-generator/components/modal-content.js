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
	const learnMoreLink = useSelect( select => select( STORE ).selectLink( "https://www.yoa.st/ai-generator-learn-more" ), [] );
	const upsellLinkPremium = useSelect( select => select( STORE ).selectLink( "https://yoa.st/ai-generator-upsell" ), [] );
	const upsellLinkWooPremiumBundle = useSelect( select => select( STORE ).selectLink( "https://yoa.st/ai-generator-upsell-woo-seo-premium-bundle" ), [] );
	const upsellLinkWoo = useSelect( select => select( STORE ).selectLink( "https://yoa.st/ai-generator-upsell-woo-seo" ), [] );
	const isPremium = useSelect( select => select( STORE ).getIsPremium(), [] );
	const isWooSeoUpsell = useSelect( select => select( STORE ).getIsWooSeoUpsell(), [] );
	const isProduct = useSelect( select => select( STORE ).getIsProduct(), [] );
	const wooSeoNoPremium = isProduct && ! isWooSeoUpsell && ! isPremium;
	const isProductCopy = !! ( isWooSeoUpsell || wooSeoNoPremium );
	const postModalprops = {
		isProductCopy,
		upsellLink: upsellLinkPremium,
	};

	if ( isProductCopy ) {
		const upsellPremiumWooLabel = sprintf(
			/* translators: %1$s expands to Yoast SEO Premium, %2$s expands to Yoast WooCommerce SEO. */
			__( "%1$s + %2$s", "wordpress-seo" ),
			"Yoast SEO Premium",
			"Yoast WooCommerce SEO"
		);
		postModalprops.newToText = sprintf(
			/* translators: %1$s expands to Yoast SEO Premium and Yoast WooCommerce SEO. */
			__( "New in %1$s", "wordpress-seo" ),
			upsellPremiumWooLabel
		);
		postModalprops.title = __( "Generate product titles & descriptions with AI!", "wordpress-seo" );
		if ( ! isPremium && isWooSeoUpsell ) {
			postModalprops.upsellLabel = `${ sprintf(
				/* translators: %1$s expands to Woo Premium bundle. */
				__( "Unlock with the %1$s", "wordpress-seo" ),
				"Woo Premium bundle"
			)}*`;
			postModalprops.bundleNote = <div className="yst-text-xs yst-text-slate-500 yst-mt-2">
				{ `*${upsellPremiumWooLabel}` }
			</div>;
			postModalprops.upsellLink = upsellLinkWooPremiumBundle;
		}
		if ( isPremium ) {
			postModalprops.upsellLabel = sprintf(
				/* translators: %1$s expands to Yoast WooCommerce SEO. */
				__( "Unlock with %1$s", "wordpress-seo" ),
				"Yoast WooCommerce SEO"
			);
			postModalprops.upsellLink = upsellLinkWoo;
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
			{ ...postModalprops }
		/>
	);
};
