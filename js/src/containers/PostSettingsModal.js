import PostSettingsModal from "../components/modals/PostSettingsModal";
import { withSelect } from "@wordpress/data";

export default withSelect( select => {
	const {
		getPreferences,
	} = select( "yoast-seo/editor" );

	return {
		settings: getPreferences(),
	};
} )( PostSettingsModal );
