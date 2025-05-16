import { useDispatch, useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { AiGenerateTitlesAndDescriptionsUpsell } from "../../shared-admin/components";
import { STORE_NAME_EDITOR } from "../constants";

/**
 * The upsell props.
 * @typedef {Object} UpsellProps
 * @property {string} upsellLink The URL for the upsell.
 * @property {string} [upsellLabel] The label for the upsell.
 * @property {string} [newToText] The "new to" text for the upsell.
 * @property {JSX.Element} [bundleNote] A note about the bundle upsell.
 * @property {string} [ctbId] The CTB ID for the upsell.
 * @property {boolean} [isProductCopy] Whether the upsell is for product copy.
 * @property {function} setTryAi Callback to signal the generating should start.
 */

/**
 * Retrieves the upsell props based on the active licenses.
 * @param {Object} upsellLinks An object containing the upsell links and their associated data.
 * @param {string} upsellLinks.premium The Yoast SEO Premium upsell link .
 * @param {string} upsellLinks.woo The Yoast WooCommerce SEO upsell link.
 * @param {string} upsellLinks.bundle The bundle upsell link.
 * @returns {UpsellProps} The upsell props.
 */
export const getUpsellProps = ( upsellLinks ) => {
	const isPremiumActive = useSelect( select => select( STORE_NAME_EDITOR ).getIsPremium(), [] );
	const isWooSeoActive = useSelect( select => select( STORE_NAME_EDITOR ).getIsWooSeoActive(), [] );
	const isWooCommerceActive = useSelect( select => select( STORE_NAME_EDITOR ).getIsWooCommerceActive(), [] );

	const isProductPost = useSelect( select => select( STORE_NAME_EDITOR ).getIsProduct(), [] );
	const isProductTerm = useSelect( select => select( STORE_NAME_EDITOR ).getIsProductTerm(), [] );

	const upsellProps = {
		upsellLink: upsellLinks.premium,
		// The default ctbId is passed as a prop to the AiGenerateTitlesAndDescriptionsUpsell component.
	};

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
};

/**
 *
 * @param {function} setTryAi Callback to signal the generating should start.
 *
 * @returns {JSX.Element} The element.
 */
export const UpsellModalContent = ( { setTryAi } ) => {
	const upsellLinks = {
		premium: useSelect( select => select( STORE_NAME_EDITOR ).selectLink( "https://yoa.st/ai-generator-upsell" ), [] ),
		bundle: useSelect( select => select( STORE_NAME_EDITOR ).selectLink( "https://yoa.st/ai-generator-upsell-woo-seo-premium-bundle" ), [] ),
		woo: useSelect( select => select( STORE_NAME_EDITOR ).selectLink( "https://yoa.st/ai-generator-upsell-woo-seo" ), [] ),
	};

	const upsellProps = getUpsellProps( upsellLinks );

	// Use specific copy for product posts.
	const isWooCommerceActive = useSelect( select => select( STORE_NAME_EDITOR ).getIsWooCommerceActive(), [] );
	const isProductPost = useSelect( select => select( STORE_NAME_EDITOR ).getIsProduct(), [] );

	if ( isWooCommerceActive && isProductPost ) {
		upsellProps.title = __( "Generate product titles & descriptions with AI!", "wordpress-seo" );
		upsellProps.isProductCopy = true;
	}

	const learnMoreLink = useSelect( select => select( STORE_NAME_EDITOR ).selectLink( "https://yoa.st/ai-generator-learn-more" ), [] );

	const imageLink = useSelect( select => select( STORE_NAME_EDITOR ).selectImageLink( "ai-generator-preview.png" ), [] );
	const thumbnail = useMemo( () => ( {
		src: imageLink,
		width: "432",
		height: "244",
	} ), [ imageLink ] );

	const value = useSelect( select => select( STORE_NAME_EDITOR ).selectWistiaEmbedPermissionValue(), [] );
	const status = useSelect( select => select( STORE_NAME_EDITOR ).selectWistiaEmbedPermissionStatus(), [] );
	const { setWistiaEmbedPermission: set } = useDispatch( STORE_NAME_EDITOR );
	const wistiaEmbedPermission = useMemo( () => ( { value, status, set } ), [ value, status, set ] );

	return (
		<AiGenerateTitlesAndDescriptionsUpsell
			learnMoreLink={ learnMoreLink }
			thumbnail={ thumbnail }
			wistiaEmbedPermission={ wistiaEmbedPermission }
			setTryAi={ setTryAi }
			{ ...upsellProps }
		/>
	);
};
