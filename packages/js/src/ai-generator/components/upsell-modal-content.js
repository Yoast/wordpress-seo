import { useDispatch, useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { AiGenerateTitlesAndDescriptionsUpsell } from "../../shared-admin/components";
import { STORE_NAME_AI, STORE_NAME_EDITOR } from "../constants";
import { useUpsellProps } from "../hooks";

/**
 * @param {Function} setTryAi Callback to signal the generating should start.
 * @returns {JSX.Element} The element.
 */
export const UpsellModalContent = ( { setTryAi } ) => {
	const {
		premiumUpsellLink,
		bundleUpsellLink,
		wooUpsellLink,
		isWooCommerceActive,
		isProductPost,
		learnMoreLink,
		imageLink,
		wistiaEmbedPermissionValue,
		wistiaEmbedPermissionStatus,
		isUsageCountLimitReached,
	} = useSelect( ( select ) => {
		const aiSelect = select( STORE_NAME_AI );
		const editorSelect = select( STORE_NAME_EDITOR );
		return {
			premiumUpsellLink: editorSelect.selectLink( "https://yoa.st/ai-generator-upsell" ),
			bundleUpsellLink: editorSelect.selectLink( "https://yoa.st/ai-generator-upsell-woo-seo-premium-bundle" ),
			wooUpsellLink: editorSelect.selectLink( "https://yoa.st/ai-generator-upsell-woo-seo" ),
			isWooCommerceActive: editorSelect.getIsWooCommerceActive(),
			isProductPost: editorSelect.getIsProduct(),
			learnMoreLink: editorSelect.selectLink( "https://yoa.st/ai-generator-learn-more" ),
			imageLink: editorSelect.selectImageLink( "ai-generator-preview.png" ),
			wistiaEmbedPermissionValue: editorSelect.selectWistiaEmbedPermissionValue(),
			wistiaEmbedPermissionStatus: editorSelect.selectWistiaEmbedPermissionStatus(),
			isUsageCountLimitReached: aiSelect.isUsageCountLimitReached(),
		};
	}, [] );

	const upsellProps = useUpsellProps( { premium: premiumUpsellLink, woo: wooUpsellLink, bundle: bundleUpsellLink } );

	// Use specific copy for product posts.
	if ( isWooCommerceActive && isProductPost ) {
		upsellProps.title = __( "Generate product titles & descriptions with AI!", "wordpress-seo" );
		upsellProps.isProductCopy = true;
	} else {
		upsellProps.title = __( "Use AI to generate your titles & descriptions!", "wordpress-seo" );
	}

	const thumbnail = useMemo( () => ( {
		src: imageLink,
		width: "432",
		height: "244",
	} ), [ imageLink ] );

	const { setWistiaEmbedPermission } = useDispatch( STORE_NAME_EDITOR );
	const wistiaEmbedPermission = useMemo( () => ( {
		value: wistiaEmbedPermissionValue,
		status: wistiaEmbedPermissionStatus,
		set: setWistiaEmbedPermission,
	} ), [ wistiaEmbedPermissionValue, wistiaEmbedPermissionStatus, setWistiaEmbedPermission ] );

	return (
		<AiGenerateTitlesAndDescriptionsUpsell
			learnMoreLink={ learnMoreLink }
			thumbnail={ thumbnail }
			wistiaEmbedPermission={ wistiaEmbedPermission }
			setTryAi={ setTryAi }
			isLimitReached={ isUsageCountLimitReached }
			{ ...upsellProps }
		/>
	);
};
