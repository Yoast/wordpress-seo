import { useSelect } from "@wordpress/data";
import { AiGenerateTitlesAndDescriptionsUpsell } from "../../shared-admin/components";
import { STORE_NAME } from "../constants";

/**
 * @returns {JSX.Element} The element.
 */
export const Content = () => {
	const imageLink = useSelect( select => select( STORE_NAME ).selectImageLink( "ai-generator-preview.png" ), [] );
	const learnMoreLink = useSelect( select => select( STORE_NAME ).selectLink( "https://www.yoa.st/ai-generator-learn-more" ), [] );
	const upsellLink = useSelect( select => select( STORE_NAME ).selectLink( "https://yoa.st/ai-generator-upsell" ), [] );

	return (
		<AiGenerateTitlesAndDescriptionsUpsell
			imageLink={ imageLink }
			learnMoreLink={ learnMoreLink }
			upsellLink={ upsellLink }
		/>
	);
};
