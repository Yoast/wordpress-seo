import { useDispatch, useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { STORE_NAME_EDITOR } from "../../ai-generator/constants";
import { useUpsellProps } from "../../ai-generator/hooks";
import { AIOptimizeUpsell } from "../../shared-admin/components";

/**
 * @returns {JSX.Element} The element.
 */
export const ModalContent = () => {
	const {
		premiumUpsellLink,
		wooUpsellLink,
		learnMoreLink,
		imageLink,
		wistiaEmbedPermissionValue,
		wistiaEmbedPermissionStatus,
	} = useSelect( ( select ) => {
		const storeSelect = select( STORE_NAME_EDITOR );
		return {
			premiumUpsellLink: storeSelect.selectLink( "https://yoa.st/ai-fix-assessments-upsell" ),
			wooUpsellLink: storeSelect.selectLink( "https://yoa.st/ai-fix-assessments-upsell-woo-seo" ),
			learnMoreLink: storeSelect.selectLink( "https://yoa.st/ai-fix-assessments-upsell-learn-more" ),
			imageLink: storeSelect.selectImageLink( "ai-fix-assessments-thumbnail.png" ),
			wistiaEmbedPermissionValue: storeSelect.selectWistiaEmbedPermissionValue(),
			wistiaEmbedPermissionStatus: storeSelect.selectWistiaEmbedPermissionStatus(),
		};
	}, [] );

	const upsellProps = useUpsellProps( { premium: premiumUpsellLink, woo: wooUpsellLink } );

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
		<AIOptimizeUpsell
			learnMoreLink={ learnMoreLink }
			thumbnail={ thumbnail }
			wistiaEmbedPermission={ wistiaEmbedPermission }
			{ ...upsellProps }
		/>
	);
};
