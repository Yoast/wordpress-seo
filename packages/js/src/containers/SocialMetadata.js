import { withSelect } from "@wordpress/data";
import SocialMetadata from "../components/social/SocialMetadata";

export default withSelect( select => {
	const {
		getPreferences,
	} = select( "yoast-seo/editor" );

	const {
		useOpenGraphData,
		useTwitterData,
	} = getPreferences();

	return {
		useOpenGraphData,
		useTwitterData,
	};
} )( SocialMetadata );
