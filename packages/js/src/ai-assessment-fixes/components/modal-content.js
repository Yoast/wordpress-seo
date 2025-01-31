import { useDispatch, useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { AiFixAssessmentsUpsell } from "../../shared-admin/components";
import { __, sprintf } from "@wordpress/i18n";

const STORE = "yoast-seo/editor";

/**
 * @returns {JSX.Element} The element.
 */
export const ModalContent = () => {
	const learnMoreLink = useSelect( select => select( STORE ).selectLink( "https://yoa.st/ai-fix-assessments-upsell-learn-more" ), [] );
	const upsellLinkPremium = useSelect( select => select( STORE ).selectLink( "https://yoa.st/ai-fix-assessments-upsell" ), [] );

	const postModalprops = {
		upsellLink: upsellLinkPremium,
		title: __( "Fix assessments with AI!", "wordpress-seo" ),
		upsellLabel: sprintf(
			/* translators: %1$s expands to Yoast SEO Premium. */
			__( "Unlock with %1$s", "wordpress-seo" ),
			"Yoast SEO Premium"
		),
	};

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
		<AiFixAssessmentsUpsell
			learnMoreLink={ learnMoreLink }
			thumbnail={ thumbnail }
			wistiaEmbedPermission={ wistiaEmbedPermission }
			{ ...postModalprops }
		/>
	);
};
