import { useDispatch, useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { STORE_NAME } from "../constants";
import { useSelectRedirects } from "../hooks";
import { UpsellModal } from "./upsell-modal";

/**
 * @returns {JSX.Element} The element.
 */
export const ModalContent = () => {
	const {
		link,
		imageLink,
		wistiaEmbedPermissionValue,
		wistiaEmbedPermissionStatus,
	} = useSelect( ( select ) => {
		const storeSelect = select( STORE_NAME );
		const isComingFromToolsPage = select( STORE_NAME ).selectPreference( "isComingFromToolsPage", false );

		return {
			link: isComingFromToolsPage ? "https://yoa.st/redirect-manager-upsell-tools" : "https://yoa.st/redirect-manager-upsell",
			imageLink: storeSelect.selectImageLink( "redirect-manager-thumbnail.png"  ),
			wistiaEmbedPermissionValue: storeSelect.selectWistiaEmbedPermissionValue(),
			wistiaEmbedPermissionStatus: storeSelect.selectWistiaEmbedPermissionStatus(),
		};
	}, [] );
	const upsellLinkContent = useSelectRedirects( "selectLink", [], link );

	const thumbnail = useMemo( () => ( {
		src: imageLink,
		width: "432",
		height: "244",
	} ), [ imageLink ] );

	const { setWistiaEmbedPermission } = useDispatch( STORE_NAME );
	const wistiaEmbedPermission = useMemo( () => ( {
		value: wistiaEmbedPermissionValue,
		status: wistiaEmbedPermissionStatus,
		set: setWistiaEmbedPermission,
	} ), [ wistiaEmbedPermissionValue, wistiaEmbedPermissionStatus, setWistiaEmbedPermission ] );

	return (
		<UpsellModal
			learnMoreLink={ "" }
			thumbnail={ thumbnail }
			wistiaEmbedPermission={ wistiaEmbedPermission }
			upsellLink={ upsellLinkContent }
		/>
	);
};
