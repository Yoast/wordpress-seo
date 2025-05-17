import { useDispatch, useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { AIOptimizeUpsell } from "../../shared-admin/components";
import { getUpsellProps } from "../../ai-generator/components/modal-content";

const STORE = "yoast-seo/editor";

/**
 * @returns {JSX.Element} The element.
 */
export const ModalContent = () => {
	const upsellLinks = {
		premium: useSelect( select => select( STORE ).selectLink( "https://yoa.st/ai-fix-assessments-upsell" ), [] ),
		bundle: useSelect( select => select( STORE ).selectLink( "https://yoa.st/ai-fix-assessments-upsell-woo-seo-premium-bundle" ), [] ),
		woo: useSelect( select => select( STORE ).selectLink( "https://yoa.st/ai-fix-assessments-upsell-woo-seo" ), [] ),
	};

	const upsellProps = getUpsellProps( upsellLinks );

	const learnMoreLink = useSelect( select => select( STORE ).selectLink( "https://yoa.st/ai-fix-assessments-upsell-learn-more" ), [] );

	const imageLink = useSelect( select => select( STORE ).selectImageLink( "ai-fix-assessments-thumbnail.png" ), [] );
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
		<AIOptimizeUpsell
			learnMoreLink={ learnMoreLink }
			thumbnail={ thumbnail }
			wistiaEmbedPermission={ wistiaEmbedPermission }
			{ ...upsellProps }
		/>
	);
};
