import { useDispatch, useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { AiFixAssesments } from "../../shared-admin/components";
import { STORE_NAME_INTRODUCTIONS } from "../constants";

/**
 * @returns {JSX.Element} The element.
 */
export const Content = () => {
	const learnMoreLink = useSelect( select => select( STORE_NAME_INTRODUCTIONS ).selectLink( "https://yoa.st/ai-fix-assesments-learn-more" ), [] );
	const upsellLink = useSelect( select => select( STORE_NAME_INTRODUCTIONS ).selectLink( "https://yoa.st/ai-fix-assesments-upsell" ), [] );

	const imageLink = useSelect( select => select( STORE_NAME_INTRODUCTIONS ).selectImageLink( "ai-generator-preview.png" ), [] );
	const thumbnail = useMemo( () => ( {
		src: imageLink,
		width: "432",
		height: "244",
	} ), [ imageLink ] );

	const value = useSelect( select => select( STORE_NAME_INTRODUCTIONS ).selectWistiaEmbedPermissionValue(), [] );
	const status = useSelect( select => select( STORE_NAME_INTRODUCTIONS ).selectWistiaEmbedPermissionStatus(), [] );
	const { setWistiaEmbedPermission: set } = useDispatch( STORE_NAME_INTRODUCTIONS );
	const wistiaEmbedPermission = useMemo( () => ( { value, status, set } ), [ value, status, set ] );

	return (
		<AiFixAssesments
			learnMoreLink={ learnMoreLink }
			upsellLink={ upsellLink }
			thumbnail={ thumbnail }
			wistiaEmbedPermission={ wistiaEmbedPermission }
		/>
	);
};
