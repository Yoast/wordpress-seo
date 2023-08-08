import { useSelect } from "@wordpress/data";
import { AiGenerateTitlesAndDescriptionsUpsell } from "../../shared-admin/components";

/**
 * @returns {JSX.Element} The element.
 */
export const ModalContent = () => {
	const imageLink = useSelect( select => select( "yoast-seo/editor" ).selectImageLink( "ai-generator-preview.png" ), [] );
	const learnMoreLink = useSelect( select => select( "yoast-seo/editor" ).selectLink( "https://yoa.st/ai-generator-learn-more" ), [] );
	const upsellLink = useSelect( select => select( "yoast-seo/editor" ).selectLink( "https://yoa.st/ai-generator-upsell" ), [] );

	return (
		<AiGenerateTitlesAndDescriptionsUpsell
			imageLink={ imageLink }
			learnMoreLink={ learnMoreLink }
			upsellLink={ upsellLink }
		/>
	);
};
